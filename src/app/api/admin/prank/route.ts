import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-store';
import { PrankEvent } from '@/types/game';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'mooauan2026';

export async function POST(req: NextRequest) {
  try {
    const keyHeader = req.headers.get('x-admin-key');
    const body = await req.json();
    const { passcode, roomCode, prankType, targetUserId, title, message, emoji, durationMs } = body;

    const authKey = keyHeader || passcode;

    if (!authKey || authKey !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Unauthorized: รหัสผ่านแอดมินไม่ถูกต้อง' }, { status: 401 });
    }

    if (!roomCode || !prankType) {
      return NextResponse.json({ error: 'กรุณาระบุ roomCode และ prankType' }, { status: 400 });
    }

    const room = RoomManager.getRoom(roomCode);
    if (!room) {
      return NextResponse.json({ error: 'ไม่พบห้องเป้าหมาย' }, { status: 404 });
    }

    const prankPayload: Omit<PrankEvent, 'id' | 'triggeredAt'> = {
      type: prankType,
      targetUserId: targetUserId || undefined,
      title: title || undefined,
      message: message || undefined,
      emoji: emoji || undefined,
      durationMs: Math.min(Math.max(durationMs || 3500, 2000), 10000), // safe clamp between 2s and 10s
    };

    const updated = RoomManager.triggerPrank(roomCode, 'admin_master', prankPayload);

    return NextResponse.json({
      success: true,
      message: `แกล้งสำเร็จ! ส่งผลกระทบ ${prankType} ไปยังห้อง ${roomCode}`,
      room: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Admin error', details: String(err) }, { status: 500 });
  }
}
