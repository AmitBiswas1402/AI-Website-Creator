import { db } from "@/db/db";
import { chatTable, frameTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, newName } = await req.json();
  const user = await currentUser();

  if (!projectId || !newName) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Find the frame belonging to this project
  const frame = await db
    .select()
    .from(frameTable)
    .where(eq(frameTable.projectId, projectId))
    .limit(1);

  if (!frame.length) {
    return NextResponse.json({ error: "Frame not found" }, { status: 404 });
  }

  // Find the first chat of that frame (acts as the title)
  const [firstChat] = await db
    .select()
    .from(chatTable)
    .where(
      and(
        eq(chatTable.frameId, frame[0].frameId),
        //@ts-ignore
        eq(chatTable.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
    )
    .limit(1);

  if (!firstChat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  // Update only that first chat
  await db
    .update(chatTable)
    .set({ chatMessage: newName })
    .where(eq(chatTable.id, firstChat.id));

  return NextResponse.json({ success: true });
}
