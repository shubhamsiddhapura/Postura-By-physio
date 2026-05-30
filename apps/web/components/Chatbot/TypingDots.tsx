"use client";

export function TypingDots() {
  return (
    <div
      className="flex items-center gap-1.5 px-4 py-3 max-w-[60%] bg-[#FFF6DE] rounded-bl-lg rounded-tl-2xl rounded-br-2xl rounded-tr-lg shadow-sm"
      aria-label="Assistant is typing"
      role="status"
    >
      <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" />
    </div>
  );
}
