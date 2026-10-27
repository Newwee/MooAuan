import { MemoryCard } from '@/types/game';

const CARD_PAIRS = [
  { pairId: 1, icon: '🧋', label: 'ชานมไข่มุก' },
  { pairId: 2, icon: '🍩', label: 'โดนัทสตรอว์เบอร์รี' },
  { pairId: 3, icon: '🍰', label: 'เค้กชอร์ตเค้ก' },
  { pairId: 4, icon: '🐾', label: 'อุ้งเท้าแมว' },
  { pairId: 5, icon: '🌟', label: 'คทาดาววิ้ง' },
  { pairId: 6, icon: '☕', label: 'ลาเต้หัวใจ' },
];

export function createShuffledMemoryDeck(): MemoryCard[] {
  const cards: MemoryCard[] = [];

  CARD_PAIRS.forEach((pair) => {
    // Card A
    cards.push({
      id: `card_${pair.pairId}_a`,
      pairId: pair.pairId,
      icon: pair.icon,
      label: pair.label,
      isFlipped: false,
      isMatched: false,
    });
    // Card B
    cards.push({
      id: `card_${pair.pairId}_b`,
      pairId: pair.pairId,
      icon: pair.icon,
      label: pair.label,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
