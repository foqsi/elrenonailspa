// app/page.tsx

import { Metadata } from 'next';
import Landing from '@/sections/landing/Landing';

export const metadata: Metadata = {
  title: 'El Reno Nail Spa',
  description: 'Nail Perfection, Every Time! Walk-ins & Appointments are welcome!',
  openGraph: {
    title: 'El Reno Nail Spa',
    description: 'Nail Perfection, Every Time! Walk-ins & Appointments are welcome!',
    url: 'https://elrenonailspa.com',
    images: [
      {
        url: 'https://elrenonailspa.com/images/preview.png',
        width: 1200,
        height: 630,
        alt: 'El Reno Nail Spa Preview',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <Landing />
  );
}
