'use client';

import FadeInLeft from './animations/FadeInLeft';
import FadeInRight from './animations/FadeInRight';
import FadeInUp from './animations/FadeInUp';
import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  direction?: 'left' | 'right' | 'up';
  delay?: number;
}

export default function ServiceCard({
  title,
  description,
  image,
  direction = 'up',
  delay = 0,
}: ServiceCardProps) {
  const Wrapper =
    direction === 'left'
      ? FadeInLeft
      : direction === 'right'
      ? FadeInRight
      : FadeInUp;

  return (
    <Wrapper delay={delay}>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <Image  
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full h-60 object-cover"
          unoptimized
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-red-600 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Wrapper>
  );
}
