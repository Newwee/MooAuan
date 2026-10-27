import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'cream' | 'pink' | 'lavender' | 'mint' | 'lemon';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'white',
  interactive = false,
  ...props
}) => {
  const variants = {
    white: 'bg-white/90 border-[#FFE3ED]',
    cream: 'bg-[#FFF7F4]/90 border-[#FFD2E2]',
    pink: 'bg-[#FFF0F5]/90 border-[#FFB8D2]',
    lavender: 'bg-[#F7F4FF]/90 border-[#CDBEFF]',
    mint: 'bg-[#F0FBF6]/90 border-[#B9F0D5]',
    lemon: 'bg-[#FFFDF0]/90 border-[#FFE89A]',
  };

  return (
    <div
      className={cn(
        'rounded-3xl border-2 p-5 backdrop-blur-md',
        'shadow-[0_10px_25px_-5px_rgba(255,184,210,0.25)] transition-all duration-200',
        interactive &&
          'hover:shadow-[0_15px_30px_-5px_rgba(255,142,178,0.35)] hover:-translate-y-1 cursor-pointer',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
