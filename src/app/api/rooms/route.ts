import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-store';
import { generateRoomCode } from '@/lib/utils';
import { MascotId } from '@/types/avatar';
import { MiniGameType } from '@/types/game';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, nickname, avatar, selectedGame, isRandomMode } = body as {
      userId?: string;
      nickname?: string;
      avatar?: MascotId;
      selectedGame?: MiniGameType;
      isRandomMode?: boolean;
    };

    if (!userId || !nickname) {
      return NextResponse.json(
        { error: 'กรุณาระบุชื่อเล่นและรหัสผู้เล่น' },
        { status: 400 }
      );
    }

    // Generate unique room code
    let code = generateRoomCode();
    let attempts = 0;
    while (RoomManager.getRoom(code) && attempts < 10) {
      code = generateRoomCode();
      attempts++;
    }

    const room = RoomManager.createRoom(
      code,
      {
        id: userId,
        nickname: nickname.trim().slice(0, 15),
        avatar: avatar || 'cat',
      },
      selectedGame || 'same-brain',
      Boolean(isRandomMode)
    );

    return NextResponse.json({ success: true, roomCode: code, room });
  } catch (err) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างห้อง', details: String(err) },
      { status: 500 }
    );
  }
}
