import React from 'react';
import FadeInSection from '@/components/animations/FadeUpSection';

export default function Hero() {
  return (
    <FadeInSection>
      <section className="bg-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Welcome to El Reno Nail Spa</h1>
          <p className="mt-4 text-lg md:text-xl">&quot;Nail Perfection, Every Time&quot; 💅</p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-white text-red-600 font-semibold py-4 px-8 rounded shadow hover:bg-gray-200 transition">
              <a href='/appointment'>
                Book an Appointment →
              </a>
            </button>
            <button className="bg-red-500 text-white font-semibold py-3 px-6 rounded shadow hover:bg-red-400 transition">
              <a href='/services'>
                Explore Services
              </a>
            </button>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
