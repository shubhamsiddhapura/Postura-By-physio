"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  ChatMessage,
  ChatResponseBody,
  SuggestedLink,
} from "@/lib/chatbot/types";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hello, welcome to Postura by Physio! We offer physiotherapist-guided care for pain relief, posture correction, rehabilitation, and fitness programs (Aerobics, Yoga & Pilates).\n\nHow can I help you today?",
  suggestedLinks: [
    { label: "All Services", href: "/services" },
    { label: "Book a Session", href: "/book-a-session" },
  ],
};

type SendStatus = "idle" | "loading" | "error";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [status, setStatus] = useState<SendStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || status === "loading") return;

      // Cancel any in-flight request before starting a new one.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userMsg: ChatMessage = { role: "user", content: text };
      const nextHistory = [...messages, userMsg];
      setMessages(nextHistory);
      setStatus("loading");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextHistory.map(({ role, content }) => ({ role, content })),
          }),
          signal: controller.signal,
        });

        const json = (await res.json().catch(() => null)) as
          | { success: true; data: ChatResponseBody }
          | { success: false; error: string }
          | null;

        if (!json || !("success" in json)) {
          throw new Error("Invalid response from server");
        }

        if (!json.success) {
          throw new Error(json.error || "Request failed");
        }

        const { answer, suggestedLinks } = json.data;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
            suggestedLinks: dedupeLinks(suggestedLinks),
          },
        ]);
        setStatus("idle");
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        console.error("[chat] sendMessage failed:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, something went wrong. Please try again, or reach us via Contact Us.",
            suggestedLinks: [
              { label: "Contact Us", href: "/contact-us" },
              { label: "Book a Session", href: "/book-a-session" },
            ],
          },
        ]);
        setStatus("error");
      }
    },
    [messages, status]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([GREETING]);
    setStatus("idle");
  }, []);

  const isLoading = status === "loading";

  return useMemo(
    () => ({ messages, isLoading, status, sendMessage, reset }),
    [messages, isLoading, status, sendMessage, reset]
  );
}

function dedupeLinks(links: SuggestedLink[] | undefined): SuggestedLink[] {
  if (!links?.length) return [];
  const seen = new Set<string>();
  const out: SuggestedLink[] = [];
  for (const l of links) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    out.push(l);
  }
  return out;
}
