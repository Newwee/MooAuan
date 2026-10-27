'use client';

import React, { useState } from 'react';
import { SameBrainState, Player } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/mascots/Avatar';
import { sound } from '@/lib/audio';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SameBrainGameProps {
  state: SameBrainState;
  players: Player[];
  currentUserId: string;
  onSubmitAnswer: (optionId: string) => void;
  onNextQuestion: () => void;
}

export const SameBrainGame: React.FC<SameBrainGameProps> = ({
  state,
  players,
  currentUserId,
  onSubmitAnswer,
  onNextQuestion,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<{
    questionIndex: number;
    optionId: string;
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(4);

  // Derive local selection based on current question index (pure render, no effect needed)
  const localChoice =
    selectedAnswer?.questionIndex === state.questionIndex
      ? selectedAnswer.optionId
      : null;

  const me = players.find((p) => p.id === currentUserId) || players[0];
  const opponent =
    players.find((p) => p.id !== currentUserId) ||
    players.find((p) => p.id !== me?.id) ||
    players[1] ||
    me;

  const myAnswerId = state.answers[currentUserId] || localChoice;
  const opponentAnswerId = opponent ? state.answers[opponent.id] : null;
  const isOpponentAnswered = Boolean(opponentAnswerId);

  const handleSelectOption = (optId: string) => {
    if (myAnswerId || state.revealed) return;
    setSelectedAnswer({ questionIndex: state.questionIndex, optionId: optId });
    sound.pop();
    onSubmitAnswer(optId);
  };

  const isMatched =
    state.revealed &&
    state.answers[me.id] &&
    opponent &&
    state.answers[me.id] === state.answers[opponent.id];

  React.useEffect(() => {
    if (state.revealed) {
      if (isMatched) {
        sound.win();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF8EB2', '#FFB8D2', '#FFE89A'],
        });
      } else {
        sound.match();
      }
    }
  }, [state.revealed, isMatched]);

  // Auto-advance countdown timer when answers are revealed
  React.useEffect(() => {
    if (!state.revealed) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNextQuestion();
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.revealed, onNextQuestion]);

  const question = state.currentQuestion;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Progress & Category Banner */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-[#FF8EB2] bg-[#FFEBF2] px-3 py-1 rounded-full border border-[#FFD2E2]">
          หมวด: {question.category}
        </span>
        <span className="text-xs font-bold text-[#716280]">
          คำถามที่ {state.questionIndex + 1} / {state.totalQuestions}
        </span>
      </div>

      {/* Question Card */}
      <Card variant="pink" className="text-center py-6 px-4">
        <h2 className="text-xl sm:text-2xl font-black text-[#41364F] mb-1">
          {question.promptTh}
        </h2>
        <p className="text-xs text-[#716280] italic">{question.promptEn}</p>
      </Card>

      {/* Both Players Status Bar */}
      <div className="grid grid-cols-2 gap-4">
        {/* My Status */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border-2 border-[#FFD2E2]">
          <Avatar id={me.avatar} size="sm" expression={myAnswerId ? 'happy' : 'thinking'} />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#41364F] truncate">{me.nickname} (คุณ)</p>
            <p className="text-[11px] font-bold text-[#FF8EB2]">
              {myAnswerId ? 'เลือกเรียบร้อย ✨' : 'กำลังเลือก...'}
            </p>
          </div>
        </div>

        {/* Opponent Status */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border-2 border-[#CDBEFF]">
          <Avatar
            id={opponent.avatar}
            size="sm"
            expression={isOpponentAnswered ? 'happy' : 'thinking'}
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#41364F] truncate">{opponent.nickname}</p>
            <p className="text-[11px] font-bold text-[#9F82F7]">
              {isOpponentAnswered ? 'เลือกแล้ว! รอลุ้น 💖' : 'กำลังคิด... 💭'}
            </p>
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((opt) => {
          const isMyChoice = myAnswerId === opt.id;
          const isOpponentChoice = state.revealed && opponentAnswerId === opt.id;
          const isBothChoice = isMyChoice && isOpponentChoice;

          return (
            <button
              key={opt.id}
              disabled={Boolean(myAnswerId) || state.revealed}
              onClick={() => handleSelectOption(opt.id)}
              className={`relative p-4 rounded-3xl border-2 text-left transition-all duration-200 cursor-pointer ${
                state.revealed
                  ? isBothChoice
                    ? 'border-[#FF8EB2] bg-[#FFEBF2] scale-102 ring-4 ring-[#FF8EB2]/30 shadow-lg'
                    : isMyChoice
                    ? 'border-[#FF8EB2] bg-[#FFF5F8]'
                    : isOpponentChoice
                    ? 'border-[#CDBEFF] bg-[#F7F4FF]'
                    : 'border-gray-200 bg-white/60 opacity-60'
                  : isMyChoice
                  ? 'border-[#FF8EB2] bg-[#FFEBF2] scale-102 shadow-md'
                  : 'border-[#FFE3ED] bg-white hover:bg-[#FFF7F4] hover:scale-101'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl select-none">{opt.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-black text-sm text-[#41364F]">{opt.textTh}</h4>
                  <p className="text-[11px] text-[#716280]">{opt.textEn}</p>
                </div>
              </div>

              {/* Reveal Badges */}
              {state.revealed && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-dashed border-[#FFD2E2]">
                  {isMyChoice && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF8EB2] text-white">
                      คุณเลือก
                    </span>
                  )}
                  {isOpponentChoice && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9F82F7] text-white">
                      {opponent.nickname} เลือก
                    </span>
                  )}
                </div>
              )}

              {/* Checkmark before reveal */}
              {!state.revealed && isMyChoice && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF8EB2] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal Banner & Next Question Button */}
      {state.revealed && (
        <Card
          variant={isMatched ? 'pink' : 'lavender'}
          className="text-center py-5 animate-in zoom-in-95 duration-200"
        >
          {isMatched ? (
            <div className="space-y-2">
              <div className="text-3xl animate-bounce">💖</div>
              <h3 className="text-xl font-black text-[#FF8EB2]">
                ใจตรงกันเป๊ะ! Soulmates Sync! (+100 คะแนน)
              </h3>
              <p className="text-xs text-[#41364F]">
                คลื่นสมองตรงกันแบบไม่ต้องพูดอะไรเลย!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl">💫</div>
              <h3 className="text-lg font-black text-[#9F82F7]">
                ต่างคนต่างสไตล์ แต่ลงตัว! (+20 คะแนน)
              </h3>
              <p className="text-xs text-[#41364F]">
                หลากหลายรสชาติทำให้ชีวิตคู่น่าค้นหายิ่งขึ้น!
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-col items-center gap-2">
            <Button
              variant="pink"
              size="md"
              onClick={() => {
                sound.tap();
                setSecondsLeft(4);
                onNextQuestion();
              }}
            >
              {state.questionIndex + 1 < state.totalQuestions
                ? 'คำถามถัดไป ➔'
                : 'ดูผลคะแนนรวม 🏆'}
            </Button>
            <p className="text-[11px] font-bold text-[#716280] animate-pulse">
              กำลังไปข้อถัดไปอัตโนมัติใน {secondsLeft} วินาที... (หรือกดปุ่มเพื่อข้าม)
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
