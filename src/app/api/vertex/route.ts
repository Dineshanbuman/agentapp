import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

async function getSessionId(token:string) {
   const cookieStore = await cookies();
   let sessionId = cookieStore.get('wendySessionChatID')?.value;
  if (!sessionId) {
    sessionId = uuidv4();
    const session = await fetch(
      `https://adktest-new-499439765550.us-central1.run.app/apps/wendys_agent_new6/users/user_123/sessions/${sessionId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"state": {"preferred_language": "English", "visit_count": 5}}),
    });

    cookieStore.set('wendySessionChatID', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  }
  return sessionId;
}


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
      // scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    // const client = await auth.getClient();
    // const tokenResponse = await client.getAccessToken();

    const targetAudience = "https://adktest-new-499439765550.us-central1.run.app";
    const client = await auth.getIdTokenClient(targetAudience);
    // const tokenResponse = await client.getAccessToken();

    const tokenHeaders:any = await client.getRequestHeaders();
    console.log(tokenHeaders)
    const authHeader = typeof tokenHeaders.get === "function"
    ? tokenHeaders.get("authorization")
    : tokenHeaders["authorization"]?.value;
    
    const token = authHeader?.split("Bearer ")[1];
    console.log(token)


    if (!token) {
      throw new Error("Failed to obtain OAuth access token");
    }

  //   // const token = tokenResponse.token;
    const sessionID = await getSessionId(token)

  // const data = await session.json();
  // console.log("Response JSON:", data);
  // const sessionId = data?.output?.id
    // Call Vertex AI 
    const response = await fetch(
      "https://adktest-new-499439765550.us-central1.run.app/run",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "app_name": "wendys_agent_new6",
          "user_id": "user_123",
          "session_id": sessionID,
          "new_message": {
            "role": "user",
            "parts": [{
              "text": prompt
        }]
    },
    "streaming": false
    }),
      }
    );
    
    const response_msg = await response.json();
    // function getFirstDataObject(inputString: string) {
    //   const lines = inputString.split(/\r?\n/);
    //   for (const line of lines) {
    //     const trimmed = line.trim();
    //     if (trimmed.startsWith('data:')) {
    //       const jsonPart = trimmed.replace(/^data:\s*/, '');
    //       try {
    //         return JSON.parse(jsonPart);
    //       } catch (error) {
    //         console.error('Failed to parse JSON:', error);
    //         return null;
    //       }
    //     }
    //   }
    // }
    // const jsonString = getFirstDataObject(response_msg)
    // const jsonString = response_msg.slice(6)
    let result="";
    console.log('parsing response')
    console.log(response_msg)
    for (const item of response_msg) {
      console.log(item)
      console.log(item?.content?.parts?.[0]?.text)
      const text = item?.content?.parts?.[0]?.text;
      if (text) {
      // result += text.trim() + "\n"; // only push if text exists
      result = text.trim() + "\n"; // only push if text exists
      }
    }
  console.log("parsing completed")
  console.log(result)

  return NextResponse.json(result);
    // console.log("jsonString:", jsonString);
    // const data = jsonString;
    // let responseText = data?.content?.parts?.[0]?.text?.trim()
    // console.log("responseText:", data?.content?.parts?.[0]);
    // responseText = responseText ? responseText : ""
    
    // return  NextResponse.json(responseText);
  } catch (err: any) {
    console.error("Vertex API error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
 
  }
}
