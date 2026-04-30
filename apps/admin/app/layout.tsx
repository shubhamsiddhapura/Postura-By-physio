import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const switzer = localFont({
  src: [
    {
      path: "../public/fonts/Switzer-Variable.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/Switzer-VariableItalic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

const cabinetGrotesk = localFont({
  src: "../public/fonts/CabinetGrotesk-Variable.ttf",
  variable: "--font-cabinet",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin — Postura by Physio",
  description: "Admin dashboard for Postura by Physio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${switzer.variable} ${cabinetGrotesk.variable} font-switzer`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
