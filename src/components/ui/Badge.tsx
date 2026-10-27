import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'pink' | 'lavender' | 'mint' | 'lemon' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'pink',
  size = 'md',
  ...props
}) => {
  const variants = {
    pink: 'bg-[#FFE4EE] text-[#D84C7A] border border-[#FFB8D2]',
    lavender: 'bg-[#EFEAFF] text-[#6948C9] border border-[#CDBEFF]',
    mint: 'bg-[#E3F8ED] text-[#1B6D46] border border-[#B9F0D5]',
    lemon: 'bg-[#FFF7D4] text-[#8C6D13] border border-[#FFE89A]',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-full',
    md: 'px-3 py-1 text-xs font-bold rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
