'use client';

import { useEffect, useState } from 'react';
import { fetchGallery } from './api';
import { GalleryItem } from './types';
import FadeIn from '@/components/animations/FadeIn';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';
import FadeInDown from '@/components/animations/FadeInDown';
import FadeInUp from '@/components/animations/FadeInUp';

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
    <section className="pt-20 bg-white pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <FadeInDown>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-semibold text-sm">OUR WORK</span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Gallery
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Explore our portfolio of beautiful nail designs and transformations.
              Each design is custom-crafted to reflect your unique style and personality.
            </p>
          </div>
        </FadeInDown>

        {/* Gallery */}
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-16">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl shadow-md overflow-hidden bg-white"
                >
                  <div className="w-full h-[120px] sm:h-[200px] md:h-[300px] bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-16">
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
                      className="rounded-2xl shadow-md overflow-hidden cursor-pointer bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                      onClick={() => openModal(index)}
                    >
                      <div className="relative overflow-hidden h-[120px] sm:h-[200px] md:h-[300px]">
                        <img
                          src={item.image_url}
                          alt={item.caption ?? 'Gallery image'}
                          title="Work by El Reno Nail Spa"
                          className="w-full h-full object-cover bg-gray-100 group-hover:scale-110 transition-transform duration-300"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            👁️
                          </div>
                        </div>
                      </div>
                      {item.caption && (
                        <div className="p-1 sm:p-3 text-gray-700 text-center text-xs sm:text-sm line-clamp-2 bg-gray-50 group-hover:bg-red-50 transition-colors">
                          {item.caption}
                        </div>
                      )}
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm text-gray-500">
            <em>
              All photos shown are real work completed by{' '}
              <strong>El Reno Nail Spa</strong>. These images are protected by
              copyright and must not be used, copied, or displayed anywhere else
              without permission.
            </em>
          </p>
        </div>

        {/* Bottom CTA */}
        <FadeInUp>
          <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 rounded-2xl p-12 shadow-xl text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Inspired? Let's Create Your Look</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Bring these designs to life or create something uniquely yours.
              Book your appointment today and let our experts transform your nails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/appointment"
                className="inline-block bg-white text-red-600 font-bold py-4 px-8 rounded-lg hover:bg-red-50 transition-colors"
              >
                Book Appointment
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-lg transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Enhanced Modal */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center px-2 sm:px-4 py-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-2xl sm:max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 sm:top-4 sm:right-4 text-white text-4xl sm:text-5xl font-bold hover:scale-110 transition-transform z-10"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Image Container */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={images[activeIndex].image_url}
                alt={images[activeIndex].caption ?? ''}
                className="w-full max-h-[70vh] sm:max-h-[80vh] object-contain bg-gray-100"
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Caption */}
              {images[activeIndex].caption && (
                <div className="bg-gray-50 p-4 sm:p-6">
                  <p className="text-gray-800 text-center font-semibold">
                    {images[activeIndex].caption}
                  </p>
                </div>
              )}

              {/* Counter */}
              <div className="bg-red-600 text-white text-center py-3 font-semibold">
                {activeIndex + 1} / {images.length}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prev}
              className="absolute top-1/3 left-2 sm:left-4 transform -translate-y-1/2 text-white text-3xl sm:text-4xl font-bold hover:scale-125 transition-transform bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 sm:p-4"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute top-1/3 right-2 sm:right-4 transform -translate-y-1/2 text-white text-3xl sm:text-4xl font-bold hover:scale-125 transition-transform bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 sm:p-4"
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
