const SESSION_COOKIE = "admin_session";
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  email: string;
  iat: number; // unix seconds
};

function getSecret(): string {
  return process.env.ADMIN_AUTH_SECRET ?? "dev-secret-change-me";
}

function getStaticEmail(): string {
  return process.env.ADMIN_EMAIL ?? "admin@example.com";
}

function getStaticPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function toBase64Url(bytes: Uint8Array): string {
  const b64 = bytesToBase64(bytes);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded =
    s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  return base64ToBytes(padded);
}

function utf8ToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

async function hmacSha256(message: string, secret: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return new Uint8Array(sig);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

export function sessionCookieName(): string {
  return SESSION_COOKIE;
}

export function adminStaticCredentials() {
  return { email: getStaticEmail(), password: getStaticPassword() };
}

export async function createAdminSessionToken(payload: SessionPayload): Promise<string> {
  const body = toBase64Url(utf8ToBytes(JSON.stringify(payload)));
  const sig = await hmacSha256(body, getSecret());
  return `${body}.${toBase64Url(sig)}`;
}

export async function verifyAdminSessionToken(
  token: string,
  opts: { maxAgeSeconds?: number } = {}
): Promise<SessionPayload | null> {
  const maxAgeSeconds = opts.maxAgeSeconds ?? DEFAULT_MAX_AGE_SECONDS;
  const [body, sigB64] = token.split(".");
  if (!body || !sigB64) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(bytesToUtf8(fromBase64Url(body))) as SessionPayload;
  } catch {
    return null;
  }
  if (!payload?.email || typeof payload.iat !== "number") return null;

  const expected = await hmacSha256(body, getSecret());
  const provided = fromBase64Url(sigB64);
  if (!timingSafeEqual(expected, provided)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.iat > now + 60) return null; // clock skew guard
  if (now - payload.iat > maxAgeSeconds) return null;

  return payload;
}

