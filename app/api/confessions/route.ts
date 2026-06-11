import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "confessions.json");

interface Confession {
  id: string;
  text: string;
  ts: number;
}

function read(): Confession[] {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); }
  catch { return []; }
}
function write(c: Confession[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(c, null, 2));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }
  const trimmed = text.trim().slice(0, 120);
  if (!trimmed) {
    return NextResponse.json({ error: "Empty" }, { status: 400 });
  }
  const confessions = read();
  const entry: Confession = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: trimmed,
    ts: Date.now(),
  };
  confessions.unshift(entry); // newest first
  write(confessions);
  return NextResponse.json(entry, { status: 201 });
}
