'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/mascots/Avatar';
import { AvatarPicker } from '@/components/mascots/AvatarPicker';
import { FloatingDuoBackground } from '@/components/layout/FloatingDuoBackground';
import { Navbar } from '@/components/layout/Navbar';
import { sound } from '@/lib/audio';
import {
  getOrCreateGuestId,
  getStoredNickname,
  getStoredAvatar,
  saveStoredNickname,
  saveStoredAvatar,
} from '@/lib/utils';
import { MascotId, MASCOTS } from '@/types/avatar';
import { MINI_GAMES, MiniGameType } from '@/types/game';
import { Sparkles, ArrowRight, Dices, Plus, LogIn, Heart } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const [guestId, setGuestId] = useState<string>(() =>
    typeof window !== 'undefined' ? getOrCreateGuestId() : ''
  );
  const [nickname, setNickname] = useState<string>(() =>
    typeof window !== 'undefined' ? getStoredNickname() : 'มูอ้วนจอมซน'
  );
  const [avatar, setAvatar] = useState<MascotId>(() =>
    typeof window !== 'undefined' ? getStoredAvatar() : 'cat'
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveAvatar = (newAvatar: MascotId, newName: string) => {
    setAvatar(newAvatar);
    setNickname(newName);
    saveStoredAvatar(newAvatar);
    saveStoredNickname(newName);
  };

  // Create Room
  const handleCreateRoom = async (gameId: MiniGameType = 'same-brain', isRandom: boolean = false) => {
    try {
      setIsCreating(true);
      setErrorMessage('');
      sound.tap();

      const uid = guestId || getOrCreateGuestId();
      if (!guestId) setGuestId(uid);

      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uid,
          nickname,
          avatar,
          selectedGame: gameId,
          isRandomMode: isRandom,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'สร้างห้องไม่สำเร็จ');
      }

      router.push(`/room/${data.roomCode}`);
    } catch (err: unknown) {
      setIsCreating(false);
      setErrorMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างห้อง');
    }
  };

  // Join Room
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setIsJoining(true);
      setErrorMessage('');
      sound.tap();

      const uid = guestId || getOrCreateGuestId();
      if (!guestId) setGuestId(uid);

      const cleanCode = joinCode.trim().toUpperCase();
      const res = await fetch(`/api/rooms/${cleanCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uid,
          nickname,
          avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'เข้าร่วมห้องไม่สำเร็จ');
      }

      router.push(`/room/${cleanCode}`);
    } catch (err: unknown) {
      setIsJoining(false);
      setErrorMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#41364F]">
      <FloatingDuoBackground />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Animated Mascot Pair */}
          <div className="flex items-center justify-center -space-x-4 mb-2">
            <div className="animate-bounce" style={{ animationDuration: '3s' }}>
              <Avatar id="cat" size="xl" expression="winner" />
            </div>
            <div className="z-10 p-2 rounded-full bg-[#FFEBF2] border-2 border-[#FFB8D2] shadow-sm">
              <Heart className="w-6 h-6 text-[#FF8EB2] fill-[#FF8EB2]" />
            </div>
            <div className="animate-bounce" style={{ animationDuration: '3.5s' }}>
              <Avatar id="bunny" size="xl" expression="happy" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#41364F]">
            เล่นมินิเกมคู่กัน <span className="text-[#FF8EB2]">สุดคิ้วท์</span>
          </h1>

          <p className="text-base sm:text-lg text-[#716280] font-medium">
            เว็บเกมเล่น 2 คนสำหรับคู่รักและเพื่อนสนิท ไม่ต้องโหลดแอป แค่ส่งลิงก์ก็เล่นด้วยกันได้ทันที!
          </p>

          {/* Direct Nickname & Character Setup Box */}
          <div className="max-w-md mx-auto p-3.5 rounded-3xl bg-white/95 border-2 border-[#FFD2E2] shadow-md flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.pop();
                setIsPickerOpen(true);
              }}
              className="relative shrink-0 p-1.5 rounded-2xl bg-[#FFEBF2] hover:bg-[#FFDCE8] transition-all cursor-pointer group"
              title="คลิกเพื่อเปลี่ยนมาสคอต"
            >
              <Avatar id={avatar} size="md" />
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-[#FF8EB2] text-white px-1.5 py-0.5 rounded-full font-black shadow-sm">
                เปลี่ยน
              </span>
            </button>

            <div className="flex-1 text-left min-w-0">
              <label className="block text-[11px] font-bold text-[#716280] mb-0.5">
                🏷️ ตั้งชื่อเล่นของคุณ (Nickname)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 15);
                  setNickname(val);
                  saveStoredNickname(val);
                }}
                placeholder="พิมพ์ชื่อเล่นของคุณที่นี่..."
                className="w-full px-3 py-1.5 rounded-xl border border-[#FFD2E2] bg-[#FFF9F6] text-[#41364F] text-sm font-black focus:outline-none focus:border-[#FF8EB2] focus:bg-white focus:ring-2 focus:ring-[#FF8EB2]/30 transition-all"
                maxLength={15}
              />
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="max-w-md mx-auto p-3 rounded-2xl bg-[#FFEAEA] border-2 border-[#FFB8B8] text-xs font-bold text-[#D32F2F] text-center animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* Action Cards: Create Room & Join Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* 1. Create Room Card */}
          <Card variant="pink" className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB8D2] flex items-center justify-center text-2xl shadow-sm">
                <Plus className="w-6 h-6 text-white stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-[#41364F]">สร้างห้องใหม่</h2>
              <p className="text-xs text-[#716280]">
                สร้างห้องส่วนตัว รับรหัสห้อง 6 ตัวอักษร แล้วส่งชวนอีกคนมาประลองความน่ารักได้ทันที
              </p>
            </div>

            <div className="space-y-2.5 pt-6">
              <Button
                variant="pink"
                size="lg"
                isLoading={isCreating}
                onClick={() => handleCreateRoom('same-brain', false)}
                className="w-full"
              >
                <Sparkles className="w-4 h-4" /> สร้างห้องและเริ่มเล่น
              </Button>

              <Button
                variant="cream"
                size="md"
                isLoading={isCreating}
                onClick={() => handleCreateRoom('same-brain', true)}
                className="w-full"
              >
                <Dices className="w-4 h-4" /> โหมดสุ่มเกมอัตโนมัติ
              </Button>
            </div>
          </Card>

          {/* 2. Join Room Card */}
          <Card variant="lavender" className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#CDBEFF] flex items-center justify-center text-2xl shadow-sm">
                <LogIn className="w-6 h-6 text-[#34264F] stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black text-[#41364F]">เข้าห้องด้วยรหัส</h2>
              <p className="text-xs text-[#716280]">
                เพื่อนส่งรหัสห้องมาให้ใช่ไหม? กรอกรหัส 6 ตัวอักษรเพื่อเข้าร่วมห้องทันที
              </p>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-3 pt-6">
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="กรอกรหัสห้อง เช่น AB2K9X"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#CDBEFF] bg-white font-black text-center text-lg uppercase tracking-widest text-[#41364F] focus:outline-none focus:border-[#9F82F7] focus:ring-4 focus:ring-[#CDBEFF]/30 transition-all placeholder:text-xs placeholder:font-bold placeholder:tracking-normal placeholder:text-gray-400"
                />
              </div>

              <Button
                type="submit"
                variant="lavender"
                size="lg"
                disabled={joinCode.trim().length < 4}
                isLoading={isJoining}
                className="w-full"
              >
                เข้าเล่นห้องนี้ <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>

        {/* Mini-Games Showcase Section */}
        <div className="space-y-4 max-w-4xl mx-auto pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#41364F]">
              มินิเกมใน DUO POP 🎮
            </h2>
            <p className="text-xs text-[#716280]">
              คัดสรรมินิเกมเล่นสนุก เล่นเพลิน รู้ใจกันยิ่งขึ้น
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MINI_GAMES.map((game) => (
              <div
                key={game.id}
                className="p-5 rounded-3xl bg-white/90 border-2 border-[#FFD2E2] shadow-[0_8px_20px_rgba(255,142,178,0.2)] hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7F4] border-2 border-[#FFD2E2] flex items-center justify-center text-2xl mb-3">
                    {game.icon}
                  </div>
                  <h3 className="font-black text-base text-[#41364F] mb-1">
                    {game.titleTh}
                  </h3>
                  <p className="text-xs text-[#716280] leading-relaxed">
                    {game.descriptionTh}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#FFF0EB] flex items-center justify-between text-[11px] font-bold text-[#FF8EB2]">
                  <span>{game.badgeTh}</span>
                  <span className="text-[#716280]">{game.estMinutes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cute Mascot Gallery */}
        <div className="space-y-3 max-w-4xl mx-auto pt-6 text-center">
          <h3 className="text-lg font-black text-[#41364F]">
            แก๊งมาสคอตสุดน่ารักทั้ง 8 ตัว 🐾
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {MASCOTS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  sound.pop();
                  handleSaveAvatar(m.id, nickname);
                }}
                className={`p-2.5 rounded-2xl bg-white/80 border-2 transition-all flex flex-col items-center cursor-pointer ${
                  avatar === m.id
                    ? 'border-[#FF8EB2] bg-[#FFEBF2] scale-105 shadow-md'
                    : 'border-[#FFD2E2] hover:bg-white hover:scale-105'
                }`}
              >
                <Avatar id={m.id} size="sm" animate={false} />
                <span className="text-[10px] font-bold text-[#41364F] mt-1 truncate max-w-full">
                  {m.nameTh}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Mascot Customizer Modal */}
      <AvatarPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentAvatar={avatar}
        currentNickname={nickname}
        onSave={handleSaveAvatar}
      />
    </div>
  );
}
