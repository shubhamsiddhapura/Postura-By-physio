"use client";

import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <>
      <NextTopLoader color="#008080" showSpinner={false} height={2} />
      {isLogin ? (
        <main className="min-h-screen bg-gray-50">{children}</main>
      ) : (
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      )}
    </>
  );
}

