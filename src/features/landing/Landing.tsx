'use client';

import FadeInSection from '@/components/animations/FadeUpSection';
import { Element } from 'react-scroll';
import { Hero, Features, Testimonials, About, CallToAction, Display } from './';

export default function Landing() {
  return (
    <Element name="home">
      <FadeInSection><Hero /></FadeInSection>
      <FadeInSection delay={0.3}><Display /></FadeInSection>
      <FadeInSection delay={0.3}><About /></FadeInSection>
      <FadeInSection delay={0.2}><Features /></FadeInSection>
      <FadeInSection delay={0.4}><Testimonials /></FadeInSection>
      <FadeInSection delay={0.5}><CallToAction /></FadeInSection>
    </Element>
  );
}
