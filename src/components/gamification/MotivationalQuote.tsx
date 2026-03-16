"use client";

import { useState, useEffect } from "react";
import { COLORS, MOTIVATIONAL_QUOTES } from "@/lib/constants";

export function MotivationalQuote() {
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  return (
    <div
      className="rounded-2xl border p-5 text-center animate-fade-in"
      style={{
        background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.purple}11 100%)`,
        borderColor: `${COLORS.purple}33`,
      }}
    >
      <div className="text-2xl mb-3">💬</div>
      <p className="text-sm font-medium italic m-0 mb-2" style={{ color: COLORS.text, lineHeight: 1.6 }}>
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-xs m-0" style={{ color: COLORS.textMuted }}>
        — {quote.author}
      </p>
    </div>
  );
}
