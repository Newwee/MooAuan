'use client';

import React, { useEffect, useState } from 'react';
import { PrankEvent } from '@/types/game';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/audio';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PrankOverlayProps {
  prank: PrankEvent | null;
  currentUserId: string;
  onDismiss: () => void;
}

export const PrankOverlay: React.FC<PrankOverlayProps> = ({
  prank,
  currentUserId,
  onDismiss,
}) => {
  const [fakeProgress, setFakeProgress] = useState(15);

  useEffect(() => {
    if (!prank) return;

    // Check if prank targets only a specific user
    if (prank.targetUserId && prank.targetUserId !== currentUserId) {
      return;
    }

    sound.prank();

    // If Confetti burst
    if (prank.type === 'confetti') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFB8D2', '#CDBEFF', '#B9F0D5', '#FFE89A'],
      });
    }

    // If Fake Loading joke
    if (prank.type === 'fake-loading') {
      const interval = setInterval(() => {
        setFakeProgress((prev) => {
          if (prev >= 99) {
            clearInterval(interval);
            return 99;
          }
          return prev + 20;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [prank, currentUserId]);

  if (!prank) return null;
  if (prank.targetUserId && prank.targetUserId !== currentUserId) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
      {/* 1. Emoji Rain Effect */}
      {prank.type === 'emoji-rain' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                top: `${(i % 6) * 16}%`,
                left: `${(i * 13) % 95}%`,
                animationDuration: `${1.5 + (i % 3) * 0.5}s`,
              }}
            >
              {prank.emoji || '🐷'}
            </div>
          ))}
        </div>
      )}

      {/* 2. Disco Lights Pastel Border */}
      {prank.type === 'disco-lights' && (
        <div className="absolute inset-0 border-8 border-dashed pointer-events-none animate-rainbow-border" />
      )}

      {/* 3. Safe Joke Modals: Fake Loading, Meme Popup, or General Prank Banner */}
      {(prank.type === 'fake-loading' || prank.type === 'meme-popup') && (
        <div className="relative pointer-events-auto max-w-sm w-full bg-white rounded-3xl p-6 border-4 border-[#FFB8D2] shadow-[0_20px_50px_rgba(255,142,178,0.4)] text-center animate-in zoom-in-90 duration-200">
          <button
            onClick={() => {
              sound.pop();
              onDismiss();
            }}
            aria-label="ปิดมุกแกล้ง"
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[#FFEBF2] text-[#41364F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {prank.type === 'fake-loading' ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFE89A] flex items-center justify-center text-3xl animate-bounce">
                💾
              </div>
              <h3 className="text-lg font-black text-[#41364F]">
                {prank.title || 'กำลังดาวน์โหลดความน่ารักเพิ่ม...'}
              </h3>
              {/* Progress bar */}
              <div className="w-full bg-[#FFF7F4] border-2 border-[#FFD2E2] h-6 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-[#FF8EB2] to-[#FFE89A] h-full rounded-full transition-all duration-300"
                  style={{ width: `${fakeProgress}%` }}
                />
              </div>
              <p className="text-xs font-bold text-[#716280]">
                {fakeProgress < 99
                  ? `ประมวลผลข้อมูล... ${fakeProgress}%`
                  : 'ค้างอยู่ที่ 99%! เฉลย: แอดมินแกล้งเล่นจ้าาา 💖'}
              </p>
              {fakeProgress >= 99 && (
                <Button variant="pink" size="sm" onClick={onDismiss} className="w-full">
                  ฮ่าๆ รู้ทันนะ! ปิดเลย 😆
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#CDBEFF] flex items-center justify-center text-3xl animate-pulse">
                📢
              </div>
              <h3 className="text-lg font-black text-[#41364F]">
                {prank.title || 'ข้อความจากผู้ดูแลห้อง!'}
              </h3>
              <p className="text-sm font-bold text-[#FF8EB2] bg-[#FFF7F4] p-3 rounded-2xl border border-[#FFD2E2]">
                &ldquo;{prank.message || 'หมูอ้วนกำลังมองเธออยู่นะจ๊ะ 👀💖'}&rdquo;
              </p>
              <Button variant="lavender" size="sm" onClick={onDismiss} className="w-full">
                รับทราบจ้าาา 💖
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Floating Dismiss Pill for background effects (disco, emoji-rain, confetti) */}
      {(prank.type === 'disco-lights' || prank.type === 'emoji-rain' || prank.type === 'ui-wiggle') && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border-2 border-[#FFB8D2] shadow-lg animate-in fade-in duration-200">
            <Sparkles className="w-4 h-4 text-[#FF8EB2]" />
            <span className="text-xs font-black text-[#41364F]">
              {prank.title || '✨ แอดมินส่งเอฟเฟกต์พิเศษมาให้!'}
            </span>
            <button
              onClick={onDismiss}
              className="ml-2 text-xs font-bold text-[#FF8EB2] hover:underline cursor-pointer"
            >
              ปิด (X)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
