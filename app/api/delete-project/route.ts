import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { projectTable, frameTable, chatTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Verify project exists and belongs to the user
    const proj = await db
      .select()
      .from(projectTable)
      .where(eq(projectTable.projectId, projectId));

    if (!proj.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Security: ensure owner
    const owner = proj[0].createdBy;
    if (owner !== userEmail) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get all frameIds for this project
    const frames = await db
      .select({ frameId: frameTable.frameId })
      .from(frameTable)
      .where(eq(frameTable.projectId, projectId));

    const frameIds = frames.map((f: any) => f.frameId);

    // Delete chats for those frames (only if there are any)
    if (frameIds.length > 0) {
      await db
        .delete(chatTable)
        .where(inArray(chatTable.frameId, frameIds));
    }

    // Delete frames
    await db
      .delete(frameTable)
      .where(eq(frameTable.projectId, projectId));

    // Delete project
    await db
      .delete(projectTable)
      .where(eq(projectTable.projectId, projectId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
