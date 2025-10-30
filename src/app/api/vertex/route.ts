import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log(prompt);

  // === Token generation (unchanged) ===
  const auth = new GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: "agentspace-pa",
      private_key_id: process.env.GCP_PRIVATE_KEY_ID!,
      private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      client_email: process.env.GCP_CLIENT_EMAIL!,
      client_id: process.env.GCP_CLIENT_ID!,
    },
  });

  const targetAudience = "https://adktest-cicd-499439765550.us-central1.run.app";
  const client = await auth.getIdTokenClient(targetAudience);
  const tokenHeaders: any = await client.getRequestHeaders();
  console.log(tokenHeaders);

  const authHeader =
    typeof tokenHeaders.get === "function"
      ? tokenHeaders.get("authorization")
      : tokenHeaders["authorization"]?.value;

  const token = authHeader?.split("Bearer ")[1];
  console.log(token);

  if (!token) {
    throw new Error("Failed to obtain OAuth access token");
  }
  // === End token section ===

  console.log("session creation started");
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("wendySessionChatID")?.value;
  console.log(sessionId);

  if (!sessionId) {
    sessionId = uuidv4();
    const session = await fetch(
      `${targetAudience}/apps/agent_adk_chatbot/users/user_soundaryatest/sessions/${sessionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: { preferred_language: "English", visit_count: 5 },
        }),
      }
    );
    console.log("Session creation status:", session.status);
    const sessionResponse = await session.text();
    console.log("Session creation response:", sessionResponse);
  }

  console.log("session creation completed", sessionId);

  const response = await fetch(`${targetAudience}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_name: "agent_adk_chatbot",
      user_id: "user_soundaryatest",
      session_id: sessionId,
      new_message: {
        role: "user",
        parts: [{ text: prompt }],
      },
      streaming: false,
    }),
  });

  console.log("post method completed");
  const response_msg = await response.json();
  console.log(response_msg)

  let result = "";
  console.log("parsing response");
  if (Array.isArray(response_msg)) {
    for (const item of response_msg) {
      const text = item?.content?.parts?.[0]?.text;
      if (text) result = text.trim() + "\n";
    }
  } else {
    const text = response_msg?.content?.parts?.[0]?.text;
    if (text) result = text.trim() + "\n";
  }

  console.log("parsing completed", result);

  // ✅ Return response + set cookie here
  const res = NextResponse.json(result);
  res.cookies.set("wendySessionChatID", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}
