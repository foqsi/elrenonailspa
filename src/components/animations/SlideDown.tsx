'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React from 'react';

type Props = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  durationMs?: number;
};

export default function SlideDown({
  open,
  children,
  className,
  durationMs = 350,
}: Props) {
  const prefersReduced = useReducedMotion();
  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: durationMs / 1000, ease: [0.22, 1, 0.36, 1] };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="slide-down"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={transition}
          style={{ overflow: 'hidden' }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
