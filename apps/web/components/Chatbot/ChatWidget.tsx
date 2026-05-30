"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ChatPanel } from "./ChatPanel";
import { useChat } from "./useChat";
import Image from "next/image";

const PULSE_DURATION_MS = 6000;

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const { messages, isLoading, sendMessage } = useChat();

  // Stop the attention pulse after a few seconds (or when first opened).
  useEffect(() => {
    if (!showPulse) return;
    const timer = window.setTimeout(() => setShowPulse(false), PULSE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [showPulse]);

  // Prevent body scroll when panel is open on mobile only.
  useEffect(() => {
    if (!isOpen) return;
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const open = () => {
    setIsOpen(true);
    setShowPulse(false);
  };
  const close = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onClose={close}
          onLinkClick={() => {
            // On mobile-sized viewports, close the chat after the user taps a
            // suggested link so they land cleanly on the destination page.
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              close();
            }
          }}
        />
      )}

      {/* Launcher — mirrors PrimaryCTAButton language: pill body + protruding badge. */}
      <div
        className={[
          "fixed bottom-6 right-6 z-[55]",
          "transition-opacity duration-300",
          isOpen ? "md:opacity-100 opacity-0 pointer-events-none md:pointer-events-auto" : "opacity-100",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={isOpen ? close : open}
          aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
          aria-expanded={isOpen}
          className="group relative inline-flex items-center overflow-visible"
        >
          {/* Attention pulse — only when closed and on initial load. */}
          {!isOpen && showPulse && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-secondary/60 animate-ping motion-reduce:hidden"
            />
          )}

          {/* Pill body */}
          <span
            className={[
              "relative inline-flex items-center rounded-full bg-secondary text-[#FEF9E0] shadow-[0_10px_30px_rgba(190,108,37,0.45)] transition transform",
              "py-3 pl-5 pr-9",
              "group-hover:brightness-90 group-hover:scale-105",
            ].join(" ")}
          >
            <span aria-hidden className="mr-1.5 text-[#FEF9E0]">
              <Image src="/admin-logo.png" alt="Postura by Physio logo" width={18} height={18} className="h-7 w-7" aria-hidden />
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">
              {isOpen ? "Close" : "Ask Postura"}
            </span>
          </span>

          {/* Cream badge with icon — mirrors the ArrowUpRight badge on PrimaryCTAButton. */}
          <span
            aria-hidden
            className="absolute -right-1 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-[#FEF9E0] shadow-md ring-2 ring-secondary"
          >
            {isOpen ? (
              <X className="h-4 w-4 text-primary transition-transform duration-300" />
            ) : (
              <MessageCircle className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
