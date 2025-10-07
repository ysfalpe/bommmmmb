'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function AdSenseScript() {
  const [isPremium, setIsPremium] = useState(false);

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

  // Only show AdSense for non-premium users
  if (isPremium) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8992984801647508"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
