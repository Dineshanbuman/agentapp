import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

export async function POST(req: Request) {
  try {
    // Get JSON body from client request
    const { prompt } = await req.json();
    console.log(prompt)

    // Authenticate with service account
    const auth = new GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: "agentspace-pa",
        private_key_id: process.env.GCP_PRIVATE_KEY_ID!,
        private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        client_email: process.env.GCP_CLIENT_EMAIL!,
        client_id: process.env.GCP_CLIENT_ID!,
      },
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    if (!tokenResponse.token) {
      throw new Error("Failed to obtain OAuth access token");
    }

    const token = tokenResponse.token;

  //   const session = await fetch(
  //   "https://us-central1-aiplatform.googleapis.com/v1/projects/agentspace-pa/locations/us-central1/reasoningEngines/8792741710766538752:query",
  //   {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
      
  //     body: JSON.stringify({
  //       "class_method": "async_create_session",
  //       "input": {
  //         "user_id": "test_dinesh",
  //         // session_id: "2682846304924598272"
  //       },
  //     }),
  //   }
  // );
  const url = "https://adktestsecured-1010458825042.us-central1.run.app/apps/multi_tool_agent/users/user_123/sessions/session_abc"
  const session = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: {
        preferred_language: "English",
        visit_count: 5
      }
    }),
  });


  const data = await session.json();
  console.log("Response JSON:", data?.output?.id);
  const sessionId = data?.output?.id
  const tool_url = "https://adktestsecured-1010458825042.us-central1.run.app/run_sse";
  const response = await fetch(tool_url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_name: "multi_tool_agent",
      user_id: "user_123",
      session_id: sessionId,
      new_message: {
        role: "user",
        parts: [
          {
            text: prompt
          }
        ],
      },
      streaming: true,
    }),
  });
    // Call Vertex AI 
    // const response = await fetch(
    //   "https://us-central1-aiplatform.googleapis.com/v1/projects/agentspace-pa/locations/us-central1/reasoningEngines/8792741710766538752:streamQuery?alt=sse",
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       "class_method": "stream_query",
    //       "input": {
    //         "user_id": "test_dinesh",
    //         "session_id": sessionId,
    //         "message":prompt
    //       },
    //     }),
    //   }
    // );
    
    const response_msg = await response.json();
    const response_message = response_msg?.content?.parts[0].text;
    console.log("Response JSON:", response_message);

    // if (!response.ok) {
    //   const err = await response.json();
    //   throw new Error(JSON.stringify(err));
    // }

    return  NextResponse.json(response_message);
  } catch (err: any) {
    console.error("Vertex API error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
