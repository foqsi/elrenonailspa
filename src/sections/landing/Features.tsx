import ServiceCard from '@/components/ServiceCard';
import manicure from '@/assets/images/mani.png';
import nailart from '@/assets/images/nailart.png';
import pedicure from '@/assets/images/pedi.png';

export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            title="Manicures"
            description="Classic, gel, and spa manicures for clean, polished hands."
            image={manicure}
            direction="left"
          />
          <ServiceCard
            title="Pedicures"
            description="Relaxing treatments for refreshed, healthy feet."
            image={pedicure}
            direction="up"
            delay={0.2}
          />
          <ServiceCard
            title="Nail Art"
            description="Custom designs that express your unique style."
            image={nailart}
            direction="right"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
