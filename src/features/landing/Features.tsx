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
          <h2 className="text-3xl font-bold text-center text-red-600 mb-12">
            Our Services
          </h2>
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
