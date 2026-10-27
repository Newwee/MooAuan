'use client';

import React from 'react';
import { MascotId } from '@/types/avatar';
import { cn } from '@/lib/utils';

interface AvatarProps {
  id: MascotId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  expression?: 'happy' | 'thinking' | 'shocked' | 'winner';
  className?: string;
  animate?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  id,
  size = 'md',
  expression = 'happy',
  className,
  animate = true,
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-40 h-40',
  };

  // Render SVG Mascot based on ID
  const renderMascotSvg = () => {
    switch (id) {
      case 'cat':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Ears */}
            <polygon points="20,40 32,15 48,32" fill="#FFB8D2" />
            <polygon points="25,35 33,20 44,30" fill="#FF8EB2" />
            <polygon points="80,40 68,15 52,32" fill="#FFB8D2" />
            <polygon points="75,35 67,20 56,30" fill="#FF8EB2" />
            {/* Head */}
            <circle cx="50" cy="55" r="38" fill="#FFFBF8" stroke="#FFB8D2" strokeWidth="4" />
            {/* Blush cheeks */}
            <circle cx="28" cy="62" r="6" fill="#FF8EB2" opacity="0.6" />
            <circle cx="72" cy="62" r="6" fill="#FF8EB2" opacity="0.6" />
            {/* Eyes */}
            {expression === 'winner' ? (
              <>
                <path d="M30 48 Q36 42 42 48" stroke="#41364F" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M58 48 Q64 42 70 48" stroke="#41364F" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : expression === 'thinking' ? (
              <>
                <circle cx="36" cy="46" r="3.5" fill="#41364F" />
                <line x1="58" y1="46" x2="70" y2="46" stroke="#41364F" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : expression === 'shocked' ? (
              <>
                <circle cx="36" cy="46" r="5" fill="#41364F" />
                <circle cx="64" cy="46" r="5" fill="#41364F" />
              </>
            ) : (
              <>
                <circle cx="36" cy="48" r="4" fill="#41364F" />
                <circle cx="38" cy="46" r="1.5" fill="#FFFFFF" />
                <circle cx="64" cy="48" r="4" fill="#41364F" />
                <circle cx="66" cy="46" r="1.5" fill="#FFFFFF" />
              </>
            )}
            {/* Nose & Mouth */}
            <polygon points="48,56 52,56 50,59" fill="#FF8EB2" />
            <path d="M44 60 Q50 65 50 61 Q50 65 56 60" stroke="#41364F" strokeWidth="2.5" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="16" y1="56" x2="26" y2="58" stroke="#FFB8D2" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="64" x2="26" y2="62" stroke="#FFB8D2" strokeWidth="2" strokeLinecap="round" />
            <line x1="84" y1="56" x2="74" y2="58" stroke="#FFB8D2" strokeWidth="2" strokeLinecap="round" />
            <line x1="84" y1="64" x2="74" y2="62" stroke="#FFB8D2" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'bunny':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Long Ears */}
            <rect x="25" y="6" width="14" height="42" rx="7" fill="#CDBEFF" stroke="#9F82F7" strokeWidth="3" />
            <rect x="29" y="12" width="6" height="30" rx="3" fill="#FFE3ED" />
            <rect x="61" y="6" width="14" height="42" rx="7" fill="#CDBEFF" stroke="#9F82F7" strokeWidth="3" />
            <rect x="65" y="12" width="6" height="30" rx="3" fill="#FFE3ED" />
            {/* Head */}
            <circle cx="50" cy="58" r="36" fill="#FFFFFF" stroke="#CDBEFF" strokeWidth="4" />
            {/* Cheeks */}
            <circle cx="28" cy="65" r="5" fill="#FF8EB2" opacity="0.6" />
            <circle cx="72" cy="65" r="5" fill="#FF8EB2" opacity="0.6" />
            {/* Eyes */}
            {expression === 'winner' ? (
              <>
                <path d="M32 52 Q37 46 42 52" stroke="#41364F" strokeWidth="3" strokeLinecap="round" />
                <path d="M58 52 Q63 46 68 52" stroke="#41364F" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="37" cy="53" r="3.5" fill="#41364F" />
                <circle cx="38" cy="52" r="1.2" fill="#FFFFFF" />
                <circle cx="63" cy="53" r="3.5" fill="#41364F" />
                <circle cx="64" cy="52" r="1.2" fill="#FFFFFF" />
              </>
            )}
            {/* Bunny nose & cute tooth */}
            <polygon points="48,61 52,61 50,63" fill="#FF8EB2" />
            <path d="M46 65 Q50 68 54 65" stroke="#41364F" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'bear':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Round Ears */}
            <circle cx="22" cy="28" r="14" fill="#FFE89A" stroke="#FFD447" strokeWidth="3" />
            <circle cx="22" cy="28" r="7" fill="#FF8EB2" opacity="0.8" />
            <circle cx="78" cy="28" r="14" fill="#FFE89A" stroke="#FFD447" strokeWidth="3" />
            <circle cx="78" cy="28" r="7" fill="#FF8EB2" opacity="0.8" />
            {/* Head */}
            <circle cx="50" cy="55" r="38" fill="#FFF7DA" stroke="#FFE89A" strokeWidth="4" />
            {/* Snout */}
            <ellipse cx="50" cy="62" rx="16" ry="12" fill="#FFFFFF" />
            <ellipse cx="50" cy="57" rx="5" ry="3.5" fill="#523F16" />
            <path d="M47 62 Q50 65 53 62" stroke="#523F16" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="34" cy="46" r="3.5" fill="#41364F" />
            <circle cx="66" cy="46" r="3.5" fill="#41364F" />
            {/* Cheeks */}
            <circle cx="26" cy="58" r="6" fill="#FF8EB2" opacity="0.5" />
            <circle cx="74" cy="58" r="6" fill="#FF8EB2" opacity="0.5" />
          </svg>
        );

      case 'duck':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Duck Feathers Tuft */}
            <path d="M45 18 Q50 8 55 18" stroke="#FFE482" strokeWidth="4" strokeLinecap="round" />
            {/* Head */}
            <circle cx="50" cy="52" r="36" fill="#FFF4A3" stroke="#FFE482" strokeWidth="4" />
            {/* Duck Beak */}
            <ellipse cx="50" cy="64" rx="18" ry="10" fill="#FF9F43" />
            {/* Eyes */}
            <circle cx="34" cy="45" r="4" fill="#41364F" />
            <circle cx="36" cy="43" r="1.5" fill="#FFFFFF" />
            <circle cx="66" cy="45" r="4" fill="#41364F" />
            <circle cx="68" cy="43" r="1.5" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="24" cy="55" r="5" fill="#FF8EB2" opacity="0.6" />
            <circle cx="76" cy="55" r="5" fill="#FF8EB2" opacity="0.6" />
          </svg>
        );

      case 'frog':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Frog Big Eyes */}
            <circle cx="28" cy="28" r="14" fill="#B9F0D5" stroke="#6BE0A7" strokeWidth="3" />
            <circle cx="28" cy="28" r="5" fill="#1B4E38" />
            <circle cx="30" cy="26" r="1.5" fill="#FFFFFF" />
            <circle cx="72" cy="28" r="14" fill="#B9F0D5" stroke="#6BE0A7" strokeWidth="3" />
            <circle cx="72" cy="28" r="5" fill="#1B4E38" />
            <circle cx="74" cy="26" r="1.5" fill="#FFFFFF" />
            {/* Head */}
            <ellipse cx="50" cy="58" rx="38" ry="32" fill="#E8FAF1" stroke="#B9F0D5" strokeWidth="4" />
            {/* Big Smile */}
            <path d="M32 64 Q50 76 68 64" stroke="#1B4E38" strokeWidth="3" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="24" cy="60" r="5" fill="#FF8EB2" opacity="0.7" />
            <circle cx="76" cy="60" r="5" fill="#FF8EB2" opacity="0.7" />
          </svg>
        );

      case 'panda':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Black Ears */}
            <circle cx="22" cy="24" r="12" fill="#41364F" />
            <circle cx="78" cy="24" r="12" fill="#41364F" />
            {/* Head */}
            <circle cx="50" cy="55" r="38" fill="#FFFFFF" stroke="#E2D9F3" strokeWidth="4" />
            {/* Cute Hair Bow */}
            <polygon points="40,16 50,22 40,28" fill="#FF8EB2" />
            <polygon points="60,16 50,22 60,28" fill="#FF8EB2" />
            <circle cx="50" cy="22" r="3" fill="#FFB8D2" />
            {/* Dark Eye Patches */}
            <ellipse cx="34" cy="50" rx="9" ry="11" fill="#41364F" transform="rotate(-15 34 50)" />
            <ellipse cx="66" cy="50" rx="9" ry="11" fill="#41364F" transform="rotate(15 66 50)" />
            <circle cx="34" cy="49" r="3" fill="#FFFFFF" />
            <circle cx="66" cy="49" r="3" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <ellipse cx="50" cy="63" rx="4" ry="2.5" fill="#41364F" />
            <path d="M46 68 Q50 71 54 68" stroke="#41364F" strokeWidth="2" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="22" cy="64" r="5" fill="#FF8EB2" opacity="0.5" />
            <circle cx="78" cy="64" r="5" fill="#FF8EB2" opacity="0.5" />
          </svg>
        );

      case 'fox':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Pointy Ears */}
            <polygon points="18,35 28,10 46,28" fill="#FFC3A0" />
            <polygon points="24,30 30,16 40,26" fill="#41364F" />
            <polygon points="82,35 72,10 54,28" fill="#FFC3A0" />
            <polygon points="76,30 70,16 60,26" fill="#41364F" />
            {/* Face */}
            <circle cx="50" cy="54" r="36" fill="#FFC3A0" stroke="#FF9E6C" strokeWidth="3" />
            {/* White Cheeks */}
            <path d="M20 54 Q35 75 50 64 Q65 75 80 54 Z" fill="#FFFFFF" />
            {/* Eyes */}
            <path d="M30 48 Q35 44 40 48" stroke="#41364F" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 48 Q65 44 70 48" stroke="#41364F" strokeWidth="3" strokeLinecap="round" />
            {/* Nose */}
            <polygon points="47,62 53,62 50,65" fill="#41364F" />
            {/* Blush */}
            <circle cx="26" cy="56" r="4" fill="#FF8EB2" opacity="0.6" />
            <circle cx="74" cy="56" r="4" fill="#FF8EB2" opacity="0.6" />
          </svg>
        );

      case 'hamster':
      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Small Round Ears */}
            <circle cx="24" cy="24" r="10" fill="#FFEAA7" stroke="#FDCB6E" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="5" fill="#FF8EB2" />
            <circle cx="76" cy="24" r="10" fill="#FFEAA7" stroke="#FDCB6E" strokeWidth="2.5" />
            <circle cx="76" cy="24" r="5" fill="#FF8EB2" />
            {/* Fat Round Face */}
            <ellipse cx="50" cy="56" rx="40" ry="36" fill="#FFFDF5" stroke="#FFEAA7" strokeWidth="4" />
            {/* Extra Chonky Cheeks */}
            <circle cx="22" cy="62" r="9" fill="#FF8EB2" opacity="0.65" />
            <circle cx="78" cy="62" r="9" fill="#FF8EB2" opacity="0.65" />
            {/* Eyes */}
            <circle cx="36" cy="48" r="4" fill="#41364F" />
            <circle cx="38" cy="46" r="1.5" fill="#FFFFFF" />
            <circle cx="64" cy="48" r="4" fill="#41364F" />
            <circle cx="66" cy="46" r="1.5" fill="#FFFFFF" />
            {/* Tiny Nose & Tooth */}
            <ellipse cx="50" cy="56" rx="3" ry="2" fill="#FF8EB2" />
            <path d="M48 60 Q50 63 52 60" stroke="#41364F" strokeWidth="2" strokeLinecap="round" />
            <rect x="49" y="61" width="2" height="3" fill="#FFFFFF" stroke="#41364F" strokeWidth="0.8" />
          </svg>
        );
    }
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center select-none',
        sizeClasses[size],
        animate && 'hover:scale-105 active:scale-95 transition-transform duration-200',
        className
      )}
    >
      {renderMascotSvg()}
    </div>
  );
};
