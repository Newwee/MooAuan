export type MascotId =
  | 'cat'
  | 'bunny'
  | 'bear'
  | 'duck'
  | 'frog'
  | 'panda'
  | 'fox'
  | 'hamster';

export interface MascotInfo {
  id: MascotId;
  nameTh: string;
  nameEn: string;
  emoji: string;
  primaryColor: string;
  accentColor: string;
  quoteTh: string;
}

export const MASCOTS: MascotInfo[] = [
  {
    id: 'cat',
    nameTh: 'น้องเหมียว',
    nameEn: 'Mochi Cat',
    emoji: '🐱',
    primaryColor: '#FFB8D2',
    accentColor: '#FF8EB2',
    quoteTh: 'เมี๊ยว~ เล่นด้วยกันนะ!',
  },
  {
    id: 'bunny',
    nameTh: 'กระต่ายนุ๊ก',
    nameEn: 'Bunny Berry',
    emoji: '🐰',
    primaryColor: '#CDBEFF',
    accentColor: '#9F82F7',
    quoteTh: 'หูยาวฟังเสียงหัวใจเธอ~',
  },
  {
    id: 'bear',
    nameTh: 'พี่หมีมูอ้วน',
    nameEn: 'MooAuan Bear',
    emoji: '🐻',
    primaryColor: '#FFE89A',
    accentColor: '#FFD447',
    quoteTh: 'ตัวกลมแต่รักกลมเกลียวนะ!',
  },
  {
    id: 'duck',
    nameTh: 'เป็ดก๊าบก๊าบ',
    nameEn: 'Ducky Pop',
    emoji: '🦆',
    primaryColor: '#FFE482',
    accentColor: '#FFC83B',
    quoteTh: 'ก๊าบก๊าบ เธอคือคนโปรด!',
  },
  {
    id: 'frog',
    nameTh: 'กบเคโระมินต์',
    nameEn: 'Minty Frog',
    emoji: '🐸',
    primaryColor: '#B9F0D5',
    accentColor: '#6BE0A7',
    quoteTh: 'อ๊บอ๊บ กระโดดมาหาแล้ว!',
  },
  {
    id: 'panda',
    nameTh: 'แพนด้าโบว์',
    nameEn: 'Panda Bow',
    emoji: '🐼',
    primaryColor: '#E2D9F3',
    accentColor: '#B6A6D9',
    quoteTh: 'ขอบตาดำเพราะคิดถึงเธอ~',
  },
  {
    id: 'fox',
    nameTh: 'จิ้งจอกส้ม',
    nameEn: 'Foxy Fluff',
    emoji: '🦊',
    primaryColor: '#FFC3A0',
    accentColor: '#FF9E6C',
    quoteTh: 'เจ้าเล่ห์แต่รักจริงนะ!',
  },
  {
    id: 'hamster',
    nameTh: 'แฮมสเตอร์พุงโต',
    nameEn: 'Chonky Hammy',
    emoji: '🐹',
    primaryColor: '#FFEAA7',
    accentColor: '#FDCB6E',
    quoteTh: 'เก็บความน่ารักไว้ในแก้ม!',
  },
];
