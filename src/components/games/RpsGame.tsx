'use client';

import React, { useState, useEffect } from 'react';
import { RpsState, RpsChoice, Player } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/mascots/Avatar';
import { sound } from '@/lib/audio';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RpsGameProps {
  state: RpsState;
  players: Player[];
  currentUserId: string;
  onSubmitChoice: (choice: RpsChoice) => void;
  onNextRound: () => void;
}

const RPS_OPTIONS: { id: RpsChoice; labelTh: string; emoji: string }[] = [
  { id: 'rock', labelTh: 'ค้อน', emoji: '✊' },
  { id: 'scissors', labelTh: 'กรรไกร', emoji: '✌️' },
  { id: 'paper', labelTh: 'กระดาษ', emoji: '✋' },
];

export const RpsGame: React.FC<RpsGameProps> = ({
  state,
  players,
  currentUserId,
  onSubmitChoice,
  onNextRound,
}) => {
  const [selectedLocal, setSelectedLocal] = useState<RpsChoice | null>(null);

  const me = players.find((p) => p.id === currentUserId) || players[0];
  const opponent = players.find((p) => p.id !== currentUserId) || players[1] || players[0];

  const myChoice = state.choices[me.id] || selectedLocal;
  const opponentChoice = state.choices[opponent.id];
  const isOpponentSelected = Boolean(opponentChoice);

  const handleSelect = (choice: RpsChoice) => {
    if (myChoice || state.revealed) return;
    setSelectedLocal(choice);
    sound.pop();
    onSubmitChoice(choice);
  };

  useEffect(() => {
    if (state.revealed) {
      if (state.roundWinnerId === currentUserId) {
        sound.win();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#B9F0D5', '#6BE0A7', '#FFE89A'],
        });
      } else if (state.roundWinnerId === 'tie') {
        sound.tick();
      } else {
        sound.lose();
      }
    }
  }, [state.revealed, state.roundWinnerId, currentUserId]);

  const myWins = state.wins[me.id] || 0;
  const opponentWins = state.wins[opponent.id] || 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Round & Score Header */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-[#FF8EB2] bg-[#FFEBF2] px-3 py-1 rounded-full border border-[#FFD2E2]">
          รอบที่ {state.round} / {state.maxRounds} (ใครได้ 3 แต้มก่อนชนะ!)
        </span>
        <div className="flex items-center gap-2 text-xs font-black text-[#41364F]">
          <span>{me.nickname}: {myWins}</span>
          <span className="text-[#FF8EB2]">VS</span>
          <span>{opponent.nickname}: {opponentWins}</span>
        </div>
      </div>

      {/* Battle Stage Arena */}
      <Card variant="mint" className="py-6 px-4 text-center">
        {!state.revealed ? (
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* My Side */}
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/80 border-2 border-[#FFD2E2]">
              <Avatar id={me.avatar} size="md" expression={myChoice ? 'happy' : 'thinking'} />
              <p className="text-xs font-bold text-[#41364F] mt-1">{me.nickname} (คุณ)</p>
              <div className="text-3xl mt-2 select-none">
                {myChoice ? (
                  RPS_OPTIONS.find((o) => o.id === myChoice)?.emoji
                ) : (
                  <span className="text-gray-300">❓</span>
                )}
              </div>
              <p className="text-[11px] font-bold text-[#FF8EB2] mt-1">
                {myChoice ? 'เลือกแล้ว ✨' : 'รอคุณเลือก...'}
              </p>
            </div>

            {/* Opponent Side */}
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/80 border-2 border-[#CDBEFF]">
              <Avatar
                id={opponent.avatar}
                size="md"
                expression={isOpponentSelected ? 'happy' : 'thinking'}
              />
              <p className="text-xs font-bold text-[#41364F] mt-1">{opponent.nickname}</p>
              <div className="text-3xl mt-2 select-none">
                {isOpponentSelected ? '✨' : <span className="text-gray-300">❓</span>}
              </div>
              <p className="text-[11px] font-bold text-[#9F82F7] mt-1">
                {isOpponentSelected ? 'เลือกแล้ว! รอลุ้น 💖' : 'กำลังตัดสินใจ...'}
              </p>
            </div>
          </div>
        ) : (
          /* Clash Reveal */
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-6 text-6xl py-2">
              <div className="flex flex-col items-center">
                <span className="animate-bounce">
                  {RPS_OPTIONS.find((o) => o.id === myChoice)?.emoji}
                </span>
                <span className="text-xs font-bold text-[#41364F] mt-1">คุณ</span>
              </div>
              <span className="text-2xl font-black text-[#FF8EB2]">VS</span>
              <div className="flex flex-col items-center">
                <span className="animate-bounce">
                  {RPS_OPTIONS.find((o) => o.id === opponentChoice)?.emoji}
                </span>
                <span className="text-xs font-bold text-[#41364F] mt-1">{opponent.nickname}</span>
              </div>
            </div>

            {state.roundWinnerId === me.id ? (
              <h3 className="text-2xl font-black text-[#1B6D46]">
                คุณชนะในรอบนี้! 🎉 (+40 คะแนน)
              </h3>
            ) : state.roundWinnerId === opponent.id ? (
              <h3 className="text-2xl font-black text-[#FF7D7D]">
                {opponent.nickname} ชนะในรอบนี้!
              </h3>
            ) : (
              <h3 className="text-2xl font-black text-[#523F16]">
                เสมอจ้าาา! ออกเหมือนกันเป๊ะ! 🤝
              </h3>
            )}
          </div>
        )}
      </Card>

      {/* Choice Buttons */}
      {!state.revealed ? (
        <div className="grid grid-cols-3 gap-3">
          {RPS_OPTIONS.map((opt) => {
            const isSelected = myChoice === opt.id;
            return (
              <button
                key={opt.id}
                disabled={Boolean(myChoice)}
                onClick={() => handleSelect(opt.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl border-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#FF8EB2] bg-[#FFEBF2] scale-105 shadow-md ring-4 ring-[#FF8EB2]/30'
                    : 'border-[#FFE3ED] bg-white hover:bg-[#FFF7F4] hover:scale-102 active:scale-95 shadow-sm'
                }`}
              >
                <span className="text-4xl select-none">{opt.emoji}</span>
                <span className="text-xs font-bold text-[#41364F] mt-2">{opt.labelTh}</span>
                {isSelected && (
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#FF8EB2] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <Button
            variant="mint"
            size="lg"
            onClick={() => {
              setSelectedLocal(null);
              onNextRound();
            }}
          >
            {myWins >= 3 || opponentWins >= 3 ? 'ดูผลการแข่งขัน 🏆' : 'รอบถัดไป ➔'}
          </Button>
        </div>
      )}
    </div>
  );
};
