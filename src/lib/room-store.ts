import {
  ActiveGameState,
  MiniGameType,
  Player,
  PrankEvent,
  ReactionEmoji,
  RpsChoice,
  RoomState,
} from '@/types/game';
import { MascotId } from '@/types/avatar';
import { getRandomQuestions } from './questions';
import { createShuffledMemoryDeck } from './memory-cards';

// Global in-memory room store (preserved across module reloads in Node.js)
interface GlobalRoomStore {
  rooms: Map<string, RoomState>;
  subscribers: Map<string, Set<(room: RoomState) => void>>;
  adminLogs: {
    id: string;
    adminId: string;
    action: string;
    targetRoomCode?: string;
    payload?: unknown;
    timestamp: number;
  }[];
}

declare global {
  var __DUO_POP_ROOM_STORE__: GlobalRoomStore | undefined;
}

if (!global.__DUO_POP_ROOM_STORE__) {
  global.__DUO_POP_ROOM_STORE__ = {
    rooms: new Map(),
    subscribers: new Map(),
    adminLogs: [],
  };
}

const store = global.__DUO_POP_ROOM_STORE__;

export class RoomManager {
  // Get room by code (sync)
  public static getRoom(code: string): RoomState | null {
    return store.rooms.get(code.toUpperCase()) || null;
  }

  // Get room by code (async with cross-lambda cloud relay fallback)
  public static async getRoomAsync(code: string): Promise<RoomState | null> {
    const upperCode = code.toUpperCase();
    const local = store.rooms.get(upperCode);
    if (local) return local;

    try {
      const res = await fetch(`https://ntfy.sh/duo_pop_room_${upperCode}/json?poll=1`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split('\n');
        for (let i = lines.length - 1; i >= 0; i--) {
          try {
            const parsed = JSON.parse(lines[i]);
            if (parsed.event === 'message') {
              const r = JSON.parse(parsed.message) as RoomState;
              if (r && r.code === upperCode) {
                store.rooms.set(upperCode, r);
                return r;
              }
            }
          } catch {}
        }
      }
    } catch {}

    return null;
  }

  // Create new room
  public static createRoom(
    code: string,
    hostPlayer: { id: string; nickname: string; avatar: MascotId },
    selectedGame: MiniGameType = 'same-brain',
    isRandomMode: boolean = false
  ): RoomState {
    const upperCode = code.toUpperCase();
    const newRoom: RoomState = {
      code: upperCode,
      createdAt: Date.now(),
      selectedGame,
      isRandomMode,
      players: [
        {
          id: hostPlayer.id,
          nickname: hostPlayer.nickname,
          avatar: hostPlayer.avatar,
          isHost: true,
          isReady: true,
          score: 0,
          lastActive: Date.now(),
        },
      ],
      activeGame: null,
      activePrank: null,
      reactions: [],
      version: 1,
    };

    store.rooms.set(upperCode, newRoom);
    this.notify(upperCode);
    return newRoom;
  }

  // Join room
  public static async joinRoom(
    code: string,
    player: { id: string; nickname: string; avatar: MascotId }
  ): Promise<{ success: boolean; room?: RoomState; error?: string }> {
    const upperCode = code.toUpperCase();
    let room = this.getRoom(upperCode);
    if (!room) {
      room = await this.getRoomAsync(upperCode);
    }
    if (!room) {
      return { success: false, error: 'ไม่พบห้องที่ระบุ กรุณาตรวจสอบรหัสห้องอีกครั้ง' };
    }

    const existingPlayerIndex = room.players.findIndex((p) => p.id === player.id);

    if (existingPlayerIndex !== -1) {
      // Reconnecting player
      room.players[existingPlayerIndex].nickname = player.nickname;
      room.players[existingPlayerIndex].avatar = player.avatar;
      room.players[existingPlayerIndex].lastActive = Date.now();
      room.version++;
      this.notify(room.code);
      return { success: true, room };
    }

    if (room.players.length >= 2) {
      return { success: false, error: 'ห้องนี้เต็มแล้ว (จำกัด 2 ผู้เล่น)' };
    }

    // Ensure distinct default nickname and avatar if identical to host
    let assignedNickname = player.nickname;
    let assignedAvatar = player.avatar;
    if (room.players.length === 1) {
      const host = room.players[0];
      if (assignedNickname === host.nickname) {
        assignedNickname = 'กระต่ายนุ๊ก';
      }
      if (assignedAvatar === host.avatar) {
        assignedAvatar = host.avatar === 'cat' ? 'bunny' : 'cat';
      }
    }

    const newPlayer: Player = {
      id: player.id,
      nickname: assignedNickname,
      avatar: assignedAvatar,
      isHost: false,
      isReady: false,
      score: 0,
      lastActive: Date.now(),
    };

    room.players.push(newPlayer);
    room.version++;
    this.notify(room.code);
    return { success: true, room };
  }

  // Toggle ready state
  public static toggleReady(code: string, userId: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    const player = room.players.find((p) => p.id === userId);
    if (!player) return null;

    player.isReady = !player.isReady;
    player.lastActive = Date.now();
    room.version++;
    this.notify(room.code);
    return room;
  }

  // Update selected mini game (Host only)
  public static selectGame(code: string, userId: string, gameId: MiniGameType): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    const player = room.players.find((p) => p.id === userId);
    if (!player || !player.isHost) return null;

    room.selectedGame = gameId;
    room.isRandomMode = false;
    room.version++;
    this.notify(room.code);
    return room;
  }

  // Toggle random mode (Host only)
  public static toggleRandomMode(code: string, userId: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    const player = room.players.find((p) => p.id === userId);
    if (!player || !player.isHost) return null;

    room.isRandomMode = !room.isRandomMode;
    room.version++;
    this.notify(room.code);
    return room;
  }

  // Start Game (Host only)
  public static startGame(code: string, userId: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    const player = room.players.find((p) => p.id === userId);
    if (!player || !player.isHost) return null;

    // Both players must be ready
    if (room.players.length < 2 || !room.players.every((p) => p.isReady)) {
      return null;
    }

    let gameType = room.selectedGame;
    if (room.isRandomMode) {
      const allTypes: MiniGameType[] = ['same-brain', 'tap-battle', 'memory-match', 'rps'];
      gameType = allTypes[Math.floor(Math.random() * allTypes.length)];
    }

    room.activeGame = this.initializeGame(gameType, room.players);
    room.version++;
    this.notify(room.code);
    return room;
  }

  // Initialize game state machine
  private static initializeGame(type: MiniGameType, players: Player[]): ActiveGameState {
    const base: ActiveGameState = {
      type,
      status: 'playing',
      countdownSeconds: 0,
      winnerUserId: null,
    };

    if (type === 'same-brain') {
      const questions = getRandomQuestions(5);
      base.sameBrain = {
        currentQuestion: questions[0],
        questionIndex: 0,
        totalQuestions: questions.length,
        answers: {},
        revealed: false,
        matchScore: 0,
        history: [],
      };
    } else if (type === 'tap-battle') {
      const randomDelayMs = 2000 + Math.floor(Math.random() * 2500);
      base.tapBattle = {
        round: 1,
        maxRounds: 3,
        state: 'waiting-signal',
        signalTime: Date.now() + randomDelayMs,
        taps: {},
        roundWinnerId: null,
        wins: { [players[0].id]: 0, [players[1]?.id || 'p2']: 0 },
      };
    } else if (type === 'memory-match') {
      const cards = createShuffledMemoryDeck();
      base.memoryMatch = {
        cards,
        currentTurnUserId: players[0].id,
        selectedCardIds: [],
        matchedPairsCount: 0,
        pairsByPlayer: { [players[0].id]: 0, [players[1]?.id || 'p2']: 0 },
      };
    } else if (type === 'rps') {
      base.rps = {
        round: 1,
        maxRounds: 5,
        choices: { [players[0].id]: null, [players[1]?.id || 'p2']: null },
        revealed: false,
        roundWinnerId: null,
        wins: { [players[0].id]: 0, [players[1]?.id || 'p2']: 0 },
        history: [],
      };
    }

    return base;
  }

  // Submit Move for Same Brain
  public static submitSameBrainAnswer(
    code: string,
    userId: string,
    optionId: string
  ): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'same-brain') return null;

    const sb = room.activeGame.sameBrain;
    if (!sb || sb.revealed) return null;

    sb.answers[userId] = optionId;

    // Check if both players answered
    const playerIds = room.players.map((p) => p.id);
    const bothAnswered = playerIds.length === 2 && playerIds.every((id) => sb.answers[id]);

    if (bothAnswered) {
      sb.revealed = true;
      const [p1, p2] = playerIds;
      const matched = sb.answers[p1] === sb.answers[p2];

      if (matched) {
        sb.matchScore += 100;
        room.players.forEach((p) => (p.score += 100));
      } else {
        sb.matchScore += 20;
        room.players.forEach((p) => (p.score += 20));
      }

      sb.history.push({
        questionTh: sb.currentQuestion.promptTh,
        player1Answer: sb.answers[p1],
        player2Answer: sb.answers[p2],
        matched,
      });

      // If last question, determine final state
      if (sb.questionIndex + 1 >= sb.totalQuestions) {
        room.activeGame.status = 'finished';
        room.activeGame.winnerUserId = 'tie'; // Cooperative celebration!
      }
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Next Question for Same Brain
  public static nextSameBrainQuestion(code: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'same-brain') return null;

    const sb = room.activeGame.sameBrain;
    if (!sb || !sb.revealed) return null;

    if (sb.questionIndex + 1 < sb.totalQuestions) {
      const nextIdx = sb.questionIndex + 1;
      const questions = getRandomQuestions(sb.totalQuestions);
      sb.questionIndex = nextIdx;
      sb.currentQuestion = questions[nextIdx] || questions[0];
      sb.answers = {};
      sb.revealed = false;
    } else {
      room.activeGame.status = 'finished';
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Tap Battle Tap submission
  public static submitTap(code: string, userId: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'tap-battle') return null;

    const tb = room.activeGame.tapBattle;
    if (!tb || tb.state === 'round-over') return null;

    const now = Date.now();
    const isFalseStart = !tb.signalTime || now < tb.signalTime;
    const opponent = room.players.find((p) => p.id !== userId);

    if (isFalseStart) {
      // False start penalty! Opponent immediately wins round
      tb.taps[userId] = { timeMs: -1, falseStart: true };
      tb.state = 'round-over';
      tb.roundWinnerId = opponent ? opponent.id : null;
      if (opponent) {
        tb.wins[opponent.id] = (tb.wins[opponent.id] || 0) + 1;
        opponent.score += 50;
      }
    } else {
      // Valid tap after signal
      const reactionTimeMs = now - tb.signalTime!;
      tb.taps[userId] = { timeMs: reactionTimeMs, falseStart: false };

      // Check if both tapped or first tap wins
      tb.state = 'round-over';
      tb.roundWinnerId = userId;
      tb.wins[userId] = (tb.wins[userId] || 0) + 1;
      const winner = room.players.find((p) => p.id === userId);
      if (winner) winner.score += 50;
    }

    // Check match completion (First to 2 wins out of 3)
    const requiredWins = 2;
    for (const player of room.players) {
      if ((tb.wins[player.id] || 0) >= requiredWins) {
        room.activeGame.status = 'finished';
        room.activeGame.winnerUserId = player.id;
        break;
      }
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Next Round for Tap Battle
  public static nextTapBattleRound(code: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'tap-battle') return null;

    const tb = room.activeGame.tapBattle;
    if (!tb) return null;

    tb.round++;
    tb.state = 'waiting-signal';
    const randomDelayMs = 2000 + Math.floor(Math.random() * 2500);
    tb.signalTime = Date.now() + randomDelayMs;
    tb.taps = {};
    tb.roundWinnerId = null;

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Memory Match Card Flip
  public static flipMemoryCard(code: string, userId: string, cardId: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'memory-match') return null;

    const mm = room.activeGame.memoryMatch;
    if (!mm || mm.currentTurnUserId !== userId) return null;
    if (mm.selectedCardIds.length >= 2) return null;

    const card = mm.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return null;

    card.isFlipped = true;
    mm.selectedCardIds.push(cardId);

    // If second card flipped, check for match
    if (mm.selectedCardIds.length === 2) {
      const [c1Id, c2Id] = mm.selectedCardIds;
      const c1 = mm.cards.find((c) => c.id === c1Id)!;
      const c2 = mm.cards.find((c) => c.id === c2Id)!;

      if (c1.pairId === c2.pairId) {
        // MATCH!
        c1.isMatched = true;
        c2.isMatched = true;
        c1.matchedBy = userId;
        c2.matchedBy = userId;
        mm.matchedPairsCount++;
        mm.pairsByPlayer[userId] = (mm.pairsByPlayer[userId] || 0) + 1;
        mm.selectedCardIds = [];

        const player = room.players.find((p) => p.id === userId);
        if (player) player.score += 50;

        // Check if all 6 pairs matched
        if (mm.matchedPairsCount >= 6) {
          room.activeGame.status = 'finished';
          const p1 = room.players[0];
          const p2 = room.players[1];
          const score1 = mm.pairsByPlayer[p1.id] || 0;
          const score2 = mm.pairsByPlayer[p2?.id || ''] || 0;
          if (score1 > score2) room.activeGame.winnerUserId = p1.id;
          else if (score2 > score1) room.activeGame.winnerUserId = p2.id;
          else room.activeGame.winnerUserId = 'tie';
        }
      } else {
        // Mismatch! Will flip back after client delay or resolution call
      }
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Reset mismatched cards and pass turn
  public static resolveMemoryMismatch(code: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'memory-match') return null;

    const mm = room.activeGame.memoryMatch;
    if (!mm || mm.selectedCardIds.length < 2) return null;

    mm.selectedCardIds.forEach((id) => {
      const c = mm.cards.find((card) => card.id === id);
      if (c && !c.isMatched) {
        c.isFlipped = false;
      }
    });

    mm.selectedCardIds = [];
    // Switch turn to opponent
    const otherPlayer = room.players.find((p) => p.id !== mm.currentTurnUserId);
    if (otherPlayer) {
      mm.currentTurnUserId = otherPlayer.id;
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Rock Paper Scissors choice submission
  public static submitRpsChoice(code: string, userId: string, choice: RpsChoice): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'rps') return null;

    const rps = room.activeGame.rps;
    if (!rps || rps.revealed) return null;

    rps.choices[userId] = choice;

    const playerIds = room.players.map((p) => p.id);
    const bothChosen = playerIds.length === 2 && playerIds.every((id) => rps.choices[id]);

    if (bothChosen) {
      rps.revealed = true;
      const [p1, p2] = playerIds;
      const c1 = rps.choices[p1]!;
      const c2 = rps.choices[p2]!;

      let roundWinner: string | 'tie' = 'tie';
      if (c1 === c2) {
        roundWinner = 'tie';
      } else if (
        (c1 === 'rock' && c2 === 'scissors') ||
        (c1 === 'scissors' && c2 === 'paper') ||
        (c1 === 'paper' && c2 === 'rock')
      ) {
        roundWinner = p1;
        rps.wins[p1] = (rps.wins[p1] || 0) + 1;
        const player = room.players.find((p) => p.id === p1);
        if (player) player.score += 40;
      } else {
        roundWinner = p2;
        rps.wins[p2] = (rps.wins[p2] || 0) + 1;
        const player = room.players.find((p) => p.id === p2);
        if (player) player.score += 40;
      }

      rps.roundWinnerId = roundWinner;
      rps.history.push({
        round: rps.round,
        player1Choice: c1,
        player2Choice: c2,
        winnerId: roundWinner,
      });

      // Best of 5 (First to 3 wins)
      if ((rps.wins[p1] || 0) >= 3) {
        room.activeGame.status = 'finished';
        room.activeGame.winnerUserId = p1;
      } else if ((rps.wins[p2] || 0) >= 3) {
        room.activeGame.status = 'finished';
        room.activeGame.winnerUserId = p2;
      }
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Next RPS Round
  public static nextRpsRound(code: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room || !room.activeGame || room.activeGame.type !== 'rps') return null;

    const rps = room.activeGame.rps;
    if (!rps) return null;

    rps.round++;
    room.players.forEach((p) => {
      rps.choices[p.id] = null;
    });
    rps.revealed = false;
    rps.roundWinnerId = null;

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Rematch / Play Again
  public static resetToLobby(code: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    room.activeGame = null;
    room.activePrank = null;
    room.players.forEach((p) => {
      p.isReady = p.isHost;
    });

    if (room.isRandomMode) {
      const allTypes: MiniGameType[] = ['same-brain', 'tap-battle', 'memory-match', 'rps'];
      room.selectedGame = allTypes[Math.floor(Math.random() * allTypes.length)];
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Send Floating Reaction Emoji
  public static sendReaction(code: string, userId: string, emoji: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    const reaction: ReactionEmoji = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      emoji,
      x: 10 + Math.random() * 80,
      timestamp: Date.now(),
    };

    room.reactions.push(reaction);
    // Keep only last 15 reactions
    if (room.reactions.length > 15) {
      room.reactions = room.reactions.slice(-15);
    }

    room.version++;
    this.notify(room.code);
    return room;
  }

  // Trigger Admin Prank Event (Safe, dismissible, logged)
  public static triggerPrank(
    code: string,
    adminId: string,
    prank: Omit<PrankEvent, 'id' | 'triggeredAt'>
  ): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    const newPrank: PrankEvent = {
      ...prank,
      id: 'prank_' + Math.random().toString(36).substring(2, 9),
      triggeredAt: Date.now(),
    };

    room.activePrank = newPrank;
    room.version++;

    // Add to audit log
    store.adminLogs.unshift({
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      adminId,
      action: `trigger_prank_${prank.type}`,
      targetRoomCode: code,
      payload: prank,
      timestamp: Date.now(),
    });
    if (store.adminLogs.length > 100) store.adminLogs.pop();

    this.notify(room.code);

    // Auto-clear prank after duration
    setTimeout(() => {
      const r = this.getRoom(code);
      if (r && r.activePrank?.id === newPrank.id) {
        r.activePrank = null;
        r.version++;
        this.notify(r.code);
      }
    }, prank.durationMs || 4000);

    return room;
  }

  // Dismiss Prank (by player or admin)
  public static dismissPrank(code: string): RoomState | null {
    const room = this.getRoom(code);
    if (!room) return null;

    room.activePrank = null;
    room.version++;
    this.notify(room.code);
    return room;
  }

  // Get Admin Logs
  public static getAdminLogs() {
    return store.adminLogs;
  }

  // Realtime subscriber system for SSE / Local Broadcast
  public static subscribe(code: string, callback: (room: RoomState) => void): () => void {
    const upperCode = code.toUpperCase();
    if (!store.subscribers.has(upperCode)) {
      store.subscribers.set(upperCode, new Set());
    }
    const set = store.subscribers.get(upperCode)!;
    set.add(callback);

    return () => {
      set.delete(callback);
    };
  }

  private static notify(code: string) {
    const upperCode = code.toUpperCase();
    const room = store.rooms.get(upperCode);
    if (!room) return;

    // 1. Local subscribers
    const set = store.subscribers.get(upperCode);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(room);
        } catch {}
      });
    }

    // 2. Cloud Relay Broadcast for instant cross-device & cross-lambda sync
    try {
      fetch(`https://ntfy.sh/duo_pop_room_${upperCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room),
      }).catch(() => {});
    } catch {}
  }
}
