import { db } from "@/db/db";
import { chatTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { frameId: string } }
) {
  const { frameId } = params;

  const result = await db
    .select()
    .from(chatTable)
    .where(eq(chatTable.frameId, frameId))
    .limit(1);

  return NextResponse.json(result.length ? result[0].chatMessage : []);
}

export async function PUT(req: NextRequest) {
  try {
    const { messages, frameId, createdBy } = await req.json();

    // TODO: persist to DB. Example (Drizzle) — uncomment and adapt:
    // import { db } from "@/lib/db";
    // import { chatTable } from "@/db/schema";
    // const inserted = await db.insert(chatTable).values({
    //   chatMessage: messages, // or chatMessages depending on your schema
    //   frameId,
    //   createdBy,
    // }).returning();

    console.log("PUT /api/chats payload:", { messages, frameId, createdBy });
    return NextResponse.json({ ok: true, saved: true /*, inserted */ });
  } catch (err: any) {
    console.error("PUT /api/chats error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// Optional: accept POST as well (forward to same logic)
export async function POST(req: NextRequest) {
  return PUT(req);
}
