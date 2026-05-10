import React from 'react';
import FadeInSection from '@/components/animations/FadeUpSection';

export default function Hero() {
  return (
    <FadeInSection>
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-rose-600 text-white py-32 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900 opacity-20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6 inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-white font-semibold text-sm">WELCOME TO EL RENO</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Nail Perfection,<br />
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Every Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            Experience luxury nail care at El Reno Nail Spa. Where expert craftsmanship meets relaxation.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
            <a
              href='/appointment'
              className="bg-white text-red-600 font-bold text-lg py-4 px-8 rounded-lg hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book an Appointment
            </a>
            <a
              href='/services'
              className="bg-red-700 hover:bg-red-800 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white/30"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
