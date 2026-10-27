'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { RoomState, MiniGameType } from '@/types/game';
import { MascotId, MASCOTS } from '@/types/avatar';
import { LobbyView } from '@/components/lobby/LobbyView';
import { GameContainer } from '@/components/games/GameContainer';
import { PrankOverlay } from '@/components/admin/PrankOverlay';
import { ReactionFloater } from '@/components/lobby/ReactionFloater';
import { AvatarPicker } from '@/components/mascots/AvatarPicker';
import { Avatar } from '@/components/mascots/Avatar';
import { FloatingDuoBackground } from '@/components/layout/FloatingDuoBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { sound } from '@/lib/audio';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  getOrCreateGuestId,
  getStoredNickname,
  getStoredAvatar,
  saveStoredAvatar,
  saveStoredNickname,
  getCloudTopic,
} from '@/lib/utils';
import { Loader2, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';

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
    typeof window !== 'undefined' ? getStoredNickname() : 'มูอ้วนจอมซน'
  );
  const [avatar, setAvatar] = useState<MascotId>(() =>
    typeof window !== 'undefined' ? getStoredAvatar() : 'cat'
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [room, setRoom] = useState<RoomState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update room helper with version comparison to prevent stale overwrites
  const applyRoomUpdate = useCallback((newRoom: RoomState) => {
    if (!newRoom || !newRoom.code) return;
    setRoom((prev) => {
      if (!prev) return newRoom;
      if (newRoom.version >= prev.version) {
        return newRoom;
      }
      return prev;
    });
  }, []);

  // 1. Initial Room Fetch on Mount (READ-ONLY: Prevents crawlers/bots from auto-joining!)
  useEffect(() => {
    let isCancelled = false;

    const fetchInitialRoom = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const res = await fetch(`/api/rooms/${code}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok || !data.success || !data.room) {
          throw new Error(data.error || 'ไม่พบห้องที่ระบุ หรือห้องอาจหมดอายุแล้ว');
        }

        if (!isCancelled) {
          applyRoomUpdate(data.room);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setErrorMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดห้อง');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialRoom();

    return () => {
      isCancelled = true;
    };
  }, [code, applyRoomUpdate]);

  // 2. Realtime Channel: Cloud Relay EventSource using obfuscated topic
  useEffect(() => {
    if (!code) return;
    const topic = getCloudTopic(code);
    const relayUrl = `https://ntfy.sh/${topic}/sse`;
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(relayUrl);

      eventSource.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          if (raw.event === 'message') {
            const updated = JSON.parse(raw.message) as RoomState;
            if (updated && updated.code === code) {
              applyRoomUpdate(updated);
            }
          }
        } catch {}
      };
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [code, applyRoomUpdate]);

  // 3. Supabase Realtime Broadcast (if Supabase credentials are configured)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !code) return;

    const channel = supabase.channel(`room:${code}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'room_state' }, ({ payload }) => {
        if (payload && payload.code === code) {
          applyRoomUpdate(payload as RoomState);
        }
      })
      .subscribe();

    return () => {
      if (supabase) supabase.removeChannel(channel);
    };
  }, [code, applyRoomUpdate]);

  // 4. Resilient Fallback Polling (polls every 1.2s to guarantee zero desync)
  useEffect(() => {
    if (!code) return;

    const pollTimer = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${code}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.room) {
            applyRoomUpdate(data.room);
          }
        }
      } catch {}
    }, 1200);

    return () => clearInterval(pollTimer);
  }, [code, applyRoomUpdate]);

  // 5. Dispatch Server Action Helper with Immediate Multi-Channel Broadcast
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
          const updated = data.room as RoomState;
          applyRoomUpdate(updated);

          // Broadcast immediately to obfuscated cloud relay so opponent updates within ~30ms
          fetch(`https://ntfy.sh/${getCloudTopic(code)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch(() => {});

          // Broadcast to Supabase if configured
          if (isSupabaseConfigured && supabase) {
            supabase
              .channel(`room:${code}`)
              .send({
                type: 'broadcast',
                event: 'room_state',
                payload: updated,
              })
              .catch(() => {});
          }
        }
      } catch {}
    },
    [code, guestId, applyRoomUpdate]
  );

  // Manual Join Room triggered ONLY by explicit human user click (defeats all crawler bots!)
  const handleJoinRoom = async () => {
    try {
      setIsJoiningRoom(true);
      sound.tap();

      const uid = guestId || getOrCreateGuestId();
      const nick = nickname.trim().slice(0, 15) || getStoredNickname();
      const av = avatar || getStoredAvatar();

      saveStoredNickname(nick);
      saveStoredAvatar(av);

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

      applyRoomUpdate(data.room);
      sound.win();

      // Cloud relay broadcast
      fetch(`https://ntfy.sh/${getCloudTopic(code)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.room),
      }).catch(() => {});
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าร่วมห้อง');
    } finally {
      setIsJoiningRoom(false);
    }
  };

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
        if (d.success && d.room) {
          applyRoomUpdate(d.room);
          fetch(`https://ntfy.sh/${getCloudTopic(code)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(d.room),
          }).catch(() => {});
        }
      });
  };

  // Safe UI Wiggle effect if activePrank is 'ui-wiggle'
  const isJellyWiggle =
    room?.activePrank?.type === 'ui-wiggle' &&
    (!room.activePrank.targetUserId || room.activePrank.targetUserId === guestId);

  // Check if current user is an active player inside the room
  const isPlayerInRoom = Boolean(room && room.players.some((p) => p.id === guestId));
  const isRoomFull = Boolean(room && room.players.length >= 2);
  const hostPlayer = room?.players.find((p) => p.isHost) || room?.players[0];

  return (
    <div
      className={`min-h-screen flex flex-col relative text-[#41364F] transition-all ${
        isJellyWiggle ? 'animate-jelly' : ''
      }`}
    >
      <FloatingDuoBackground />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF8EB2]" />
            <h2 className="text-lg font-black text-[#41364F]">กำลังค้นหาห้อง {code}...</h2>
          </div>
        ) : errorMessage ? (
          <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-white border-2 border-[#FFD2E2] shadow-lg text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-[#FF7D7D] mx-auto" />
            <h2 className="text-xl font-black text-[#41364F]">ไม่สามารถเข้าห้องได้</h2>
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
        ) : !isPlayerInRoom ? (
          /* User is not yet in the room */
          isRoomFull ? (
            /* Room already has 2 players */
            <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FFD2E2] shadow-xl text-center space-y-4 animate-in fade-in">
              <Avatar id="cat" size="xl" expression="shocked" />
              <h2 className="text-xl font-black text-[#41364F]">ห้องนี้มีผู้เล่นครบ 2 คนแล้ว 😢</h2>
              <p className="text-xs text-[#716280] leading-relaxed">
                ห้องรหัส <strong>{code}</strong> มีผู้เล่นอยู่ครบ 2 คนแล้ว คุณสามารถสร้างห้องใหม่แล้วส่งชวนเพื่อนของคุณเองได้เลย!
              </p>
              <div className="space-y-2 pt-2">
                <Button
                  variant="pink"
                  size="md"
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4" /> สร้างห้องใหม่ของคุณเอง
                </Button>
                <Button
                  variant="cream"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแรก
                </Button>
              </div>
            </div>
          ) : (
            /* Human Join Card: Requires click to enter (Prevents bot auto-join!) */
            <div className="max-w-lg mx-auto my-6 sm:my-10 p-6 sm:p-8 rounded-3xl bg-white border-3 border-[#FFD2E2] shadow-xl text-center space-y-5 animate-in zoom-in-95">
              {/* Host info badge */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="relative">
                  <Avatar id={hostPlayer?.avatar || 'cat'} size="lg" expression="happy" />
                  <span className="absolute -top-1 -right-1 text-xs bg-[#FFE89A] border border-white rounded-full p-1 shadow-sm">
                    👑
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#FF8EB2] bg-[#FFEBF2] px-3 py-1 rounded-full border border-[#FFD2E2]">
                    คำเชิญเข้าห้องเล่นเกม
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#41364F] mt-1.5">
                    {hostPlayer?.nickname || 'เพื่อนของคุณ'} ชวนคุณเล่นมินิเกมคู่กัน!
                  </h2>
                  <p className="text-xs text-[#716280]">
                    รหัสห้อง: <strong className="text-[#FF8EB2] tracking-wider">{code}</strong>
                  </p>
                </div>
              </div>

              {/* Nickname input */}
              <div className="text-left bg-[#FFF7F4] p-4 rounded-2xl border-2 border-[#FFE3ED] space-y-1.5">
                <label className="block text-xs font-black text-[#41364F]">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFD2E2] bg-white text-[#41364F] text-sm font-black focus:outline-none focus:border-[#FF8EB2] focus:ring-2 focus:ring-[#FF8EB2]/30 transition-all"
                  maxLength={15}
                />
                <span className="text-[10px] text-[#716280] font-medium">
                  ชื่อนี้จะแสดงให้อีกคนเห็นในการแข่งขัน
                </span>
              </div>

              {/* Mascot Picker */}
              <div className="text-left space-y-2">
                <label className="block text-xs font-black text-[#41364F]">
                  🐱 เลือกตัวละครคู่ใจของคุณ
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {MASCOTS.map((m) => {
                    const isSelected = avatar === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          sound.pop();
                          setAvatar(m.id);
                          saveStoredAvatar(m.id);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FF8EB2] bg-[#FFEBF2] scale-105 shadow-md ring-2 ring-[#FF8EB2]/30'
                            : 'border-[#FFE3ED] bg-white hover:bg-[#FFF7F4]'
                        }`}
                      >
                        <Avatar id={m.id} size="sm" animate={false} />
                        <span className="text-[10px] font-bold text-[#41364F] mt-1 truncate">
                          {m.nameTh}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Join Action Button */}
              <div className="pt-2">
                <Button
                  variant="pink"
                  size="lg"
                  isLoading={isJoiningRoom}
                  onClick={handleJoinRoom}
                  className="w-full shadow-lg"
                >
                  <Sparkles className="w-4 h-4" /> เข้าร่วมห้องเลย! 💖
                </Button>
              </div>
            </div>
          )
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
                onKickPlayer={(targetUserId) => {
                  sound.tap();
                  dispatchAction('kick-player', { targetUserId });
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
