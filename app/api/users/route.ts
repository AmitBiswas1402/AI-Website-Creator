import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
//     }

//     const email = user.primaryEmailAddress?.emailAddress;
//     if (!email) {
//       return NextResponse.json({ error: "Email not found" }, { status: 400 });
//     }

//     const userResult = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.email, email));

//     if (userResult.length === 0) {
//         const data = {
//             name: user.fullName ?? "NA",
//             email: email,
//             credits: 2
//         }
//       const result = await db.insert(usersTable).values({
//         ...data
//       }).returning();

//       return NextResponse.json({ created: true, user: data });
//     }

//     return NextResponse.json({ created: false, user: userResult[0] });
//   } catch (error) {
//     console.error("DB ERROR:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   const user = await currentUser();

//   const userResult = await db
//     .select()
//     .from(usersTable)
//     // @ts-ignore
//     .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

//   if (userResult?.length == 0) {
//     const result = await db.insert(usersTable).values({
//       name: user?.fullName ?? "NA",
//       email: user?.primaryEmailAddress?.emailAddress ?? "",
//     });
//   }

//   return NextResponse.json({ user });
// }

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const email = user.primaryEmailAddress?.emailAddress ?? "";

  // Check if user exists
  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  // If no user exists, insert with default credits
  if (userResult.length === 0) {
    const result = await db.insert(usersTable).values({
      name: user.fullName ?? "NA",
      email: email,
      credits: 2, 
    }).returning();

    return NextResponse.json({ created: true, user: result[0] });
  }

  // If user already exists, return existing user
  return NextResponse.json({ created: false, user: userResult[0] });
}

