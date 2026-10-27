'use client';

import React, { useEffect } from 'react';
import { ActiveGameState, Player, MINI_GAMES } from '@/types/game';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/mascots/Avatar';
import { sound } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface ResultsViewProps {
  activeGame: ActiveGameState;
  players: Player[];
  currentUserId: string;
  roomCode: string;
  onRematch: () => void;
  onNextGame: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  activeGame,
  players,
  currentUserId,
  onRematch,
  onNextGame,
}) => {
  const me = players.find((p) => p.id === currentUserId) || players[0];
  const opponent = players.find((p) => p.id !== currentUserId) || players[1] || players[0];
  const meta = MINI_GAMES.find((m) => m.id === activeGame.type) || MINI_GAMES[0];

  const winner = players.find((p) => p.id === activeGame.winnerUserId);
  const isTie = activeGame.winnerUserId === 'tie';
  const isMeWinner = activeGame.winnerUserId === currentUserId;

  useEffect(() => {
    sound.win();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFB8D2', '#CDBEFF', '#B9F0D5', '#FFE89A'],
    });
  }, []);

  // Soulmate Sync percentage for Same Brain
  let soulmatePercentage = 100;
  if (activeGame.type === 'same-brain' && activeGame.sameBrain) {
    const history = activeGame.sameBrain.history;
    const matchedCount = history.filter((h) => h.matched).length;
    soulmatePercentage = history.length > 0 ? Math.round((matchedCount / history.length) * 100) : 100;
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center animate-in zoom-in-95 duration-300">
      {/* Celebration Header Card */}
      <Card variant="pink" className="py-8 px-6">
        <div className="inline-flex p-3 rounded-full bg-[#FFE89A] text-4xl mb-3 shadow-md animate-bounce">
          <Trophy className="w-10 h-10 text-[#523F16]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#41364F] mb-1">
          {activeGame.type === 'same-brain'
            ? `ความเข้ากัน ${soulmatePercentage}%! 💖`
            : isTie
            ? 'เสมอกันอย่างอบอุ่น! 🤝'
            : isMeWinner
            ? 'ยินดีด้วย! คุณคือผู้ชนะ! 🎉'
            : `${winner?.nickname} ชนะในเกมนี้! 🌟`}
        </h1>

        <p className="text-sm font-bold text-[#716280]">
          จบการแข่งขัน {meta.titleTh}
        </p>

        {activeGame.type === 'same-brain' && (
          <div className="mt-4 p-4 rounded-2xl bg-white/90 border-2 border-[#FFD2E2] inline-block">
            <p className="text-xs font-bold text-[#FF8EB2] flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              {soulmatePercentage >= 80
                ? 'ระดับเนื้อคู่แท้ คลื่นสมองตรงกันเป๊ะ! 💍'
                : soulmatePercentage >= 50
                ? 'คู่ซี้สุดน่ารัก เติมเต็มซึ่งกันและกัน! 🍰'
                : 'ต่างคนต่างมุมมอง ยิ่งคุยยิ่งสนุก! 🎨'}
            </p>
          </div>
        )}
      </Card>

      {/* Players Recap Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 */}
        <div
          className={`p-4 rounded-3xl border-3 flex flex-col items-center bg-white/90 shadow-sm ${
            activeGame.winnerUserId === me.id ? 'border-[#FF8EB2] ring-4 ring-[#FF8EB2]/20' : 'border-[#FFD2E2]'
          }`}
        >
          <Avatar id={me.avatar} size="lg" expression={isMeWinner || isTie ? 'winner' : 'happy'} />
          <h3 className="font-black text-sm text-[#41364F] mt-2">{me.nickname} (คุณ)</h3>
          <span className="text-xl font-black text-[#FF8EB2] mt-1">{me.score} แต้ม</span>
        </div>

        {/* Player 2 */}
        <div
          className={`p-4 rounded-3xl border-3 flex flex-col items-center bg-white/90 shadow-sm ${
            activeGame.winnerUserId === opponent.id ? 'border-[#9F82F7] ring-4 ring-[#9F82F7]/20' : 'border-[#CDBEFF]'
          }`}
        >
          <Avatar id={opponent.avatar} size="lg" expression={!isMeWinner || isTie ? 'winner' : 'happy'} />
          <h3 className="font-black text-sm text-[#41364F] mt-2">{opponent.nickname}</h3>
          <span className="text-xl font-black text-[#9F82F7] mt-1">{opponent.score} แต้ม</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="pink"
          size="lg"
          onClick={onRematch}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="w-5 h-5" /> เล่นเกมนี้อีกรอบ (Rematch)
        </Button>

        <Button
          variant="lavender"
          size="lg"
          onClick={onNextGame}
          className="w-full sm:w-auto"
        >
          กลับล็อบบี้ / เลือกเกมใหม่ <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
