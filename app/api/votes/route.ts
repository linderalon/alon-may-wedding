import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "votes.json");

type Votes = Record<string, number>;
type AllPolls = Record<string, Votes>;

const DEFAULT_POLLS: AllPolls = {
  whoCries: { may: 0, alon: 0, "alons-mom": 0, "mays-mom": 0, "no-one": 0 },
  glassBreak: { one: 0, two: 0, "three-plus": 0 },
  entranceSong: { rnb: 0, "heavy-metal": 0, "classic-hebrew": 0, "middle-eastern": 0 },
};

function read(): AllPolls {
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
    // migrate legacy single-poll shape (flat candidate -> count) to the whoCries poll
    if (!("whoCries" in parsed) && "may" in parsed) {
      return { ...DEFAULT_POLLS, whoCries: parsed };
    }
    return { ...DEFAULT_POLLS, ...parsed };
  } catch {
    return DEFAULT_POLLS;
  }
}

function write(v: AllPolls) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(v, null, 2));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const { poll, candidate } = await req.json();
  const polls = read();
  if (!(poll in polls) || !(candidate in polls[poll])) {
    return NextResponse.json({ error: "Invalid poll or candidate" }, { status: 400 });
  }
  polls[poll][candidate]++;
  write(polls);
  return NextResponse.json(polls);
}
