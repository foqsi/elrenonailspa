import ServiceCard from '@/components/ServiceCard';
import manicure from '@/assets/images/mani.png';
import nailart from '@/assets/images/nailart.png';
import pedicure from '@/assets/images/pedi.png';
import addl from '@/assets/images/addl.png';
import Link from 'next/link';
import FadeInSection from '@/components/animations/FadeUpSection';

export default function Services() {
  return (
    <FadeInSection delay={0.2}>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-semibold text-sm">OUR SPECIALTIES</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Premium Nail Services
            </h2>
            <p className="text-lg text-gray-600">
              From classic manicures to stunning nail art, we offer something for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Link href="/services">
              <ServiceCard
                title="Manicures"
                description="Classic, gel, and spa manicures for clean, polished hands."
                image={manicure}
                direction="left"
              />
            </Link>
            <Link href="/services">
              <ServiceCard
                title="Pedicures"
                description="Relaxing treatments for refreshed, healthy feet."
                image={pedicure}
                direction="right"
                delay={0.2}
              />
            </Link>
            <Link href="/services">
              <ServiceCard
                title="Nail Art"
                description="Custom designs that express your unique style."
                image={nailart}
                direction="left"
                delay={0.4}
              />
            </Link>
            <Link href="/services">
              <ServiceCard
                title="Additional Services"
                description="Waxing, Parrafin, Callus treatments, & Children's services!"
                image={addl}
                direction="right"
                delay={0.10}
              />
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
