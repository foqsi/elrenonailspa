import Landing from '@/features/landing/Landing';

export const metadata = {
  title: 'El Reno Nail Spa',
  description: 'Relax and refresh at El Reno’s top-rated nail spa. Walk-ins welcome!',
  openGraph: {
    title: 'El Reno Nail Spa',
    description: 'Relax and refresh at El Reno’s top-rated nail spa. Walk-ins welcome!',
    url: 'https://elrenonailspa.com',
    siteName: 'El Reno Nail Spa',
    images: [
      {
        url: 'https://elrenonailspa.com/preview.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <Landing />
  );
}
