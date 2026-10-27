import { MascotId } from './avatar';

export type MiniGameType = 'same-brain' | 'tap-battle' | 'memory-match' | 'rps';

export type GameStatus = 'lobby' | 'countdown' | 'playing' | 'resolving' | 'finished';

export interface Player {
  id: string;
  nickname: string;
  avatar: MascotId;
  isHost: boolean;
  isReady: boolean;
  score: number;
  lastActive: number;
}

export interface QuestionData {
  id: string;
  category: string;
  promptTh: string;
  promptEn: string;
  options: {
    id: string;
    textTh: string;
    textEn: string;
    emoji: string;
  }[];
}

export interface MemoryCard {
  id: string;
  pairId: number;
  icon: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchedBy?: string;
}

export type RpsChoice = 'rock' | 'paper' | 'scissors';

export interface SameBrainState {
  currentQuestion: QuestionData;
  questionIndex: number;
  totalQuestions: number;
  answers: Record<string, string>; // userId -> optionId
  revealed: boolean;
  matchScore: number;
  history: {
    questionTh: string;
    player1Answer: string;
    player2Answer: string;
    matched: boolean;
  }[];
}

export interface TapBattleState {
  round: number;
  maxRounds: number;
  state: 'waiting-signal' | 'ready-to-tap' | 'round-over';
  signalTime: number | null; // timestamp ms when "TAP" appears
  taps: Record<string, { timeMs: number; falseStart: boolean }>;
  roundWinnerId: string | null;
  wins: Record<string, number>; // userId -> number of rounds won
}

export interface MemoryMatchState {
  cards: MemoryCard[];
  currentTurnUserId: string;
  selectedCardIds: string[];
  matchedPairsCount: number;
  pairsByPlayer: Record<string, number>; // userId -> count
}

export interface RpsState {
  round: number;
  maxRounds: number;
  choices: Record<string, RpsChoice | null>; // userId -> choice
  revealed: boolean;
  roundWinnerId: string | null | 'tie';
  wins: Record<string, number>; // userId -> round wins
  history: {
    round: number;
    player1Choice: RpsChoice;
    player2Choice: RpsChoice;
    winnerId: string | null | 'tie';
  }[];
}

export interface ActiveGameState {
  type: MiniGameType;
  status: GameStatus;
  countdownSeconds: number;
  sameBrain?: SameBrainState;
  tapBattle?: TapBattleState;
  memoryMatch?: MemoryMatchState;
  rps?: RpsState;
  winnerUserId: string | null | 'tie';
}

export interface ReactionEmoji {
  id: string;
  userId: string;
  emoji: string;
  x: number;
  timestamp: number;
}

export interface PrankEvent {
  id: string;
  type:
    | 'confetti'
    | 'emoji-rain'
    | 'ui-wiggle'
    | 'fake-loading'
    | 'meme-popup'
    | 'disco-lights';
  targetUserId?: string; // if empty, applies to entire room
  title?: string;
  message?: string;
  emoji?: string;
  durationMs: number;
  triggeredAt: number;
}

export interface RoomState {
  code: string;
  createdAt: number;
  selectedGame: MiniGameType;
  isRandomMode: boolean;
  players: Player[];
  activeGame: ActiveGameState | null;
  activePrank: PrankEvent | null;
  reactions: ReactionEmoji[];
  version: number;
}

export interface MiniGameMeta {
  id: MiniGameType;
  titleTh: string;
  titleEn: string;
  taglineTh: string;
  icon: string;
  accentColor: string;
  descriptionTh: string;
  howToPlayTh: string[];
  estMinutes: string;
  badgeTh: string;
}

export const MINI_GAMES: MiniGameMeta[] = [
  {
    id: 'same-brain',
    titleTh: 'ใจตรงกัน (Same Brain)',
    titleEn: 'Same Brain',
    taglineTh: 'วัดคลื่นสมอง ตอบตรงใจกันแค่ไหน!',
    icon: '🧠',
    accentColor: '#FFB8D2',
    descriptionTh: 'ตอบคำถามลับโดยไม่ให้อีกคนเห็นคำตอบ เปิดพร้อมกันดูว่าใจตรงกันกี่เปอร์เซ็นต์!',
    howToPlayTh: [
      'อ่านคำถามน่ารักๆ พร้อมกัน',
      'เลือกคำตอบที่คิดว่า "ใช่ที่สุด" หรือตรงกับอีกคน',
      'ระบบจะเปิดเผยพร้อมกัน และคำนวณคะแนนความเข้ากัน!',
    ],
    estMinutes: '2-3 นาที',
    badgeTh: 'ยอดนิยมสำหรับคู่รัก 💖',
  },
  {
    id: 'tap-battle',
    titleTh: 'แตะไวชิงจังหวะ (Tap Battle)',
    titleEn: 'Tap Battle',
    taglineTh: 'ใครไวกว่าใคร รอสัญญาณแล้วกดเลย!',
    icon: '⚡',
    accentColor: '#FFE89A',
    descriptionTh: 'ศึกวัดปฏิกิริยาความไวสุดตื่นเต้น ห้ามกดก่อนสัญญาณเด็ดขาด!',
    howToPlayTh: [
      'ตั้งสมาธิรอสัญญาณ "กดเลย!"',
      'ห้ามกดตอนกำลังเตรียมตัว (ฟาวล์ทันที)',
      'ใครแตะได้เร็วกว่าในหน่วยมิลลิวินาที ชนะรอบนั้น!',
    ],
    estMinutes: '1-2 นาที',
    badgeTh: 'ตื่นเต้นสะใจ ⚡',
  },
  {
    id: 'memory-match',
    titleTh: 'จับคู่ขนมหวาน (Memory Match)',
    titleEn: 'Sweet Memory',
    taglineTh: 'ผลัดกันเปิดไพ่จับคู่ความจำสุดคิ้วท์',
    icon: '🎴',
    accentColor: '#CDBEFF',
    descriptionTh: 'ผลัดกันเปิดการ์ดของหวาน 12 ใบ ใครจำแม่นและจับคู่ได้มากกว่าคือผู้ชนะ!',
    howToPlayTh: [
      'ผลัดกันเปิดการ์ดทีละ 2 ใบ',
      'ถ้าการ์ดตรงกัน จะได้คะแนนและเปิดต่อได้อีกตา',
      'ถ้าไม่ตรง การ์ดจะคว่ำลงและเปลี่ยนเทิร์นให้อีกฝ่าย',
    ],
    estMinutes: '3-4 นาที',
    badgeTh: 'สายชิลล์ใช้สมอง 🍓',
  },
  {
    id: 'rps',
    titleTh: 'เป่ายิ้งฉุบมหาศึก (Rock Paper Scissors)',
    titleEn: 'Duo RPS',
    taglineTh: 'ค้อน กรรไกร กระดาษ ฉบับตัดสินชะตา!',
    icon: '✌️',
    accentColor: '#B9F0D5',
    descriptionTh: 'เกมคลาสสิกที่ทุกคนคุ้นเคย แข่งขัน Best of 5 ลุ้นทุกตา!',
    howToPlayTh: [
      'เลือก ค้อน ✊ กรรไกร ✌️ หรือ กระดาษ ✋',
      'ทั้งสองฝ่ายไม่เห็นตัวเลือกจนกว่าจะเปิดพร้อมกัน',
      'ใครถึง 3 แต้มก่อน คว้าชัยชนะไปครอง!',
    ],
    estMinutes: '1-2 นาที',
    badgeTh: 'คลาสสิกเล่นไว ✊',
  },
];
