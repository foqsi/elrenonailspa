// app/page.tsx

import { Metadata } from 'next';
import Landing from '@/sections/landing/Landing';

export const metadata: Metadata = {
  title: {
    default: 'El Reno Nail Spa',
    template: '%s | El Reno Nail Spa',
  },
  description: 'Nail Perfection, Every Time! Walk-ins & Appointments are welcome!',
  keywords: ['nail spa', 'El Reno', 'manicure', 'pedicure', 'nail art'],
  openGraph: {
    title: 'El Reno Nail Spa',
    description: 'Nail Perfection, Every Time! Walk-ins & Appointments are welcome!',
    url: 'https://elrenonailspa.com',
    siteName: 'El Reno Nail Spa',
    images: [
      {
        url: 'https://elrenonailspa.com/images/preview.png',
        width: 1200,
        height: 630,
        alt: 'El Reno Nail Spa Preview',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Reno Nail Spa',
    description: 'Nail Perfection, Every Time!',
    images: ['https://elrenonailspa.com/images/preview.png'],
  },
  metadataBase: new URL('https://elrenonailspa.com'),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function HomePage() {
  return (
    <Landing />
  );
}
