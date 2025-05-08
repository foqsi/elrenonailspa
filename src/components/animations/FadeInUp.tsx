'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FadeInUp({
  children,
  delay = 0,
  margin = '-10% 0px',
}: {
  children: React.ReactNode;
  delay?: number;
  margin?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
