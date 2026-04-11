import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API route: POST /api/subscribe
 *
 * When someone enters their email and clicks "Subscribe", this code runs.
 * It saves the email to a JSON file at /data/subscribers.json.
 *
 * In plain English:
 * 1. Receive the email from the form
 * 2. Read the existing subscribers file (or create it if it doesn't exist)
 * 3. Check if the email is already in there (no duplicates)
 * 4. Add the new email with the current date
 * 5. Save the file
 */

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

interface Subscriber {
  email: string;
  subscribedAt: string;
}

function getSubscribers(): Subscriber[] {
  if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
  const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf-8");
  return JSON.parse(raw);
}

function saveSubscribers(subscribers: Subscriber[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const subscribers = getSubscribers();

    // Check for duplicates
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 }
      );
    }

    // Add the new subscriber
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });

    saveSubscribers(subscribers);

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
