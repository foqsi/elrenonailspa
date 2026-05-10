'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import FadeInDown from '@/components/animations/FadeInDown';
import FadeInUp from '@/components/animations/FadeInUp';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <main className="min-h-screen pt-20 px-4 pb-20">
      {/* Hero Section */}
      <FadeInDown>
        <div className="max-w-5xl mx-auto text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
            <span className="text-red-600 font-semibold text-sm">GET IN TOUCH</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">Let&apos;s Connect</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about our services? Want to book a special appointment?
            We&apos;re here to help and can&apos;t wait to pamper you.
          </p>
        </div>
      </FadeInDown>

      <div className="max-w-6xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Form */}
          <FadeInLeft>
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm">We&apos;ve received your message and will respond soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                      placeholder="(405) 555-1234"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400 resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Send Message
                </button>
              </form>
            </div>
          </FadeInLeft>

          {/* Right: Info + Map */}
          <FadeInRight>
            <div className="space-y-8">
              {/* Info Boxes */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border-2 border-red-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📍</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                    <p className="text-gray-700">
                      1605 Investors Ave<br />
                      El Reno, OK 73036
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-8 border-2 border-red-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📞</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Call Ahead</h3>
                    <a href="tel:+1-405-666-5565" className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
                      (405) 666-5565
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-red-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⏰</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Hours</h3>
                    <div className="space-y-2 text-gray-700 font-medium">
                      <p>Mon-Sat: <span className="text-red-600">10am - 7pm</span></p>
                      <p>Sun: <span className="text-red-600">12pm - 6pm</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInRight>
        </div>

        {/* Map Section */}
        <FadeInUp>
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us On The Map</h2>
            <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] border-2 border-gray-200">
              <Map />
            </div>
          </div>
        </FadeInUp>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FadeInLeft>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-red-600 mb-2">500+</div>
              <p className="text-gray-700 font-semibold">Happy Customers</p>
            </div>
          </FadeInLeft>
          <FadeInUp>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-red-600 mb-2">10+</div>
              <p className="text-gray-700 font-semibold">Years Experience</p>
            </div>
          </FadeInUp>
          <FadeInRight>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-red-600 mb-2">5★</div>
              <p className="text-gray-700 font-semibold">Rated Service</p>
            </div>
          </FadeInRight>
        </div>

        {/* CTA Banner */}
        <FadeInUp>
          <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-3">Ready to Treat Yourself?</h3>
                <p className="text-gray-300 text-lg">
                  Book your appointment online or give us a call. We&apos;ll take care of you from the moment you walk in.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
                <a
                  href="/appointment"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-center"
                >
                  Book Appointment
                </a>
                <button
                  onClick={() => window.location.href = 'tel:+1-405-666-5565'}
                  className="inline-block border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-lg transition-colors text-center"
                >
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </main>
  );
}
