"use client";

import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeIn({ children, className, delay, direction = 'up' }: FadeInProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        delay,
        inView ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0',
        !inView && directionClasses[direction],
        className
      )}
    >
      {children}
    </div>
  );
}
