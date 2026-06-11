import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "votes.json");

type Votes = Record<string, number>;

function read(): Votes {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { may: 0, alon: 0, "alons-mom": 0, "mays-mom": 0, "no-one": 0 };
  }
}

function write(v: Votes) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(v, null, 2));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const { candidate } = await req.json();
  const votes = read();
  if (!(candidate in votes)) {
    return NextResponse.json({ error: "Invalid candidate" }, { status: 400 });
  }
  votes[candidate]++;
  write(votes);
  return NextResponse.json(votes);
}
