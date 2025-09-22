import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Clear the session cookie by setting an expired date
  cookieStore.set("wendySessionChatID", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // expire now
    path: "/",
  });

  return NextResponse.json({ message: "Session cleared" });
}
