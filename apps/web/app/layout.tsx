import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Navbar } from "../components/Home/Navbar";
import { ChatWidget } from "../components/Chatbot/ChatWidget";

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
  title: "Postura by Physio",
  description: "Dr Priyanshi Pandya(MPT, MIAFT)",
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
        <NextTopLoader color="#008080" showSpinner={false} />
        <Navbar />
        <main>{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}
