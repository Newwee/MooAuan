'use client';

import React, { useState } from 'react';
import { RoomState, MINI_GAMES, MiniGameType } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/mascots/Avatar';
import { sound } from '@/lib/audio';
import { Copy, Check, Sparkles, Dices, Play, Users, Crown, UserCheck } from 'lucide-react';

interface LobbyViewProps {
  room: RoomState;
  currentUserId: string;
  onToggleReady: () => void;
  onSelectGame: (gameId: MiniGameType) => void;
  onToggleRandom: () => void;
  onStartGame: () => void;
  onChangeAvatar: () => void;
  onKickPlayer?: (userId: string) => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  room,
  currentUserId,
  onToggleReady,
  onSelectGame,
  onToggleRandom,
  onStartGame,
  onChangeAvatar,
  onKickPlayer,
}) => {
  const [copied, setCopied] = useState(false);

  // Identify Host and Guest specifically by role, regardless of who is viewing
  const hostPlayer = room.players.find((p) => p.isHost) || room.players[0];
  const guestPlayer = room.players.find((p) => !p.isHost);

  const me = room.players.find((p) => p.id === currentUserId) || room.players[0];
  const isHost = me?.isHost;
  const isOpponentIn = Boolean(guestPlayer);
  const bothReady = isOpponentIn && room.players.every((p) => p.isReady);

  const handleCopyLink = () => {
    sound.pop();
    const url = `${window.location.origin}/room/${room.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-16">
      {/* 1. Compact Room Code Banner */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/95 border-2 border-[#FFD2E2] shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#716280] uppercase tracking-wider">
              รหัสห้อง
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-widest text-[#FF8EB2]">
              {room.code}
            </span>
          </div>
        </div>

        <Button
          variant="cream"
          size="sm"
          onClick={handleCopyLink}
          className="shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#1B6D46]" /> คัดลอกแล้ว!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> แชร์ชวนเพื่อน
            </>
          )}
        </Button>
      </div>

      {/* 2. Compact 2-Player Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Host Slot */}
        <div
          className={`p-3.5 rounded-3xl border-3 transition-all relative ${
            hostPlayer.id === currentUserId
              ? 'border-[#FF8EB2] bg-white shadow-[0_6px_20px_rgba(255,142,178,0.25)] ring-2 ring-[#FF8EB2]/30'
              : 'border-[#FFE3ED] bg-white/90 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar id={hostPlayer.avatar} size="md" expression={hostPlayer.isReady ? 'happy' : 'thinking'} />
              <div
                className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#FFE89A] border-2 border-white flex items-center justify-center shadow-sm"
                title="หัวหน้าห้อง"
              >
                <Crown className="w-3.5 h-3.5 text-[#523F16]" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-black text-sm text-[#41364F] truncate max-w-[120px]">
                  {hostPlayer.nickname}
                </h3>
                <span className="text-[10px] font-bold text-[#FF8EB2] bg-[#FFEBF2] px-2 py-0.5 rounded-full border border-[#FFD2E2]">
                  👑 หัวหน้าห้อง
                </span>
                {hostPlayer.id === currentUserId && (
                  <span className="text-[10px] font-black text-white bg-[#FF8EB2] px-1.5 py-0.5 rounded-full">
                    คุณ
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                    hostPlayer.isReady
                      ? 'bg-[#E3F8ED] text-[#1B6D46] border border-[#B9F0D5]'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {hostPlayer.isReady ? 'พร้อมแล้ว! ✨' : 'ยังไม่พร้อม'}
                </span>

                {hostPlayer.id === currentUserId && (
                  <button
                    onClick={onChangeAvatar}
                    className="text-[10px] font-bold text-[#9F82F7] hover:underline cursor-pointer"
                  >
                    แก้ไขชื่อ / ตัวละคร ✏️
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Guest Slot */}
        <div
          className={`p-3.5 rounded-3xl border-3 transition-all relative ${
            guestPlayer && guestPlayer.id === currentUserId
              ? 'border-[#9F82F7] bg-white shadow-[0_6px_20px_rgba(205,190,255,0.25)] ring-2 ring-[#9F82F7]/30'
              : 'border-[#EFEAFF] bg-white/90 shadow-sm'
          }`}
        >
          {guestPlayer ? (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar id={guestPlayer.avatar} size="md" expression={guestPlayer.isReady ? 'happy' : 'thinking'} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-sm text-[#41364F] truncate max-w-[120px]">
                    {guestPlayer.nickname}
                  </h3>
                  <span className="text-[10px] font-bold text-[#9F82F7] bg-[#EFEAFF] px-2 py-0.5 rounded-full border border-[#CDBEFF]">
                    ผู้เล่น 2
                  </span>
                  {guestPlayer.id === currentUserId && (
                    <span className="text-[10px] font-black text-white bg-[#9F82F7] px-1.5 py-0.5 rounded-full">
                      คุณ
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                      guestPlayer.isReady
                        ? 'bg-[#E3F8ED] text-[#1B6D46] border border-[#B9F0D5]'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {guestPlayer.isReady ? 'พร้อมแล้ว! ✨' : 'กำลังเตรียมตัว...'}
                  </span>

                  {guestPlayer.id === currentUserId && (
                    <button
                      onClick={onChangeAvatar}
                      className="text-[10px] font-bold text-[#9F82F7] hover:underline cursor-pointer"
                    >
                      แก้ไขชื่อ / ตัวละคร ✏️
                    </button>
                  )}

                  {isHost && guestPlayer.id !== currentUserId && (
                    <button
                      onClick={() => {
                        if (confirm(`ต้องการเตะ ${guestPlayer.nickname} ออกจากห้องหรือไม่?`)) {
                          onKickPlayer?.(guestPlayer.id);
                        }
                      }}
                      className="text-[10px] font-bold text-[#FF5A5A] hover:bg-[#FFEAEA] px-2 py-0.5 rounded-full border border-[#FFD2D2] transition-colors cursor-pointer ml-auto"
                      title="เตะผู้เล่นนี้ออกจากห้อง"
                    >
                      เตะออก ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-2 text-center">
              <div className="w-9 h-9 rounded-full bg-[#F7F4FF] border border-dashed border-[#CDBEFF] flex items-center justify-center animate-pulse">
                <Users className="w-4 h-4 text-[#9F82F7]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-[#41364F]">รอผู้เล่นคนที่ 2...</p>
                <p className="text-[10px] text-[#716280]">แชร์รหัสห้องให้เพื่อนเพื่อเข้าเล่น</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Buttons Section (Prominent & Visible!) */}
      <div className="p-3 rounded-2xl bg-white/95 border-2 border-[#FFD2E2] shadow-sm flex flex-col sm:flex-row items-center gap-2.5">
        {/* Ready Toggle */}
        <Button
          variant={me.isReady ? 'mint' : 'lemon'}
          size="lg"
          onClick={onToggleReady}
          className="w-full sm:flex-1"
        >
          {me.isReady ? (
            <>
              <UserCheck className="w-4 h-4" /> คุณพร้อมแล้ว (กดเพื่อยกเลิก)
            </>
          ) : (
            'กดพร้อมเล่น! ✨'
          )}
        </Button>

        {/* Start Game Button (Host only) */}
        {isHost ? (
          <Button
            variant="pink"
            size="lg"
            disabled={!bothReady}
            onClick={onStartGame}
            className="w-full sm:flex-1"
          >
            <Play className="w-4 h-4 fill-current" /> เริ่มเกมเลย!
          </Button>
        ) : (
          <div className="text-center text-xs font-bold text-[#716280] w-full sm:w-auto px-4 py-2.5 bg-[#FFF7F4] rounded-2xl border border-[#FFD2E2]">
            {!isOpponentIn
              ? 'รอเพื่อนเข้าห้อง...'
              : bothReady
              ? 'รอหัวหน้าห้องกดเริ่มเกม ✨'
              : 'รอทั้งสองฝ่ายกดพร้อม...'}
          </div>
        )}
      </div>

      {/* 4. Mini-Games Selector (Compact & Clean 2-column Grid) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-[#41364F] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8EB2]" /> มินิเกมที่จะเล่น:
          </h3>

          {isHost && (
            <button
              onClick={() => {
                sound.pop();
                onToggleRandom();
              }}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                room.isRandomMode
                  ? 'border-[#FF8EB2] bg-[#FFEBF2] text-[#FF8EB2] font-black'
                  : 'border-[#FFD2E2] bg-white text-[#716280]'
              }`}
            >
              <Dices className="w-3.5 h-3.5" /> สุ่มเกมอัตโนมัติ {room.isRandomMode && '✓'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
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
                className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all select-none ${
                  isHost ? 'cursor-pointer hover:scale-101' : 'cursor-default'
                } ${
                  isSelected
                    ? 'border-[#FF8EB2] bg-[#FFEBF2] shadow-sm ring-2 ring-[#FF8EB2]/30'
                    : 'border-[#FFE3ED] bg-white hover:bg-[#FFF7F4]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl shrink-0">{game.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-xs text-[#41364F] truncate">
                      {game.titleTh}
                    </h4>
                    <p className="text-[10px] text-[#716280] truncate">
                      {game.estMinutes}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
