import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-store';
import { MascotId } from '@/types/avatar';

interface Params {
  params: Promise<{ code: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { code } = await params;
  const room = RoomManager.getRoom(code);

  if (!room) {
    return NextResponse.json(
      { error: 'ไม่พบห้องที่ระบุ' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, room });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const body = await req.json();
    const { userId, nickname, avatar } = body as {
      userId?: string;
      nickname?: string;
      avatar?: MascotId;
    };

    if (!userId || !nickname) {
      return NextResponse.json(
        { error: 'กรุณาระบุข้อมูลผู้เล่นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const result = RoomManager.joinRoom(code, {
      id: userId,
      nickname: nickname.trim().slice(0, 15),
      avatar: avatar || 'bunny',
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: result.room });
  } catch (err) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าร่วมห้อง', details: String(err) },
      { status: 500 }
    );
  }
}
