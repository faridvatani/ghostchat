"use client";

import GhostCursor from "@/components/GhostCursor";
import { useUsername } from "@/hooks/use-username";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const { username, isLoading } = useUsername();

  return (
    <>
      <header className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </header>
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-white dark:bg-green-950 z-0">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-green-600 ">
              {">"}Ghost Room
            </h1>
            <p className="text-gray-600 dark:text-green-200 text-sm">
              A private, self-destructing chat room.
            </p>
          </div>

          <div className="border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900 p-6 backdrop-blur-md rounded-2xl">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center text-green-700 dark:text-green-300">
                  Your Identity
                </label>

                <div className="flex items-center gap-3">
                  <span className="flex-1 bg-white dark:bg-green-950 border border-green-300 dark:border-green-700 p-3 text-sm text-green-900 dark:text-green-300 font-mono rounded-xl">
                    {isLoading ? "Creating username..." : username}
                  </span>
                </div>
              </div>

              <button className="w-full bg-green-600 dark:bg-green-500 text-white dark:text-black p-3 text-sm font-bold hover:bg-green-700 dark:hover:bg-green-600 transition-colors mt-2 cursor-pointer disabled:opacity-50 rounded-2xl uppercase">
                create secure room
              </button>
            </div>
          </div>
        </div>
        <GhostCursor
          // Visuals
          color="#008236"
          brightness={1}
          edgeIntensity={0}
          // Trail and motion
          trailLength={50}
          inertia={0.5}
          // Post-processing
          grainIntensity={0.05}
          bloomStrength={0.1}
          bloomRadius={1.0}
          bloomThreshold={0.025}
          // Fade-out behavior
          fadeDelayMs={1000}
          fadeDurationMs={1500}
          zIndex={-1}
        />
      </main>
    </>
  );
}
