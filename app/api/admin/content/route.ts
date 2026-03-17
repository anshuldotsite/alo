import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;
const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return false;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    // Format: username:timestamp:SECRET
    const colonIdx = decoded.lastIndexOf(`:${SESSION_SECRET}`);
    return colonIdx !== -1 && decoded.endsWith(SESSION_SECRET);
  } catch {
    return false;
  }
}

function readContent() {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeContent(data: unknown) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET — read all content
export async function GET(_req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = readContent();
  return NextResponse.json(content);
}

// PUT — update content (full or partial section)
export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const current = readContent();
  const updated = { ...current, ...body };
  writeContent(updated);
  return NextResponse.json({ success: true, content: updated });
}
