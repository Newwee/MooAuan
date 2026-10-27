'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FloatingDuoBackground } from '@/components/layout/FloatingDuoBackground';
import { Navbar } from '@/components/layout/Navbar';
import { sound } from '@/lib/audio';
import {
  Shield,
  Key,
  Sparkles,
  Send,
  History,
  CheckCircle2,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetRoomCode?: string;
  payload?: unknown;
  timestamp: number;
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [targetRoomCode, setTargetRoomCode] = useState('');

  // Prank form state
  const [prankType, setPrankType] = useState('confetti');
  const [customTitle, setCustomTitle] = useState('✨ แอดมินส่งความน่ารักมาให้!');
  const [customMessage, setCustomMessage] = useState('หมูอ้วนกำลังมองเธออยู่นะจ๊ะ 👀💖');
  const [customEmoji, setCustomEmoji] = useState('🐷');
  const [durationSec, setDurationSec] = useState(4);

  const [statusMessage, setStatusMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  // Authenticate Admin
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    if (passcode.trim() === 'mooauan2026') {
      sound.win();
      setIsAuthenticated(true);
      fetchLogs('mooauan2026');
    } else {
      sound.lose();
      setStatusMessage('รหัสผ่านไม่ถูกต้อง (รหัสเริ่มต้น: mooauan2026)');
    }
  };

  const fetchLogs = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/logs?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch {}
  };

  // Trigger Prank
  const handleTriggerPrank = async () => {
    if (!targetRoomCode.trim()) {
      setStatusMessage('กรุณาระบุรหัสห้องเป้าหมาย');
      return;
    }

    try {
      setIsSending(true);
      setStatusMessage('');
      sound.tap();

      const res = await fetch('/api/admin/prank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': passcode,
        },
        body: JSON.stringify({
          passcode,
          roomCode: targetRoomCode.trim().toUpperCase(),
          prankType,
          title: customTitle,
          message: customMessage,
          emoji: customEmoji,
          durationMs: durationSec * 1000,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ส่งไม่สำเร็จ');
      }

      sound.win();
      setStatusMessage(`✅ ${data.message}`);
      fetchLogs(passcode);
    } catch (err: unknown) {
      sound.lose();
      setStatusMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่ง');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#41364F]">
      <FloatingDuoBackground />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#EFEAFF] text-[#6948C9] mb-1">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-[#41364F]">
            Admin Control & Prank Mode 🎭
          </h1>
          <p className="text-xs text-[#716280]">
            แผงควบคุมระบบสำหรับเจ้าของห้องและแอดมิน เพื่อส่งเอฟเฟกต์ตลกฮาๆ แบบปลอดภัย
          </p>
        </div>

        {!isAuthenticated ? (
          /* Login Card */
          <Card variant="lavender" className="max-w-md mx-auto p-6 space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-black text-[#41364F]">เข้าสู่ระบบแอดมิน</h2>
              <p className="text-xs text-[#716280]">กรอก Admin Passcode เพื่อยืนยันสิทธิ์</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="กรอกรหัสผ่าน (เริ่มต้น: mooauan2026)"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#CDBEFF] bg-white text-center font-bold text-[#41364F] focus:outline-none focus:border-[#9F82F7] focus:ring-4 focus:ring-[#CDBEFF]/20 transition-all placeholder:text-xs"
                />
              </div>

              {statusMessage && (
                <p className="text-xs font-bold text-[#D32F2F] text-center">{statusMessage}</p>
              )}

              <Button variant="lavender" size="lg" type="submit" className="w-full">
                <Key className="w-4 h-4" /> ยืนยันรหัสผ่าน
              </Button>
            </form>
          </Card>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-6">
            {statusMessage && (
              <div className="p-3.5 rounded-2xl bg-[#E3F8ED] border-2 border-[#B9F0D5] text-xs font-bold text-[#1B6D46] text-center animate-in fade-in">
                {statusMessage}
              </div>
            )}

            {/* Target Room Input */}
            <Card variant="white" className="p-5">
              <h3 className="text-sm font-black text-[#41364F] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF8EB2]" /> เลือกรหัสห้องเป้าหมาย
              </h3>
              <input
                type="text"
                maxLength={6}
                value={targetRoomCode}
                onChange={(e) => setTargetRoomCode(e.target.value.toUpperCase())}
                placeholder="กรอกรหัสห้อง เช่น DUO123"
                className="w-full sm:w-64 px-4 py-2 rounded-2xl border-2 border-[#FFD2E2] font-black text-center text-lg uppercase tracking-widest text-[#41364F] focus:outline-none focus:border-[#FF8EB2]"
              />
            </Card>

            {/* Prank Effects Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prank Types Form */}
              <Card variant="pink" className="p-5 space-y-4">
                <h3 className="text-sm font-black text-[#41364F]">
                  เลือกประเภทเอฟเฟกต์แกล้ง 🎪
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'confetti', label: '🎊 พลุกระดาษ Confetti' },
                    { id: 'emoji-rain', label: '🌧️ ฝนอีโมจิตก' },
                    { id: 'ui-wiggle', label: '🍮 หน้าจอเต้นระบำ Jelly' },
                    { id: 'fake-loading', label: '💾 โหลดทิพย์ 99%' },
                    { id: 'meme-popup', label: '📢 ป้ายประกาศกวนๆ' },
                    { id: 'disco-lights', label: '🪩 ไฟดิสโก้พาสเทล' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        sound.pop();
                        setPrankType(p.id);
                      }}
                      className={`p-3 rounded-2xl border-2 text-xs font-bold text-left transition-all cursor-pointer ${
                        prankType === p.id
                          ? 'border-[#FF8EB2] bg-white text-[#FF8EB2] shadow-sm scale-102'
                          : 'border-transparent bg-white/70 hover:bg-white text-[#41364F]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Sub-options for emoji-rain */}
                {prankType === 'emoji-rain' && (
                  <div>
                    <label className="block text-xs font-bold text-[#41364F] mb-1">
                      เลือกอีโมจิที่ตก:
                    </label>
                    <div className="flex gap-2">
                      {['🐷', '💖', '💩', '⭐', '🐱', '🍕'].map((em) => (
                        <button
                          key={em}
                          onClick={() => setCustomEmoji(em)}
                          className={`w-9 h-9 rounded-xl border-2 text-lg flex items-center justify-center cursor-pointer ${
                            customEmoji === em
                              ? 'border-[#FF8EB2] bg-white scale-110 shadow-sm'
                              : 'border-transparent bg-white/60'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom text for meme / fake loading */}
                {(prankType === 'meme-popup' || prankType === 'fake-loading') && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-bold text-[#41364F] mb-1">
                        หัวข้อป้าย:
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#FFD2E2] bg-white text-xs font-bold text-[#41364F]"
                      />
                    </div>
                    {prankType === 'meme-popup' && (
                      <div>
                        <label className="block text-xs font-bold text-[#41364F] mb-1">
                          ข้อความกวนๆ:
                        </label>
                        <input
                          type="text"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#FFD2E2] bg-white text-xs font-bold text-[#41364F]"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#41364F] mb-1">
                    <span>ระยะเวลาเอฟเฟกต์:</span>
                    <span>{durationSec} วินาที</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    value={durationSec}
                    onChange={(e) => setDurationSec(Number(e.target.value))}
                    className="w-full accent-[#FF8EB2]"
                  />
                </div>

                <Button
                  variant="pink"
                  size="lg"
                  isLoading={isSending}
                  onClick={handleTriggerPrank}
                  className="w-full"
                >
                  <Send className="w-4 h-4" /> ส่งเอฟเฟกต์ไปยังห้องทันที! 🚀
                </Button>
              </Card>

              {/* Safety Rules & Audit Log Preview */}
              <div className="space-y-4">
                <Card variant="mint" className="p-4 space-y-2">
                  <h4 className="text-xs font-black text-[#1B6D46] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> กฎความปลอดภัยของ Prank Mode
                  </h4>
                  <ul className="text-[11px] text-[#1B4E38] space-y-1 list-disc list-inside">
                    <li>ทุกเอฟเฟกต์ยุติเองอัตโนมัติตามเวลา (3-8 วินาที)</li>
                    <li>ผู้เล่นมีปุ่ม (X) ปิดเอฟเฟกต์ได้ทันทีตลอดเวลา</li>
                    <li>ไม่มีการตัดคะแนน ลบข้อมูล หรือรบกวนตรรกะเกม</li>
                    <li>ไม่มีเอฟเฟกต์ไฟกะพริบที่เป็นอันตรายต่อสายตา</li>
                  </ul>
                </Card>

                {/* Audit Logs Box */}
                <Card variant="white" className="p-4 space-y-3">
                  <h4 className="text-xs font-black text-[#41364F] flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[#9F82F7]" /> ประวัติคำสั่งแอดมิน (Audit Logs)
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 text-[11px] pr-1">
                    {logs.length === 0 ? (
                      <p className="text-gray-400 italic">ยังไม่มีประวัติคำสั่ง</p>
                    ) : (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2 rounded-xl bg-[#FFF7F4] border border-[#FFD2E2] flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-[#FF8EB2]">{log.action}</span>{' '}
                            <span className="text-[#41364F]">
                              (ห้อง: {log.targetRoomCode || '-'})
                            </span>
                          </div>
                          <span className="text-[10px] text-[#716280]">
                            {new Date(log.timestamp).toLocaleTimeString('th-TH')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
