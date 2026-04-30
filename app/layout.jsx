// app/layout.jsx
// ─────────────────────────────────────────────────────────
// Root layout — wraps every page.
// Fonts and global CSS are loaded here.
// ─────────────────────────────────────────────────────────

import { Playfair_Display, Space_Mono } from 'next/font/google';
import './globals.css';

// ── Fonts ──────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets:  ['latin'],
  style:    ['normal', 'italic'],
  variable: '--font-serif',
  display:  'swap',
});

const spaceMono = Space_Mono({
  subsets:  ['latin'],
  weight:   ['400', '700'],
  variable: '--font-mono',
  display:  'swap',
});

// ── Metadata ────────────────────────────────────────────
export const metadata = {
  title:       "Aditi's Palace Guestbook",
  description: 'Sign the guestbook and leave your mark on Aditi\'s portfolio.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
