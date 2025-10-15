"use client";

import Image from "next/image";
import Chat from "./Chat";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext"; // adjust if needed
import Script from "next/script";
import ServiceNowChatWidget from "./ServiceNowChatWidget";

export default function Home() {
  const router = useRouter();
  const { email } = useAuth();

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  // Prevent showing content before auth check
  if (!email) return null; // or <div>Loading...</div>

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Chat />
        <ServiceNowChatWidget />
        <Image
          className="dark:invert"
          src="/image.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            This POC project created for{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              Wendys
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Click the icon in lower bottom to proceed
          </li>
        </ol>

        {/* ✅ Contact Customer Care Button */}
        <button
          onClick={() =>
            window.open(
              "https://wendysdev.service-now.com/$sn-va-web-client-app.do?sysparm_preview_window=false&classic_view=true#/preview?sysparm_preview_mode=false&sysparm_topic=b7a0c080c3a4761061ede815990131b1&sysparm_initial_topic_type=STANDARD&cbTopicId=2eec43e5c3dcf21061ede815990131d0&testable=false&readOnly=false&publishedTopicId=4e5feb61c314361061ede81599013194&unpublishedChanges=false",
              "_blank"
            )
          }
          className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition cursor-pointer"
        >
          Contact Customer Care
        </button>
      </main>
    </div>
  );
}
