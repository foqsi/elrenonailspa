'use client';

import FadeInDown from "@/components/animations/FadeInDown";

export default function ContactForm() {
  return (
    <div className="max-w-2xl mx-auto">
      <FadeInDown>
        <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">Contact Us</h1>
      </FadeInDown>
      <p className="text-center text-gray-700 mb-10">
        We’d love to hear from you! Fill out the form below and we’ll get back to you.
      </p>
      <form className="space-y-4">
        <input type="text" placeholder="Name" className="w-full border p-3 rounded" required />
        <input type="email" placeholder="Email" className="w-full border p-3 rounded" required />
        <textarea placeholder="Message" className="w-full border p-3 rounded h-32" required />
        <button type="submit" className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700">
          Send Message
        </button>
      </form>
    </div>
  );
}
