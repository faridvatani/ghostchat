import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copy: (text: string) => void;
}

export const useCopyToClipboard = (
  timeout = 2000,
): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = (text: string) => {
    if (!text || typeof window === "undefined") return;

    copyToClipboard(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, timeout);
  };

  return { isCopied, copy };
};
