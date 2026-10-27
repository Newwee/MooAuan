'use client';

import React, { useEffect } from 'react';
import { MemoryMatchState, Player } from '@/types/game';
import { Avatar } from '@/components/mascots/Avatar';
import { sound } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface MemoryMatchProps {
  state: MemoryMatchState;
  players: Player[];
  currentUserId: string;
  onFlipCard: (cardId: string) => void;
  onResolveMismatch: () => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchProps> = ({
  state,
  players,
  currentUserId,
  onFlipCard,
  onResolveMismatch,
}) => {
  const me = players.find((p) => p.id === currentUserId) || players[0];
  const opponent = players.find((p) => p.id !== currentUserId) || players[1] || players[0];

  const isMyTurn = state.currentTurnUserId === currentUserId;
  const currentTurnPlayer = players.find((p) => p.id === state.currentTurnUserId) || players[0];

  // Auto-resolve mismatch after brief pause if 2 cards selected and not matched
  useEffect(() => {
    if (state.selectedCardIds.length === 2) {
      const [c1Id, c2Id] = state.selectedCardIds;
      const c1 = state.cards.find((c) => c.id === c1Id);
      const c2 = state.cards.find((c) => c.id === c2Id);

      if (c1 && c2 && c1.pairId !== c2.pairId) {
        sound.lose();
        const timer = setTimeout(() => {
          onResolveMismatch();
        }, 1200);
        return () => clearTimeout(timer);
      } else if (c1 && c2 && c1.pairId === c2.pairId) {
        sound.match();
        confetti({
          particleCount: 40,
          spread: 40,
          origin: { y: 0.6 },
          colors: ['#CDBEFF', '#FFB8D2', '#B9F0D5'],
        });
      }
    }
  }, [state.selectedCardIds, state.cards, onResolveMismatch]);

  const handleCardClick = (cardId: string) => {
    if (!isMyTurn) return;
    if (state.selectedCardIds.length >= 2) return;
    sound.pop();
    onFlipCard(cardId);
  };

  const myScore = state.pairsByPlayer[me.id] || 0;
  const opponentScore = state.pairsByPlayer[opponent.id] || 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Turn & Score Banner */}
      <div className="grid grid-cols-2 gap-3">
        {/* My Score Box */}
        <div
          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
            isMyTurn
              ? 'bg-[#FFEBF2] border-[#FF8EB2] shadow-md scale-102 ring-4 ring-[#FF8EB2]/20'
              : 'bg-white/80 border-[#FFD2E2] opacity-80'
          }`}
        >
          <Avatar id={me.avatar} size="sm" expression={isMyTurn ? 'happy' : 'thinking'} />
          <div>
            <p className="text-xs font-bold text-[#41364F]">{me.nickname} (คุณ)</p>
            <p className="text-sm font-black text-[#FF8EB2]">
              {myScore} คู่ {isMyTurn && '• ตาของคุณ!'}
            </p>
          </div>
        </div>

        {/* Opponent Score Box */}
        <div
          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
            !isMyTurn
              ? 'bg-[#EFEAFF] border-[#9F82F7] shadow-md scale-102 ring-4 ring-[#9F82F7]/20'
              : 'bg-white/80 border-[#CDBEFF] opacity-80'
          }`}
        >
          <Avatar id={opponent.avatar} size="sm" expression={!isMyTurn ? 'happy' : 'thinking'} />
          <div>
            <p className="text-xs font-bold text-[#41364F]">{opponent.nickname}</p>
            <p className="text-sm font-black text-[#9F82F7]">
              {opponentScore} คู่ {!isMyTurn && '• กำลังเปิด...'}
            </p>
          </div>
        </div>
      </div>

      {/* Turn Announcement */}
      <div className="text-center">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${
            isMyTurn
              ? 'bg-[#FF8EB2] text-white animate-bounce'
              : 'bg-[#CDBEFF] text-[#34264F]'
          }`}
        >
          {isMyTurn ? '✨ ตาของคุณ! เลือกเปิดการ์ด 2 ใบ' : `💭 ตาของ ${currentTurnPlayer.nickname} กำลังเล็งการ์ดอยู่...`}
        </span>
      </div>

      {/* 4x3 Grid (12 Cards) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {state.cards.map((card) => {
          const isSelected = state.selectedCardIds.includes(card.id);
          const showFace = card.isFlipped || card.isMatched || isSelected;

          return (
            <button
              key={card.id}
              disabled={!isMyTurn || card.isMatched || isSelected || state.selectedCardIds.length >= 2}
              onClick={() => handleCardClick(card.id)}
              className={`relative aspect-[3/4] sm:aspect-square rounded-3xl border-3 flex flex-col items-center justify-center p-2 select-none cursor-pointer transition-all duration-300 ${
                card.isMatched
                  ? 'border-[#6BE0A7] bg-[#E3F8ED] shadow-sm scale-95 opacity-85'
                  : showFace
                  ? 'border-[#FF8EB2] bg-white scale-105 shadow-[0_8px_20px_rgba(255,142,178,0.35)] rotate-y-180'
                  : 'border-[#FFD2E2] bg-gradient-to-br from-[#FFF7F4] to-[#FFEBF2] hover:bg-white hover:scale-102 hover:border-[#FF8EB2] active:scale-95 shadow-sm'
              }`}
            >
              {showFace ? (
                <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-200">
                  <span className="text-3xl sm:text-4xl">{card.icon}</span>
                  <span className="text-[10px] font-bold text-[#716280] mt-1 text-center truncate max-w-full">
                    {card.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-[#FFB8D2]">
                  <span className="text-2xl">💖</span>
                  <span className="text-[10px] font-bold text-[#716280]/60 mt-0.5">DUO</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
