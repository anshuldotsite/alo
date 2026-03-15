import { NextRequest, NextResponse } from "next/server";

const CLOVER_BASE = "https://api.clover.com";
const MERCHANT_ID = process.env.CLOVER_MERCHANT_ID!;
const API_TOKEN = process.env.CLOVER_API_TOKEN!;

const cloverHeaders = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

interface CartItem {
  id: string;
  name: string;
  price: number; // in dollars
}

interface OrderForm {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

interface RequestBody {
  cart: Record<string, number>;
  form: OrderForm;
  cartItems: CartItem[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { cart, form, cartItems }: RequestBody = await request.json();

    // Debug: log token/merchant so we can verify .env loaded correctly
    console.log(`[Clover] Merchant: ${MERCHANT_ID}`);
    console.log(`[Clover] Token: ${API_TOKEN?.slice(0, 8)}...`);

    // 1. Create the order
    const orderRes = await fetch(
      `${CLOVER_BASE}/v3/merchants/${MERCHANT_ID}/orders`,
      {
        method: "POST",
        headers: cloverHeaders,
        body: JSON.stringify({
          title: `Online Order — ${form.name}`,
          note: form.notes
            ? `Customer: ${form.name} | Phone: ${form.phone} | Notes: ${form.notes}`
            : `Customer: ${form.name} | Phone: ${form.phone}`,
          state: "open",
        }),
      }
    );

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      console.error(`[Clover] Create order failed (${orderRes.status}):`, errText);
      return NextResponse.json(
        { error: `Clover ${orderRes.status}: ${errText}` },
        { status: orderRes.status }
      );
    }

    const order = await orderRes.json();
    const orderId: string = order.id;
    console.log(`[Clover] Order created: ${orderId}`);

    // 2. Add line items one by one
    const lineItemResults = [];
    for (const item of cartItems) {
      const qty = cart[item.id] || 1;
      const lineItemRes = await fetch(
        `${CLOVER_BASE}/v3/merchants/${MERCHANT_ID}/orders/${orderId}/line_items`,
        {
          method: "POST",
          headers: cloverHeaders,
          body: JSON.stringify({
            item: { id: item.id },
            name: item.name,
            price: Math.round(item.price * 100),
            unitQty: qty * 1000, // Clover uses 1000 = 1 unit
            printed: false,
          }),
        }
      );

      if (!lineItemRes.ok) {
        const err = await lineItemRes.text();
        console.error(`[Clover] Line item error for ${item.name}:`, err);
      } else {
        const lineItem = await lineItemRes.json();
        lineItemResults.push(lineItem);
      }
    }

    return NextResponse.json(
      { orderId, lineItems: lineItemResults },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Clover] Order route error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
