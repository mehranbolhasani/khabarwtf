import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "khabarwtf - خبر جمع‌کن",
  description: "A tiny news aggregator in Farsi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

