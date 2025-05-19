'use client';

import { useEffect, useState } from 'react';
import { fetchGallery } from './api';
import { GalleryItem } from './types';
import FadeIn from '@/components/animations/FadeIn';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';
import FadeInDown from '@/components/animations/FadeInDown';
import Throbber from '@/components/Throbber';

export default function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Throbber size={48} />
      </div>
    );
  }

  return (
    <section className="pt-20 bg-white">
      <div className="container mx-auto px-4">
        <FadeInDown>
          <h1 className="text-4xl font-bold text-center text-red-600 mb-16">
            Gallery
          </h1>
        </FadeInDown>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((item, index) => {
            let Wrapper;
            if (index % 3 === 0) Wrapper = FadeInLeft;
            else if (index % 3 === 2) Wrapper = FadeInRight;
            else Wrapper = FadeIn;

            return (
              <Wrapper key={item.id} delay={index * 0.1}>
                <div
                  className="rounded-lg shadow-md overflow-hidden cursor-pointer bg-white"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={item.image_url}
                    alt={item.caption ?? 'Gallery image'}
                    title="Work by El Reno Nail Spa"
                    className="w-full max-h-[500px] object-contain bg-gray-100"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {item.caption && (
                    <div className="p-4 text-gray-700 text-center text-sm">
                      {item.caption}
                    </div>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10 max-w-2xl mx-auto">
          <em>
            All photos shown are real work completed by{' '}
            <strong>El Reno Nail Spa</strong>. These images are protected by
            copyright and must not be used, copied, or displayed anywhere else
            without permission.
          </em>
        </p>
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center px-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={images[activeIndex].image_url}
              alt={images[activeIndex].caption ?? ''}
              className="w-full max-h-[80vh] object-contain rounded"
              onContextMenu={(e) => e.preventDefault()}
            />
            {images[activeIndex].caption && (
              <div className="text-white text-center mt-4 text-sm">
                {images[activeIndex].caption}
              </div>
            )}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button
                onClick={prev}
                className="text-white text-3xl font-bold hover:scale-125 transition"
              >
                &#8592;
              </button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button
                onClick={next}
                className="text-white text-3xl font-bold hover:scale-125 transition"
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
