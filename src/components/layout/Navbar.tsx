'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sound } from '@/lib/audio';
import { Volume2, VolumeX, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MINI_GAMES } from '@/types/game';

export const Navbar: React.FC = () => {
  const [isMuted, setIsMuted] = useState(() =>
    typeof window !== 'undefined' ? sound.getIsMuted() : false
  );
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleToggleSound = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFF7F4]/80 border-b border-[#FFD2E2] px-4 py-3 transition-colors">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <Link
            href="/"
            onClick={() => sound.pop()}
            className="flex items-center gap-2 group select-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8EB2] to-[#FFE89A] flex items-center justify-center shadow-[0_4px_10px_rgba(255,142,178,0.4)] group-hover:rotate-6 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl">🐱</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#41364F] flex items-center gap-1">
                DUO POP <span className="text-[#FF8EB2]">♥</span>
              </span>
              <span className="text-[10px] font-bold text-[#716280] tracking-wider uppercase">
                MooAuan Mini Games
              </span>
            </div>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* How to Play Help */}
            <button
              onClick={() => {
                sound.pop();
                setIsHelpOpen(true);
              }}
              aria-label="กติกาการเล่น"
              className="p-2 rounded-2xl bg-white/80 hover:bg-white text-[#41364F] border border-[#FFD2E2] shadow-sm hover:scale-105 active:scale-95 transition-all"
              title="กติกาการเล่น"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={handleToggleSound}
              aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
              className="p-2 rounded-2xl bg-white/80 hover:bg-white text-[#41364F] border border-[#FFD2E2] shadow-sm hover:scale-105 active:scale-95 transition-all"
              title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-gray-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#FF8EB2]" />
              )}
            </button>

            {/* Admin Shortcut */}
            <Link
              href="/admin"
              onClick={() => sound.tap()}
              aria-label="Admin Mode"
              className="p-2 rounded-2xl bg-white/80 hover:bg-white text-[#41364F] border border-[#FFD2E2] shadow-sm hover:scale-105 active:scale-95 transition-all"
              title="Admin Mode"
            >
              <Shield className="w-5 h-5 text-[#9F82F7]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Rules & Help Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="วิธีเล่น DUO POP ✨"
        className="max-w-lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <p className="text-sm text-[#41364F]">
            ยินดีต้อนรับสู่ <span className="font-bold text-[#FF8EB2]">DUO POP</span>!
            เว็บเกมมินิมอลพาสเทลสำหรับเล่น 2 คน ไม่ว่าจะคู่รัก แฟน หรือเพื่อนสนิท เล่นง่ายได้ทันทีไม่ต้องโหลดแอป!
          </p>

          <div className="space-y-3">
            {MINI_GAMES.map((game) => (
              <div
                key={game.id}
                className="p-3.5 rounded-2xl border-2 border-[#FFD2E2] bg-[#FFF7F4]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{game.icon}</span>
                  <h4 className="font-black text-sm text-[#41364F]">{game.titleTh}</h4>
                </div>
                <p className="text-xs text-[#716280] mb-2">{game.descriptionTh}</p>
                <ul className="text-xs text-[#41364F] space-y-1 list-disc list-inside">
                  {game.howToPlayTh.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-xs text-[#716280] flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8EB2]" /> ขอให้มีความสุขกับคนที่เล่นด้วยกันนะจ๊ะ!
          </div>
        </div>
      </Modal>
    </>
  );
};
