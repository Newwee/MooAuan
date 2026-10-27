'use client';

import React, { useEffect, useState } from 'react';

export const FloatingDuoBackground: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-[#FFF7F4] via-[#FFF1F6] to-[#F5F1FF]"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FFF7F4]"
    >
      {/* Soft Ambient Pastel Glow Orbs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FFB8D2]/35 blur-3xl animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#CDBEFF]/30 blur-3xl animate-pulse"
        style={{ animationDuration: '10s' }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[#B9F0D5]/35 blur-3xl animate-pulse"
        style={{ animationDuration: '12s' }}
      />
      <div
        className="absolute top-2/3 left-10 w-80 h-80 rounded-full bg-[#FFE89A]/30 blur-3xl animate-pulse"
        style={{ animationDuration: '9s' }}
      />

      {/* Floating Sparkles / Tiny Stars & Hearts */}
      <div className="absolute inset-0 opacity-40">
        <span
          className="absolute text-xl top-[15%] left-[8%] animate-bounce"
          style={{ animationDuration: '4s' }}
        >
          ✨
        </span>
        <span
          className="absolute text-lg top-[28%] right-[12%] animate-bounce"
          style={{ animationDuration: '5s' }}
        >
          💖
        </span>
        <span
          className="absolute text-base top-[60%] left-[15%] animate-bounce"
          style={{ animationDuration: '4.5s' }}
        >
          🌸
        </span>
        <span
          className="absolute text-xl top-[75%] right-[20%] animate-bounce"
          style={{ animationDuration: '6s' }}
        >
          ⭐
        </span>
        <span
          className="absolute text-lg top-[42%] left-[45%] animate-bounce"
          style={{ animationDuration: '5.5s' }}
        >
          ✨
        </span>
      </div>
    </div>
  );
};
