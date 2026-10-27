'use client';

import React, { useState } from 'react';
import { RoomState, MINI_GAMES, MiniGameType } from '@/types/game';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/mascots/Avatar';
import { sound } from '@/lib/audio';
import { Copy, Check, Sparkles, Dices, Play, Users, Crown } from 'lucide-react';

interface LobbyViewProps {
  room: RoomState;
  currentUserId: string;
  onToggleReady: () => void;
  onSelectGame: (gameId: MiniGameType) => void;
  onToggleRandom: () => void;
  onStartGame: () => void;
  onChangeAvatar: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  room,
  currentUserId,
  onToggleReady,
  onSelectGame,
  onToggleRandom,
  onStartGame,
  onChangeAvatar,
}) => {
  const [copied, setCopied] = useState(false);

  const me = room.players.find((p) => p.id === currentUserId) || room.players[0];
  const opponent = room.players.find((p) => p.id !== currentUserId);
  const isHost = me?.isHost;
  const isOpponentIn = Boolean(opponent);
  const bothReady = isOpponentIn && room.players.every((p) => p.isReady);

  const handleCopyLink = () => {
    sound.pop();
    const url = `${window.location.origin}/room/${room.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Room Code & Invite Card */}
      <Card variant="pink" className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5">
        <div className="text-center sm:text-left">
          <span className="text-[11px] font-bold text-[#FF8EB2] uppercase tracking-wider">
            รหัสห้องสำหรับเล่นคู่กัน
          </span>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
            <h2 className="text-3xl font-black tracking-widest text-[#41364F]">
              {room.code}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="cream"
            size="md"
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#1B6D46]" /> คัดลอกลิงก์แล้ว!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> แชร์ลิงก์ชวนเพื่อน
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 2 Players Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Player 1 (Me) */}
        <div className="p-4 rounded-3xl bg-white/95 border-3 border-[#FFB8D2] shadow-[0_8px_20px_rgba(255,184,210,0.3)] relative">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <Avatar id={me.avatar} size="lg" expression={me.isReady ? 'happy' : 'thinking'} />
              {me.isHost && (
                <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#FFE89A] border-2 border-white flex items-center justify-center shadow-sm" title="หัวหน้าห้อง">
                  <Crown className="w-3.5 h-3.5 text-[#523F16]" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-base text-[#41364F] truncate">{me.nickname}</h3>
                <span className="text-[10px] font-bold text-[#FF8EB2] bg-[#FFEBF2] px-2 py-0.5 rounded-full">
                  คุณ
                </span>
              </div>
              <p className="text-xs font-bold text-[#716280] mt-0.5">
                คะแนนสะสม: {me.score} แต้ม
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    me.isReady
                      ? 'bg-[#E3F8ED] text-[#1B6D46] border border-[#B9F0D5]'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {me.isReady ? 'พร้อมแล้ว! ✨' : 'ยังไม่พร้อม'}
                </span>
                <button
                  onClick={onChangeAvatar}
                  className="text-[11px] font-bold text-[#9F82F7] hover:underline cursor-pointer"
                >
                  เปลี่ยนตัวละคร
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Player 2 (Opponent Slot) */}
        <div className="p-4 rounded-3xl bg-white/95 border-3 border-[#CDBEFF] shadow-[0_8px_20px_rgba(205,190,255,0.3)] relative">
          {opponent ? (
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <Avatar id={opponent.avatar} size="lg" expression={opponent.isReady ? 'happy' : 'thinking'} />
                {opponent.isHost && (
                  <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#FFE89A] border-2 border-white flex items-center justify-center shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-[#523F16]" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-base text-[#41364F] truncate">{opponent.nickname}</h3>
                  <span className="text-[10px] font-bold text-[#9F82F7] bg-[#EFEAFF] px-2 py-0.5 rounded-full">
                    ผู้เล่น 2
                  </span>
                </div>
                <p className="text-xs font-bold text-[#716280] mt-0.5">
                  คะแนนสะสม: {opponent.score} แต้ม
                </p>
                <div className="mt-2">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      opponent.isReady
                        ? 'bg-[#E3F8ED] text-[#1B6D46] border border-[#B9F0D5]'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {opponent.isReady ? 'พร้อมแล้ว! ✨' : 'กำลังเตรียมตัว...'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-4 text-[#716280]">
              <div className="w-12 h-12 rounded-full bg-[#F7F4FF] border-2 border-dashed border-[#CDBEFF] flex items-center justify-center text-2xl mb-2 animate-pulse">
                <Users className="w-6 h-6 text-[#9F82F7]" />
              </div>
              <p className="text-sm font-bold text-[#41364F]">รอผู้เล่นคนที่ 2...</p>
              <p className="text-xs text-[#716280]">ส่งรหัสห้องหรือลิงก์ให้อีกคนเข้ามาร่วมเล่น</p>
            </div>
          )}
        </div>
      </div>

      {/* Mini-Games Picker (Host picks or Random) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-black text-[#41364F] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF8EB2]" /> เลือกมินิเกมที่จะเล่น
          </h3>

          {isHost && (
            <button
              onClick={() => {
                sound.pop();
                onToggleRandom();
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                room.isRandomMode
                  ? 'border-[#FF8EB2] bg-[#FFEBF2] text-[#FF8EB2] font-black'
                  : 'border-[#FFD2E2] bg-white text-[#716280]'
              }`}
            >
              <Dices className="w-4 h-4" /> สุ่มเกมอัตโนมัติ {room.isRandomMode && '✓'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MINI_GAMES.map((game) => {
            const isSelected = room.selectedGame === game.id && !room.isRandomMode;
            return (
              <div
                key={game.id}
                onClick={() => {
                  if (isHost) {
                    sound.pop();
                    onSelectGame(game.id);
                  }
                }}
                className={`p-4 rounded-3xl border-2 transition-all ${
                  isHost ? 'cursor-pointer hover:scale-102' : 'cursor-default'
                } ${
                  isSelected
                    ? 'border-[#FF8EB2] bg-[#FFEBF2] shadow-md ring-4 ring-[#FF8EB2]/30'
                    : 'border-[#FFE3ED] bg-white hover:bg-[#FFF7F4]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl select-none">{game.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-[#41364F]">{game.titleTh}</h4>
                      <span className="text-[10px] font-bold text-[#FF8EB2] bg-[#FFF7F4] px-2 py-0.5 rounded-full border border-[#FFD2E2]">
                        {game.estMinutes}
                      </span>
                    </div>
                    <p className="text-xs text-[#716280] mt-1 line-clamp-2">
                      {game.taglineTh}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        {/* Ready Button */}
        <Button
          variant={me.isReady ? 'mint' : 'lemon'}
          size="xl"
          onClick={onToggleReady}
          className="w-full sm:flex-1"
        >
          {me.isReady ? '✓ คุณพร้อมแล้ว (กดเพื่อยกเลิก)' : 'กดพร้อมเล่น! ✨'}
        </Button>

        {/* Start Game Button (Host only) */}
        {isHost ? (
          <Button
            variant="pink"
            size="xl"
            disabled={!bothReady}
            onClick={onStartGame}
            className="w-full sm:flex-1"
          >
            <Play className="w-5 h-5 fill-current" /> เริ่มเกมเลย!
          </Button>
        ) : (
          <div className="text-center text-xs font-bold text-[#716280] w-full sm:w-auto px-4 py-2 bg-white/70 rounded-2xl border border-[#FFD2E2]">
            {!isOpponentIn
              ? 'รอเพื่อนเข้าห้อง...'
              : bothReady
              ? 'รอหัวหน้าห้องกดเริ่มเกม ✨'
              : 'รอทั้งสองฝ่ายกดพร้อม...'}
          </div>
        )}
      </div>
    </div>
  );
};
