// app/layout.jsx
// ─────────────────────────────────────────────────────────
// Root layout — wraps every page.
// Fonts and global CSS are loaded here.
// ─────────────────────────────────────────────────────────

import { Platypi, Geist_Mono } from "next/font/google";
import "./globals.css";

// ── Fonts ──────────────────────────────────────────────
const platypi = Platypi({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ── Metadata ────────────────────────────────────────────
export const metadata = {
  title: "Aditi's Palace Guestbook",
  description: "Sign the guestbook and leave your mark on Aditi's portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${platypi.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
