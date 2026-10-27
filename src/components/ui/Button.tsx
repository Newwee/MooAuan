'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/audio';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'pink' | 'lavender' | 'mint' | 'lemon' | 'cream' | 'white' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  playSound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'pink',
  size = 'md',
  isLoading = false,
  disabled = false,
  playSound = true,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    if (playSound) sound.tap();
    onClick?.(e);
  };

  const variants = {
    pink: 'bg-[#FF8EB2] text-[#41364F] hover:bg-[#FF7AA4] active:translate-y-1 shadow-[0_4px_0_#D96E90]',
    lavender: 'bg-[#CDBEFF] text-[#34264F] hover:bg-[#BFAAFE] active:translate-y-1 shadow-[0_4px_0_#9D88E0]',
    mint: 'bg-[#B9F0D5] text-[#1B4E38] hover:bg-[#A3EAC4] active:translate-y-1 shadow-[0_4px_0_#75C79E]',
    lemon: 'bg-[#FFE89A] text-[#523F16] hover:bg-[#FDE07D] active:translate-y-1 shadow-[0_4px_0_#D8B84F]',
    cream: 'bg-[#FFF7F4] text-[#41364F] hover:bg-[#FFEAE2] active:translate-y-1 border-2 border-[#FFD0DE] shadow-[0_4px_0_#FFB8D2]',
    white: 'bg-white text-[#41364F] hover:bg-[#FFF7F4] active:translate-y-1 shadow-[0_4px_0_#E0D5CC] border border-[#F0E4DC]',
    ghost: 'bg-transparent text-[#41364F] hover:bg-white/50 active:scale-95 shadow-none',
    danger: 'bg-[#FF7D7D] text-white hover:bg-[#FF6666] active:translate-y-1 shadow-[0_4px_0_#C94A4A]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-2xl min-h-[38px]',
    md: 'px-5 py-2.5 text-sm font-bold rounded-2xl min-h-[46px]',
    lg: 'px-7 py-3.5 text-base font-extrabold rounded-3xl min-h-[52px]',
    xl: 'px-9 py-4.5 text-lg font-black rounded-3xl min-h-[60px]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 select-none cursor-pointer transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF8EB2]/40',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:shadow-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>กำลังโหลด...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
