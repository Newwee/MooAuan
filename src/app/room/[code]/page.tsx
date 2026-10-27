'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { RoomState, MiniGameType } from '@/types/game';
import { MascotId } from '@/types/avatar';
import { LobbyView } from '@/components/lobby/LobbyView';
import { GameContainer } from '@/components/games/GameContainer';
import { PrankOverlay } from '@/components/admin/PrankOverlay';
import { ReactionFloater } from '@/components/lobby/ReactionFloater';
import { AvatarPicker } from '@/components/mascots/AvatarPicker';
import { FloatingDuoBackground } from '@/components/layout/FloatingDuoBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { sound } from '@/lib/audio';
import {
  getOrCreateGuestId,
  getStoredNickname,
  getStoredAvatar,
  saveStoredAvatar,
  saveStoredNickname,
} from '@/lib/utils';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const { code: rawCode } = use(params);
  const code = rawCode.toUpperCase();
  const router = useRouter();

  const [guestId] = useState<string>(() =>
    typeof window !== 'undefined' ? getOrCreateGuestId() : ''
  );
  const [nickname, setNickname] = useState<string>(() =>
    typeof window !== 'undefined' ? getStoredNickname() : ''
  );
  const [avatar, setAvatar] = useState<MascotId>(() =>
    typeof window !== 'undefined' ? getStoredAvatar() : 'cat'
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [room, setRoom] = useState<RoomState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Join Room on Mount
  useEffect(() => {
    const uid = guestId || getOrCreateGuestId();
    const nick = nickname || getStoredNickname();
    const av = avatar || getStoredAvatar();

    const joinRoom = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const res = await fetch(`/api/rooms/${code}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: uid,
            nickname: nick,
            avatar: av,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'ไม่สามารถเข้าร่วมห้องได้');
        }

        setRoom(data.room);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดห้อง');
      } finally {
        setIsLoading(false);
      }
    };

    joinRoom();
  }, [code, guestId, nickname, avatar]);

  // 2. Realtime Event Stream via Server-Sent Events (SSE)
  useEffect(() => {
    if (!guestId) return;

    const eventSource = new EventSource(`/api/rooms/${code}/events`);

    eventSource.onmessage = (event) => {
      try {
        const updatedRoom = JSON.parse(event.data) as RoomState;
        setRoom(updatedRoom);
      } catch {}
    };

    return () => {
      eventSource.close();
    };
  }, [code, guestId]);

  // 3. Dispatch Server Action Helper
  const dispatchAction = useCallback(
    async (action: string, payload?: Record<string, unknown>) => {
      if (!guestId) return;

      try {
        const res = await fetch(`/api/rooms/${code}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            userId: guestId,
            payload,
          }),
        });

        const data = await res.json();
        if (data.success && data.room) {
          setRoom(data.room);
        }
      } catch {}
    },
    [code, guestId]
  );

  const handleSaveAvatar = (newAvatar: MascotId, newName: string) => {
    setAvatar(newAvatar);
    setNickname(newName);
    saveStoredAvatar(newAvatar);
    saveStoredNickname(newName);

    // Re-join with updated details
    fetch(`/api/rooms/${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: guestId,
        nickname: newName,
        avatar: newAvatar,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.room) setRoom(d.room);
      });
  };

  // Safe UI Wiggle effect if activePrank is 'ui-wiggle'
  const isJellyWiggle =
    room?.activePrank?.type === 'ui-wiggle' &&
    (!room.activePrank.targetUserId || room.activePrank.targetUserId === guestId);

  return (
    <div
      className={`min-h-screen flex flex-col relative text-[#41364F] transition-all ${
        isJellyWiggle ? 'animate-jelly' : ''
      }`}
    >
      <FloatingDuoBackground />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF8EB2]" />
            <h2 className="text-lg font-black text-[#41364F]">กำลังเชื่อมต่อเข้าสู่ห้อง {code}...</h2>
          </div>
        ) : errorMessage ? (
          <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-white border-2 border-[#FFD2E2] shadow-lg text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-[#FF7D7D] mx-auto" />
            <h2 className="text-xl font-black text-[#41364F]">เข้าร่วมห้องไม่สำเร็จ</h2>
            <p className="text-sm text-[#716280]">{errorMessage}</p>
            <Button
              variant="pink"
              size="md"
              onClick={() => router.push('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแรก
            </Button>
          </div>
        ) : room ? (
          <>
            {/* If no active game: Show Lobby */}
            {!room.activeGame ? (
              <LobbyView
                room={room}
                currentUserId={guestId}
                onToggleReady={() => {
                  sound.tap();
                  dispatchAction('toggle-ready');
                }}
                onSelectGame={(gameId: MiniGameType) => {
                  sound.pop();
                  dispatchAction('select-game', { gameId });
                }}
                onToggleRandom={() => {
                  sound.pop();
                  dispatchAction('toggle-random');
                }}
                onStartGame={() => {
                  sound.win();
                  dispatchAction('start-game');
                }}
                onChangeAvatar={() => {
                  sound.pop();
                  setIsPickerOpen(true);
                }}
              />
            ) : (
              /* If active game: Show Game Container */
              <GameContainer
                activeGame={room.activeGame}
                players={room.players}
                currentUserId={guestId}
                roomCode={room.code}
                onDispatchAction={dispatchAction}
                onBackToLobby={() => dispatchAction('reset-to-lobby')}
              />
            )}

            {/* Reaction Floater bar */}
            <ReactionFloater
              reactions={room.reactions}
              onSendReaction={(emoji) => dispatchAction('send-reaction', { emoji })}
            />

            {/* Admin Prank Overlay renderer */}
            <PrankOverlay
              prank={room.activePrank}
              currentUserId={guestId}
              onDismiss={() => dispatchAction('dismiss-prank')}
            />
          </>
        ) : null}
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
