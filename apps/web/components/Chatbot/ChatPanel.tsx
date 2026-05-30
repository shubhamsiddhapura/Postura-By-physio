"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { ChatMessage as ChatMessageType } from "@/lib/chatbot/types";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { TypingDots } from "./TypingDots";

type ChatPanelProps = {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
  /** Called when a suggested-link pill is clicked (used to close on mobile). */
  onLinkClick?: () => void;
};

const QUICK_PROMPTS = [
  "I have pain or injury",
  "Physiotherapy treatment",
  "Weight loss & fitness",
  "Posture correction",
  "Yoga, Pilates & Aerobics",
  "Book a session",
];

export function ChatPanel({
  messages,
  isLoading,
  onSend,
  onClose,
  onLinkClick,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const showQuickPrompts = messages.length <= 1 && !isLoading;

  // Auto-scroll to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Close on ESC.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="chat-panel-title"
      className={[
        "flex flex-col overflow-hidden bg-white",
        // Asymmetric corners — mirrors the Navbar pattern (signature design).
        "rounded-tl-3xl rounded-bl-lg rounded-tr-lg rounded-br-3xl",
        "shadow-[0_18px_40px_rgba(15,23,42,0.28)] ring-1 ring-black/5",
        // Sizing: full-width-ish on mobile, fixed panel on desktop.
        "fixed bottom-4 right-4 left-4 top-20 z-[60]",
        "md:left-auto md:top-auto md:bottom-24 md:right-6 md:w-[380px] md:h-[560px]",
        // Slide-up entrance.
        "animate-[chat-slide_500ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none",
      ].join(" ")}
    >
      {/* Header */}
      <header
        className={[
          "relative flex items-center justify-between px-4 py-3",
          "bg-primary/95 backdrop-blur-md",
          "rounded-tl-3xl rounded-tr-lg",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FEF9E0]/20 ring-1 ring-[#FEF9E0]/30">
            <Image
              src="/admin-logo.png"
              alt="Postura by Physio logo"
              width={18}
              height={18}
              className="h-7 w-7"
              aria-hidden
            />
          </span>
          <div className="leading-tight">
            <h2
              id="chat-panel-title"
              className="font-cabinet text-base font-semibold text-[#FEF9E0]"
            >
              Postura Assistant
            </h2>
            <p className="flex items-center gap-1.5 text-[11px] text-[#FEF9E0]/80">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid h-8 w-8 place-items-center rounded-full text-[#FEF9E0] hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        {/* Cream accent line — subtle brand stripe under the header. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-[#FEF9E0]/30"
        />
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-white to-gray-50/40"
      >
        {messages.map((m, i) => (
          <ChatMessage
            key={`${m.role}-${i}`}
            message={m}
            onLinkClick={onLinkClick}
          />
        ))}

        {showQuickPrompts && (
          <div className="pt-2">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              <span aria-hidden>✦</span>
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onSend(prompt)}
                  className="rounded-full border border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-white hover:scale-[1.03]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && <TypingDots />}
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} isLoading={isLoading} />

      <style jsx>{`
        @keyframes chat-slide {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
