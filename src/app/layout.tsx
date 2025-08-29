'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isPremium, setIsPremium] = useState(false);

  // Check if user is premium
  useEffect(() => {
    const savedToken = localStorage.getItem('premiumToken');
    if (savedToken) {
      try {
        // Try to parse as base64 JSON first (legacy)
        let decoded: { premium?: boolean } | null = null;
        try {
          decoded = JSON.parse(atob(savedToken)) as { premium?: boolean };
        } catch {
          // If not base64 JSON, assume JWT and parse payload
          const payload = JSON.parse(atob(savedToken.split('.')[1])) as { premium?: boolean };
          decoded = payload;
        }
        setIsPremium(decoded?.premium === true);
      } catch {
        // Invalid token, remove it
        localStorage.removeItem('premiumToken');
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>ChristianAI - Chat with Jesus</title>
        <meta name="description" content="Chat with AI about Jesus and Christianity. We're here for spiritual guidance and loving conversations filled with faith." />
        {/* AdSense Script - Only for non-premium users */}
        {!isPremium && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8992984801647508"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
