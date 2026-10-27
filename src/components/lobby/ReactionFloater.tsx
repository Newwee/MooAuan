'use client';

import React from 'react';
import { ReactionEmoji } from '@/types/game';
import { sound } from '@/lib/audio';

interface ReactionFloaterProps {
  reactions: ReactionEmoji[];
  onSendReaction: (emoji: string) => void;
}

const EMOJI_LIST = ['💖', '🥺', '🤣', '👏', '🥳', '😱', '🐱', '✨'];

export const ReactionFloater: React.FC<ReactionFloaterProps> = ({
  reactions,
  onSendReaction,
}) => {
  return (
    <>
      {/* Floating Emojis across the screen */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {reactions.map((r) => (
          <div
            key={r.id}
            className="absolute bottom-16 text-4xl select-none animate-float-up"
            style={{
              left: `${r.x}%`,
              animationDuration: '2.5s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-[#FFD2E2] shadow-[0_8px_25px_rgba(255,142,178,0.3)]">
        <span className="text-xs font-bold text-[#716280] px-2 select-none hidden sm:inline">
          ส่งรีแอ็กชัน:
        </span>
        {EMOJI_LIST.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              sound.pop();
              onSendReaction(emoji);
            }}
            className="w-9 h-9 flex items-center justify-center text-lg rounded-full hover:bg-[#FFEBF2] hover:scale-125 active:scale-95 transition-all select-none"
            title={`ส่ง ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};
