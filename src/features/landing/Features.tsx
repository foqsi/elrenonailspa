import ServiceCard from '@/components/ServiceCard';
import manicure from '@/assets/images/mani.png';
import nailart from '@/assets/images/nailart.png';
import pedicure from '@/assets/images/pedi.png';
import kids from '@/assets/images/kids.png';
import waxing from '@/assets/images/wax.png';
import addl from '@/assets/images/addl.png';
import Link from 'next/link';

export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              direction="up"
              delay={0.2}
            />
          </Link>
          <Link href="/services">
            <ServiceCard
              title="Nail Art"
              description="Custom designs that express your unique style."
              image={nailart}
              direction="right"
              delay={0.4}
            />
          </Link>
          <Link href="/services">
            <ServiceCard
              title=""
              description="Fun and gentle manicures and pedicures tailored for younger our guests."
              image={kids}
              direction="left"
              delay={0.6}
            />
          </Link>
          <Link href="/services">
            <ServiceCard
              title=""
              description="Facial and limb waxing services for smooth, clean skin with a gentle touch."
              image={waxing}
              direction="up"
              delay={0.10}
            />
          </Link>
          <Link href="/services">
            <ServiceCard
              title=""
              description="Paraffin dips, callus treatments, and more for a complete spa experience."
              image={addl}
              direction="right"
              delay={0.10}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
