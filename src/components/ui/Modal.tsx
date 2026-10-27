'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { sound } from '@/lib/audio';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#41364F]/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.pop();
          onClose();
        }
      }}
    >
      <div
        className={cn(
          'relative w-full max-w-lg bg-white rounded-3xl p-6 border-2 border-[#FFD2E2]',
          'shadow-[0_20px_50px_rgba(255,142,178,0.3)] animate-in zoom-in-95 duration-200',
          className
        )}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FFEBF2]">
          {title ? (
            <h2 className="text-xl font-black text-[#41364F] flex items-center gap-2">
              {title}
            </h2>
          ) : (
            <div />
          )}

          {showCloseButton && (
            <button
              onClick={() => {
                sound.pop();
                onClose();
              }}
              aria-label="ปิดหน้าต่าง"
              className="p-1.5 rounded-full hover:bg-[#FFEBF2] text-[#41364F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
