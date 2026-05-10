'use client';

import { useEffect, useState } from 'react';
import { fetchGallery } from './api';
import { GalleryItem } from './types';
import FadeIn from '@/components/animations/FadeIn';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';
import FadeInDown from '@/components/animations/FadeInDown';

export default function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchGallery().then((data) => {
      setImages(data);
      setLoading(false);
    });
  }, []);

  const openModal = (index: number) => setActiveIndex(index);
  const closeModal = () => setActiveIndex(null);
  const next = () => setActiveIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  const prev = () =>
    setActiveIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );

  const NoAnimation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <>{children}</>
  );

  NoAnimation.displayName = 'NoAnimation';

  type WrapperProps = {
    children: React.ReactNode;
    delay?: number;
  };

  return (
    <section className="pt-20 bg-white">
      <div className="container mx-auto px-4">
        <FadeInDown>
          <h1 className="text-4xl font-bold text-center text-red-600 mb-16">
            Gallery
          </h1>
        </FadeInDown>

        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-md overflow-hidden bg-white"
                >
                  <div className="w-full h-[120px] sm:h-[200px] md:h-[300px] bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {images.map((item, index) => {
              const shouldAnimate = !isMobile && index < 6;

              const Wrapper: React.ComponentType<WrapperProps> = shouldAnimate
                ? index % 3 === 0
                  ? FadeInLeft
                  : index % 3 === 2
                    ? FadeInRight
                    : FadeIn
                : NoAnimation;

              return (
                <Wrapper key={item.id} delay={index * 0.1}>
                  <div
                    className="rounded-lg shadow-md overflow-hidden cursor-pointer bg-white hover:shadow-lg transition-shadow"
                    onClick={() => openModal(index)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.caption ?? 'Gallery image'}
                      title="Work by El Reno Nail Spa"
                      className="w-full h-[120px] sm:h-[200px] md:h-[300px] object-cover bg-gray-100"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    {item.caption && (
                      <div className="p-1 sm:p-3 text-gray-700 text-center text-xs sm:text-sm line-clamp-2">
                        {item.caption}
                      </div>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-10 max-w-2xl mx-auto">
          <em>
            All photos shown are real work completed by{' '}
            <strong>El Reno Nail Spa</strong>. These images are protected by
            copyright and must not be used, copied, or displayed anywhere else
            without permission.
          </em>
        </p>
      </div>

      {/* Modal */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center px-2 sm:px-4 py-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-2xl sm:max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 sm:top-4 sm:right-4 text-white text-3xl sm:text-4xl font-bold hover:scale-110 transition"
              aria-label="Close modal"
            >
              &times;
            </button>
            <img
              src={images[activeIndex].image_url}
              alt={images[activeIndex].caption ?? ''}
              className="w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded"
              onContextMenu={(e) => e.preventDefault()}
            />
            {images[activeIndex].caption && (
              <div className="text-white text-center mt-3 sm:mt-4 text-xs sm:text-sm px-2">
                {images[activeIndex].caption}
              </div>
            )}
            {/* Navigation buttons */}
            <button
              onClick={prev}
              className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 text-white text-2xl sm:text-4xl font-bold hover:scale-125 transition bg-black bg-opacity-50 rounded-full p-2 sm:p-3"
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 text-white text-2xl sm:text-4xl font-bold hover:scale-125 transition bg-black bg-opacity-50 rounded-full p-2 sm:p-3"
              aria-label="Next image"
            >
              &#8594;
            </button>
            {/* Image counter */}
            <div className="text-white text-center mt-3 sm:mt-4 text-xs sm:text-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
