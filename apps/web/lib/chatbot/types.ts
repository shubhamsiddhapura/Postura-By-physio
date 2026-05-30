export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  /** Suggested page links the user can tap to navigate (assistant only). */
  suggestedLinks?: SuggestedLink[];
};

export type SuggestedLink = {
  /** Short label rendered inside the pill (e.g. "Pre & Post Natal"). */
  label: string;
  /** Internal route path, must be one of `ALLOWED_PATHS`. */
  href: string;
};

export type ChatRequestBody = {
  messages: { role: ChatRole; content: string }[];
};

export type ChatResponseBody = {
  answer: string;
  suggestedLinks: SuggestedLink[];
};
