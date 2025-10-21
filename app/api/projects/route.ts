import { db } from "@/db/db";
import { chatTable, frameTable, projectTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {projectId, frameId, messages} = await req.json();
    const user = await currentUser();

    await db.insert(projectTable).values({
        projectId,
        createdBy: user?.primaryEmailAddress?.emailAddress  
    })

    await db.insert(frameTable).values({
        frameId,
        projectId: projectId
    })

    await db.insert(chatTable).values({
        chatMessage: messages,
        createdBy: user?.primaryEmailAddress?.emailAddress
    })

    return NextResponse.json({
        projectId, frameId, messages
    })
}