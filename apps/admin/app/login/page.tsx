import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "./LoginForm";
import { sessionCookieName, verifyAdminSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const token = (await cookies()).get(sessionCookieName())?.value;
  if (token) {
    const payload = await verifyAdminSessionToken(token);
    if (payload) redirect("/");
  }

  return <LoginForm />;
}

