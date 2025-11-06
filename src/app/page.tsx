'use client';

import Image from "next/image";
import Chat from "./Chat";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { email } = useAuth();

  useEffect(() => {
    if (!email) router.push("/login");
  }, [email, router]);

  if (!email) return null; // or a loading spinner

  return (
    <div className="font-[var(--font-primary)] grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-wendys-white text-wendys-gray10">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Chat />

        <Image
          src="/image.png"
          alt="Wendy’s logo"
          width={180}
          height={38}
          priority
        />

        <ol className="font-[var(--font-secondary)] list-inside list-decimal text-sm text-center sm:text-left">
          <li className="mb-2">
            This personalization platform prototype was crafted for{" "}
            <code className="bg-wendys-red/10 text-wendys-red font-semibold px-1 py-0.5 rounded">
              Wendy’s
            </code>
            .
          </li>
          <li>Tap the chat icon below to start a conversation.</li>
        </ol>
      </main>
    </div>
  );
}
