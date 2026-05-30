"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ChatMessage as ChatMessageType } from "@/lib/chatbot/types";

type ChatMessageProps = {
  message: ChatMessageType;
  /** Called after a suggested-link pill is clicked (e.g. close the panel on mobile). */
  onLinkClick?: () => void;
};

export function ChatMessage({ message, onLinkClick }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[88%]`}>
        <div
          className={[
            "px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-primary text-white rounded-bl-2xl rounded-tl-lg rounded-tr-2xl rounded-br-lg"
              : "bg-[#FFF6DE] text-gray-900 rounded-bl-lg rounded-tl-2xl rounded-br-2xl rounded-tr-lg",
          ].join(" ")}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {!isUser && message.suggestedLinks && message.suggestedLinks.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {message.suggestedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onLinkClick}
                className="group relative inline-flex items-center rounded-full bg-secondary py-1.5 pl-3 pr-6 text-xs font-semibold text-[#FEF9E0] shadow-sm transition hover:brightness-90 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2"
              >
                <span>{link.label}</span>
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center rounded-full bg-[#FEF9E0]">
                  <ArrowUpRight
                    className="h-3 w-3 text-primary transition-transform duration-300 group-hover:rotate-45"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
