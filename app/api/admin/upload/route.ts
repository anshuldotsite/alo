import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SIZE_MB = 5;

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return false;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.endsWith(SESSION_SECRET);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("logo") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use PNG, JPG, WebP, or SVG." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File too large. Max ${MAX_SIZE_MB}MB.` }, { status: 400 });
  }

  const ext = file.type === "image/svg+xml" ? "svg"
    : file.type === "image/webp" ? "webp"
    : file.type === "image/jpeg" ? "jpg"
    : "png";

  // Always save as logo.<ext> in public/images/
  const filename = `logo.${ext}`;
  const destPath = path.join(process.cwd(), "public", "images", filename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  fs.writeFileSync(destPath, buffer);

  const logoUrl = `/images/${filename}`;

  // Update content.json theme.logoUrl
  const contentPath = path.join(process.cwd(), "data", "content.json");
  const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
  content.theme.logoUrl = logoUrl;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

  return NextResponse.json({ success: true, url: logoUrl });
}
