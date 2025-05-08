import GallerySection from '@/sections/gallery/Gallery';

export const metadata = {
  title: 'Gallery | El Reno Nail Spa',
  description: 'Explore our beautiful nail art and spa experiences at El Reno Nail Spa.',
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-8 px-4">
      <GallerySection />
    </main>
  );
}
