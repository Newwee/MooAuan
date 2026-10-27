import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MascotId, MASCOTS } from '@/types/avatar';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Obfuscated cloud relay topic for rooms (protects from topic scrapers)
export function getCloudTopic(code: string): string {
  const upper = code.toUpperCase();
  let hash = 0;
  for (let i = 0; i < upper.length; i++) {
    hash = (hash << 5) - hash + upper.charCodeAt(i);
    hash |= 0;
  }
  const cleanHash = Math.abs(hash).toString(36);
  return `duo_pop_v3_${upper}_${cleanHash}`;
}

// Generate human-friendly 6-character room code without ambiguous characters (0, O, 1, I, L)
export function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

export function formatTimeMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// Get or generate persistent guest user ID
export function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return 'server-user';
  let id = localStorage.getItem('duo_pop_uid');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    localStorage.setItem('duo_pop_uid', id);
  }
  return id;
}

// Get or set guest nickname
export function getStoredNickname(): string {
  if (typeof window === 'undefined') return 'ผู้เล่นนิรนาม';
  const name = localStorage.getItem('duo_pop_nickname');
  if (name && name.trim().length > 0) return name.trim().slice(0, 15);
  return 'มูอ้วนจอมซน';
}

export function saveStoredNickname(name: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('duo_pop_nickname', name.trim().slice(0, 15));
}

// Get or set guest avatar
export function getStoredAvatar(): MascotId {
  if (typeof window === 'undefined') return 'cat';
  const saved = localStorage.getItem('duo_pop_avatar') as MascotId;
  if (saved && MASCOTS.some((m) => m.id === saved)) {
    return saved;
  }
  return 'cat';
}

export function saveStoredAvatar(avatar: MascotId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('duo_pop_avatar', avatar);
}

// Delay helper
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
