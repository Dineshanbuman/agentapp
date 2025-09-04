import Image from "next/image";
import Chat from "./Chat";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Chat/>
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
            This POC project create for{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              Wendys
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Click the icon in lower bottom to proceed
          </li>
        </ol>          
      </main>
    </div>
  );
}
