import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Navbar } from "../components/Home/Navbar";
import { ChatWidget } from "../components/Chatbot/ChatWidget";

const SITE_URL = "https://www.posturabyphysio.com";
const SITE_NAME = "Postura by Physio";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Personalized physiotherapy and movement programs by Dr. Priyanshi Pandya (MPT, MIAFT). Rehab, pain management, posture correction, and guided fitness in Ahmedabad.",
  keywords: [
    "physiotherapy",
    "physiotherapist",
    "posture correction",
    "rehabilitation",
    "pain management",
    "Ahmedabad",
    "pilates",
    "yoga therapy",
  ],
  authors: [{ name: "Dr. Priyanshi Pandya" }],
  creator: "Postura by Physio",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Personalized physiotherapy and movement programs by Dr. Priyanshi Pandya (MPT, MIAFT). Rehab, pain management, posture correction, and guided fitness in Ahmedabad.",
    images: [
      {
        url: "/about-hero.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Personalized physiotherapy and movement programs by Dr. Priyanshi Pandya (MPT, MIAFT). Rehab, pain management, posture correction, and guided fitness in Ahmedabad.",
    images: ["/about-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // TODO: Add real favicon/app icons + manifest assets in /public and update.
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
