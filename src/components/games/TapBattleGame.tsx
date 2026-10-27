'use client';

import React, { useState, useEffect } from 'react';
import { TapBattleState, Player } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { sound } from '@/lib/audio';
import { Zap, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TapBattleProps {
  state: TapBattleState;
  players: Player[];
  currentUserId: string;
  onSubmitTap: () => void;
  onNextRound: () => void;
}

export const TapBattleGame: React.FC<TapBattleProps> = ({
  state,
  players,
  currentUserId,
  onSubmitTap,
  onNextRound,
}) => {
  const [now, setNow] = useState<number | null>(null);
  const me = players.find((p) => p.id === currentUserId) || players[0];
  const opponent = players.find((p) => p.id !== currentUserId) || players[1] || players[0];

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30);
    return () => clearInterval(timer);
  }, []);

  const isSignalActive = state.signalTime !== null && now !== null && now >= state.signalTime;
  const isRoundOver = state.state === 'round-over';

  const myTap = state.taps[me.id];
  const opponentTap = state.taps[opponent.id];

  const handleTap = () => {
    if (myTap || isRoundOver) return;

    if (!isSignalActive) {
      sound.lose();
    } else {
      sound.win();
    }
    onSubmitTap();
  };

  useEffect(() => {
    if (isSignalActive && !isRoundOver) {
      sound.go();
    }
  }, [isSignalActive, isRoundOver]);

  useEffect(() => {
    if (isRoundOver && state.roundWinnerId === currentUserId) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#FFE89A', '#FFB8D2', '#B9F0D5'],
      });
    }
  }, [isRoundOver, state.roundWinnerId, currentUserId]);

  const myWins = state.wins[me.id] || 0;
  const opponentWins = state.wins[opponent.id] || 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header & Score Track */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-[#FF8EB2] bg-[#FFEBF2] px-3 py-1 rounded-full border border-[#FFD2E2]">
          รอบที่ {state.round} / {state.maxRounds} (ใครได้ 2 แต้มก่อนชนะ!)
        </span>
        <div className="flex items-center gap-2 text-xs font-black text-[#41364F]">
          <span>{me.nickname}: {myWins}</span>
          <span className="text-[#FF8EB2]">VS</span>
          <span>{opponent.nickname}: {opponentWins}</span>
        </div>
      </div>

      {/* Main Interactive Tap Area */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleTap}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') handleTap();
        }}
        className={`relative w-full h-72 sm:h-80 rounded-3xl border-4 flex flex-col items-center justify-center p-6 select-none cursor-pointer transition-all duration-150 ${
          isRoundOver
            ? 'border-[#CDBEFF] bg-[#F7F4FF]'
            : isSignalActive
            ? 'border-[#6BE0A7] bg-[#E3F8ED] scale-102 shadow-[0_15px_35px_rgba(107,224,167,0.4)] animate-pulse'
            : 'border-[#FFE89A] bg-[#FFFBEA] hover:bg-[#FFF8D6] active:scale-98'
        }`}
      >
        {!isRoundOver ? (
          isSignalActive ? (
            <div className="text-center space-y-2 animate-bounce">
              <Zap className="w-16 h-16 text-[#1B6D46] mx-auto fill-[#6BE0A7]" />
              <h2 className="text-4xl sm:text-5xl font-black text-[#1B4E38]">
                แตะเลย! TAP!
              </h2>
              <p className="text-sm font-bold text-[#1B6D46]">
                ใครแตะไวกว่าชนะรอบนี้!
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FFE89A] mx-auto flex items-center justify-center text-3xl">
                ⏳
              </div>
              <h2 className="text-3xl font-black text-[#523F16]">
                เตรียมตัว...
              </h2>
              <p className="text-xs font-bold text-[#8C6D13] flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> ห้ามแตะก่อนสัญญาณขึ้นเด็ดขาด!
              </p>
            </div>
          )
        ) : (
          <div className="text-center space-y-3">
            {state.roundWinnerId === me.id ? (
              <>
                <div className="text-4xl animate-bounce">🏆</div>
                <h3 className="text-2xl font-black text-[#1B4E38]">
                  คุณแตะได้เร็วกว่า! คว้าแต้มรอบนี้!
                </h3>
              </>
            ) : state.roundWinnerId === opponent.id ? (
              <>
                <div className="text-4xl">⚡</div>
                <h3 className="text-2xl font-black text-[#FF7D7D]">
                  {opponent.nickname} ไวกว่าในรอบนี้!
                </h3>
              </>
            ) : (
              <h3 className="text-2xl font-black text-[#716280]">
                เสมอในรอบนี้!
              </h3>
            )}

            {/* Reaction Times breakdown */}
            <div className="flex justify-center gap-4 text-xs font-bold text-[#41364F] pt-2">
              <div className="p-2 rounded-xl bg-white border border-[#FFD2E2]">
                คุณ: {myTap?.falseStart ? 'ฟาวล์ (กดก่อน)' : myTap ? `${myTap.timeMs}ms` : 'ช้ากว่า'}
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#CDBEFF]">
                {opponent.nickname}:{' '}
                {opponentTap?.falseStart
                  ? 'ฟาวล์ (กดก่อน)'
                  : opponentTap
                  ? `${opponentTap.timeMs}ms`
                  : 'ช้ากว่า'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Round Button when round is over */}
      {isRoundOver && (
        <div className="text-center">
          <Button variant="lemon" size="lg" onClick={onNextRound}>
            {myWins >= 2 || opponentWins >= 2 ? 'ดูผลการแข่งขัน 🏆' : 'ลุยรอบต่อไป ➔'}
          </Button>
        </div>
      )}
    </div>
  );
};
