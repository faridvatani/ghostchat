"use client";
import { useParams, useRouter } from "next/navigation";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatTimeRemaining } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, Flame, Loader2, Send } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { format } from "date-fns";
import { useUsername } from "@/hooks/use-username";
import { useRealtime } from "@/lib/realtime-client";


const RoomPage = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();
  const { username } = useUsername();
  const { isCopied, copy } = useCopyToClipboard();

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: ttlData, isError: ttlError } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } });
      return res.data;
    },
    staleTime: Infinity, // TTL is calculated client-side after initial fetch
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (ttlData?.ttl !== undefined) setTimeRemaining(ttlData.ttl);
  }, [ttlData]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return;

    if (timeRemaining === 0) {
      router.push("/?destroyed=true");
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } });
      return res.data;
    },
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post(
        { sender: username, text },
        { query: { roomId } }
      );

      setInput("");
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch();
      }

      if (event === "chat.destroy") {
        router.push("/?destroyed=true");
      }
    },
  });

  const { mutate: destroyRoom, isPending: isDestroying } = useMutation({
    mutationFn: async () => {
      await client.room.delete(null, { query: { roomId } });
    },
  });

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
            onClick={() => destroyRoom()}
            disabled={isDestroying}
            className="text-sm bg-zinc-800 hover:bg-red-600 p-3 text-white hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50 rounded-2xl cursor-pointer uppercase"
          >
            <Flame className="size-5 group-hover:animate-pulse" />
            <span className="md:block hidden">destroy now</span>
          </button>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-green-700 dark:text-green-300 text-base font-mono">
              No messages yet, start the conversation.
            </p>
          </div>
        )}

        {messages?.messages.map((msg) => (
          <div key={msg.id} className="flex flex-col items-start">
            <div className="max-w-[80%] group">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className={`text-xs font-bold ${
                    msg.sender === username
                      ? "text-green-700 dark:text-green-300"
                      : "text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {msg.sender === username ? "YOU" : msg.sender}
                </span>

                <span className="text-[10px] text-green-700 dark:text-green-300">
                  {format(msg.timestamp, "HH:mm")}
                </span>
              </div>

              <p className="text-sm text-black dark:text-white leading-relaxed break-all">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

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
                  sendMessage({ text: input });
                  inputRef.current?.focus();
                }
              }}
              placeholder="Type message..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-300 py-3 pl-8 pr-4 text-sm rounded-2xl"
            />
          </div>

          <button
            onClick={() => {
              sendMessage({ text: input });
              inputRef.current?.focus();
            }}
            disabled={!input.trim() || isPending}
            className="flex flex-row items-center gap-1 md:gap-2 bg-green-600 dark:bg-green-500 text-white dark:text-black px-6 text-sm font-bold hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:cursor-not-allowed cursor-pointer uppercase rounded-2xl"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            <span className="md:block hidden">
              {isPending ? "Sending..." : "Send"}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default RoomPage;
