"use client";
import { useParams } from "next/navigation";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatTimeRemaining } from "@/lib/utils";
import { useRef, useState } from "react";
import { ChevronRight, Flame, Send } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
// import { Metadata } from "next";

// interface RoomParams {
//   params: Promise<{ roomId: string }>;
// }

// export const generateMetadata = async ({
//   params,
// }: RoomParams): Promise<Metadata> => {
//   const { roomId } = await params;

//   return {
//     title: `Room ${roomId}`,
//     description: `Room ${roomId}`,
//   };
// };

const RoomPage = () => {
  const params = useParams();
  const { isCopied, copy } = useCopyToClipboard();
  const roomId = params.roomId as string;

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-zinc-50 dark:bg-green-950">
      <header className="border-b border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-green-700 dark:text-green-300 uppercase">
              Room ID
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500 truncate">
                {roomId.length > 10 ? roomId.slice(0, 10) + "..." : roomId}
              </span>
              <button
                onClick={() => copy(window.location.href)}
                className="text-sm bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-white hover:text-zinc-200 transition-colors cursor-pointer"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-xs text-green-700 dark:text-green-300 uppercase">
              Self-Destruct
            </span>
            <span
              className={`text-sm font-bold flex items-center gap-2 ${
                timeRemaining !== null && timeRemaining < 60
                  ? "text-red-500"
                  : "text-amber-500"
              }`}
            >
              {timeRemaining !== null
                ? formatTimeRemaining(timeRemaining)
                : "--:--"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <button
            onClick={() => {
              // TODO: Implement room destruction logic
            }}
            className="text-sm bg-zinc-800 hover:bg-red-600 p-3 text-white hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50 rounded-2xl cursor-pointer uppercase"
          >
            <Flame className="size-5 group-hover:animate-pulse" />
            <span className="md:block hidden">destroy now</span>
          </button>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"></div>

      <div className="p-4 border-t border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900">
        <div className="flex gap-2">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              <ChevronRight className="size-4" />
            </span>
            <input
              autoFocus
              type="text"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  // TODO: SEND MESSAGE
                  inputRef.current?.focus();
                }
              }}
              placeholder="Type message..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-300 py-3 pl-8 pr-4 text-sm rounded-2xl"
            />
          </div>

          <button
            onClick={() => {
              // TODO: SEND MESSAGE
              inputRef.current?.focus();
            }}
            disabled={!input.trim()}
            className="flex flex-row items-center gap-1 md:gap-2 bg-green-600 dark:bg-green-500 text-white dark:text-black px-6 text-sm font-bold hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:cursor-not-allowed cursor-pointer uppercase rounded-2xl"
          >
            <Send className="size-4" />
            <span className="md:block hidden">send</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default RoomPage;
