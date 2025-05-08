'use client';

import Image from 'next/image';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';

export default function DisplaySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto space-y-12 px-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 items-center">
          <FadeInLeft delay={0.2}>
            <Image
              src="/images/display/2.png"
              alt="Manicure"
              width={600}
              height={400}
              className="w-full object-cover rounded"
              unoptimized
            />
          </FadeInLeft>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 items-center">
          <FadeInRight delay={0.2}>
            <Image
              src="/images/display/3.png"
              alt="Detailed Nail Art"
              width={600}
              height={400}
              className="w-full object-cover rounded"
              unoptimized
            />
          </FadeInRight>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 items-center">
          <FadeInLeft delay={0.1}>
            <Image
              src="/images/display/4.png"
              alt="Excellent Pedicures"
              width={600}
              height={400}
              className="w-full object-cover rounded"
              unoptimized
            />
          </FadeInLeft>
        </div>
      </div>
    </section>
  );
}
