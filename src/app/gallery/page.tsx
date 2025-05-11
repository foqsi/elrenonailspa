import GallerySection from '@/sections/gallery/Gallery';

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
  },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-8 px-4">
      <GallerySection />
    </main>
  );
}
