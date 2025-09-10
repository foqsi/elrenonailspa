'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export default function Video() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3;
    }
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="w-full py-12 bg-gradient-to-br from-red-700 via-red-500 to-gray-800">
      <div className="container mx-auto px-2 text-center">
        {/* <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white tracking-tight">
          Best Pedicures
        </h2>
        <p className="text-lg text-red-100 mb-10 max-w-lg mx-auto">
          Treat your feet to the ultimate pampering experience.
        </p> */}

        <div className="relative max-w-[400px] mx-auto transition-transform duration-300 hover:scale-[1.02]">
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[80vh] rounded-xl shadow-2xl object-contain opacity-0 transition-opacity duration-500"
            src="/videos/ad-vid.mp4"
            poster="/images/ad-vid.png"
            onClick={handlePlayPause}
            onLoadedData={(e) =>
              (e.currentTarget.style.opacity = '1')
            }
          />

          {/* Overlay Play Button */}
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm transition hover:bg-black/50"
            >
              <div className="bg-white/80 rounded-full p-5 shadow-lg hover:scale-110 transition-transform">
                <Play size={50} className="text-red-700" />
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
