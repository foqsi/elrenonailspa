import Link from 'next/link';
import FadeInUp from '@/components/animations/FadeInUp';

export default function CallToAction() {
  return (
    <FadeInUp delay={0.5}>
      <section className="py-20 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-700 opacity-10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Ready to Treat Yourself?
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your next appointment today and experience the difference. Our expert team is ready to make your nails absolutely stunning!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Link
              href="/appointment"
              className="bg-white text-red-600 font-bold py-4 px-8 rounded-lg hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book an Appointment
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-red-600 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </FadeInUp>
  );
}
