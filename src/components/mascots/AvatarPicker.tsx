'use client';

import React, { useState } from 'react';
import { MascotId, MASCOTS } from '@/types/avatar';
import { Avatar } from './Avatar';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { sound } from '@/lib/audio';
import { Check, Sparkles } from 'lucide-react';

interface AvatarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: MascotId;
  currentNickname: string;
  onSave: (avatar: MascotId, nickname: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  currentNickname,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<MascotId>(currentAvatar);
  const [nickname, setNickname] = useState(currentNickname);

  const activeMascot = MASCOTS.find((m) => m.id === selectedAvatar) || MASCOTS[0];

  const handleSave = () => {
    const trimmed = nickname.trim().slice(0, 15) || 'มูอ้วนจอมซน';
    sound.win();
    onSave(selectedAvatar, trimmed);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="เลือกตัวละครและชื่อเล่น ✨"
      className="max-w-md"
    >
      <div className="space-y-5">
        {/* Active Mascot Preview Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-[#FFF7F4] border-2 border-[#FFD2E2] shadow-inner text-center">
          <Avatar id={selectedAvatar} size="xl" expression="winner" />
          <h3 className="text-lg font-black text-[#41364F] mt-2 flex items-center gap-1.5">
            {activeMascot.emoji} {activeMascot.nameTh}
          </h3>
          <p className="text-xs text-[#716280] italic mt-0.5">
            &ldquo;{activeMascot.quoteTh}&rdquo;
          </p>
        </div>

        {/* Nickname Input */}
        <div>
          <label className="block text-xs font-bold text-[#41364F] mb-1.5">
            ชื่อเล่นของคุณ (สูงสุด 15 ตัวอักษร)
          </label>
          <div className="relative">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 15))}
              placeholder="เช่น มูอ้วน, คนสวย, ที่รัก"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#FFD2E2] bg-white text-[#41364F] font-bold focus:outline-none focus:border-[#FF8EB2] focus:ring-4 focus:ring-[#FF8EB2]/20 transition-all"
            />
            <span className="absolute right-3 top-3 text-[10px] font-bold text-[#716280]">
              {nickname.length}/15
            </span>
          </div>
        </div>

        {/* Mascot Grid Selection */}
        <div>
          <label className="block text-xs font-bold text-[#41364F] mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8EB2]" /> เลือกมาสคอตคู่ใจ
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {MASCOTS.map((m) => {
              const isSelected = m.id === selectedAvatar;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.pop();
                    setSelectedAvatar(m.id);
                  }}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#FF8EB2] bg-[#FFEBF2] scale-105 shadow-[0_4px_12px_rgba(255,142,178,0.4)]'
                      : 'border-transparent bg-[#FFF7F4] hover:bg-[#FFF0EB] hover:scale-102'
                  }`}
                >
                  <Avatar id={m.id} size="sm" animate={false} />
                  <span className="text-[10px] font-bold text-[#41364F] mt-1 truncate max-w-full">
                    {m.nameTh}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF8EB2] text-white rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <Button variant="pink" size="lg" className="w-full" onClick={handleSave}>
            บันทึกและลุยเลย! 💖
          </Button>
        </div>
      </div>
    </Modal>
  );
};
