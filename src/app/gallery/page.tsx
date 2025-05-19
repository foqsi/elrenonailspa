import GallerySection from '@/features/gallery/Gallery';

export const metadata = {
  title: 'Gallery | El Reno Nail Spa',
  description: 'Explore our beautiful nail art and spa experiences at El Reno Nail Spa.',
  authors: [{ name: 'El Reno Nail Spa', url: 'https://elrenonailspa.com' }],
  robots: 'index, follow',
  generator: 'Next.js',
  applicationName: 'El Reno Nail Spa',
  keywords: ['nail spa', 'nail art', 'El Reno', 'manicure', 'pedicure', 'gallery'],
  openGraph: {
    title: 'Gallery | El Reno Nail Spa',
    description: 'View real nail art done by El Reno Nail Spa.',
    url: 'https://elrenonailspa.com/gallery',
    siteName: 'El Reno Nail Spa',
    type: 'website',
    images: [
      {
        url: 'https://elrenonailspa.com/images/preview.png',
        width: 1200,
        height: 630,
        alt: 'Gallery preview of nail art from El Reno Nail Spa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery | El Reno Nail Spa',
    description: 'Explore our beautiful nail art and spa experiences at El Reno Nail Spa.',
    images: ['https://elrenonailspa.com/images/preview.png'],
  },
};


export default function GalleryPage() {
  return (
    <main className="min-h-screen px-4">
      <GallerySection />
    </main>
  );
}
