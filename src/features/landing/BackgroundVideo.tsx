import React from 'react';

export default function Video() {
  return (
    <section className="bg-black">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/ad-vid.mp4" // place your video in /public/videos
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Experience the Best in Beauty
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-6">
          Let our experts give you the look you deserve — book an appointment today.
        </p>
        <a
          href="/appointment"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Book Now
        </a>
      </div>
    </section>
  );
}
