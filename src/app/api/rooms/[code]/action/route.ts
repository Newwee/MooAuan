import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/room-store';
import { MiniGameType, RpsChoice } from '@/types/game';

interface Params {
  params: Promise<{ code: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  const { code } = await params;
  try {
    const body = await req.json();
    const { action, userId, payload } = body as {
      action: string;
      userId: string;
      payload?: Record<string, unknown>;
    };

    if (!userId || !action) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    // Ensure room is loaded in memory for this lambda instance
    let room = RoomManager.getRoom(code);
    if (!room) {
      room = await RoomManager.getRoomAsync(code);
    }
    if (!room) {
      return NextResponse.json({ error: 'ไม่พบห้องที่ระบุ' }, { status: 404 });
    }

    let updatedRoom = null;

    switch (action) {
      case 'toggle-ready':
        updatedRoom = RoomManager.toggleReady(code, userId);
        break;

      case 'select-game':
        if (payload?.gameId) {
          updatedRoom = RoomManager.selectGame(code, userId, payload.gameId as MiniGameType);
        }
        break;

      case 'toggle-random':
        updatedRoom = RoomManager.toggleRandomMode(code, userId);
        break;

      case 'start-game':
        updatedRoom = RoomManager.startGame(code, userId);
        break;

      case 'same-brain-answer':
        if (payload?.optionId) {
          updatedRoom = RoomManager.submitSameBrainAnswer(code, userId, String(payload.optionId));
        }
        break;

      case 'same-brain-next':
        updatedRoom = RoomManager.nextSameBrainQuestion(code);
        break;

      case 'tap-submit':
        updatedRoom = RoomManager.submitTap(code, userId);
        break;

      case 'tap-next-round':
        updatedRoom = RoomManager.nextTapBattleRound(code);
        break;

      case 'memory-flip':
        if (payload?.cardId) {
          updatedRoom = RoomManager.flipMemoryCard(code, userId, String(payload.cardId));
        }
        break;

      case 'memory-resolve-mismatch':
        updatedRoom = RoomManager.resolveMemoryMismatch(code);
        break;

      case 'rps-choice':
        if (payload?.choice) {
          updatedRoom = RoomManager.submitRpsChoice(code, userId, payload.choice as RpsChoice);
        }
        break;

      case 'rps-next-round':
        updatedRoom = RoomManager.nextRpsRound(code);
        break;

      case 'reset-to-lobby':
        updatedRoom = RoomManager.resetToLobby(code);
        break;

      case 'send-reaction':
        if (payload?.emoji) {
          updatedRoom = RoomManager.sendReaction(code, userId, String(payload.emoji));
        }
        break;

      case 'dismiss-prank':
        updatedRoom = RoomManager.dismissPrank(code);
        break;

      case 'kick-player':
        if (payload?.targetUserId) {
          updatedRoom = RoomManager.kickPlayer(code, userId, String(payload.targetUserId));
        }
        break;

      default:
        return NextResponse.json({ error: 'ไม่พบคำสั่งที่ระบุ' }, { status: 400 });
    }

    if (!updatedRoom) {
      return NextResponse.json(
        { error: 'ไม่สามารถดำเนินการได้ หรือเงื่อนไขยังไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (err) {
    return NextResponse.json(
      { error: 'Server action error', details: String(err) },
      { status: 500 }
    );
  }
}
