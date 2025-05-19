import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-16 bg-red-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to treat yourself?</h2>
      <p className="mb-6">Book your next appointment today and experience the difference!</p>
      <Link href="/appointment" className="bg-white text-red-600 px-6 py-3 rounded font-semibold hover:bg-gray-100">
        Book Now
      </Link>
    </section>
  );
}
