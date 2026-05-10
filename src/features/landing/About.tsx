import StoreFront from "@/components/StoreFront";
import FadeInSection from '@/components/animations/FadeUpSection';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';

export default function About() {
  return (
    <FadeInSection delay={0.3}>
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
              <span className="text-red-600 font-semibold text-sm">ABOUT US</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600">
              Family-owned, community-focused, and dedicated to excellence
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <FadeInLeft>
              <div className="md:w-1/2">
                <div className="space-y-5 text-gray-700 leading-relaxed">
                  <p>
                    <span className="font-bold text-red-600">Welcome to El Reno Nail Spa</span> — more than just a salon, we are a family-owned and family-operated business dedicated to serving our community with care and excellence.
                  </p>
                  <p>
                    As a new addition to the town, we take pride in offering a <span className="font-semibold">welcoming and relaxing environment</span> where every client feels valued and pampered.
                  </p>
                  <p>
                    Our mission is simple: to provide <span className="font-semibold">outstanding nail and spa services</span> that combine quality, creativity, and comfort. Whether you&apos;re here for a quick touch-up, a luxurious spa treatment, or stunning nail art, our team is committed to exceeding your expectations.
                  </p>
                  <p>
                    We believe in building <span className="font-semibold">lasting relationships</span> with our clients by delivering personalized care and attention to detail.
                  </p>
                  <p className="text-red-600 font-semibold pt-4">
                    Thank you for welcoming us to El Reno. We look forward to serving you! 💅
                  </p>
                </div>
              </div>
            </FadeInLeft>

            {/* Image */}
            <FadeInRight>
              <div className="md:w-full">
                <StoreFront className="w-full rounded-2xl shadow-xl" />
              </div>
            </FadeInRight>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
