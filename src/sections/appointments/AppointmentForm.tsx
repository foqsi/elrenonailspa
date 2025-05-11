'use client';

import { useState } from 'react';
import emailjs from 'emailjs-com';
import FadeInDown from '@/components/animations/FadeInDown';

export default function AppointmentForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tech: '',
    message: '',
    date: '',
    time: '',
  });

  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      let formatted = digits;
      if (digits.length > 3 && digits.length <= 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length > 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }

      setForm((prev) => ({ ...prev, phone: formatted }));
      setPhoneError(digits.length === 10 ? '' : 'Please enter a valid 10-digit phone number.');
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


  const getAvailableTimes = () => {
    if (!form.date) return [];

    const selectedDate = new Date(form.date + 'T00:00:00');
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();

    const day = selectedDate.getDay(); // 0 = Sunday
    const startHour = day === 0 ? 12 : 10;
    const endHour = day === 0 ? 17 : 18;

    const times: string[] = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      for (const min of [0, 30]) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        const timeStr = `${h}:${m}`;

        if (isToday) {
          const now = new Date();
          const candidate = new Date();
          candidate.setHours(hour, min, 0, 0);
          if (candidate <= now) continue;
        }

        times.push(timeStr);
      }
    }

    return times;
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      setSubmitting(false);
      return;
    } else {
      setPhoneError('');
    }

    const templateParams = {
      firstName: capitalize(form.firstName),
      lastName: capitalize(form.lastName),
      email: form.email || 'N/A',
      phone: phoneDigits,
      tech: capitalize(form.tech),
      message: form.message,
      date: form.date,
      time: formatTime(form.time),
    };

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (isValidEmail) {
      // Send confirmation to customer
      await emailjs.send(
        'service_oc3tvfe',
        'template_ywly2ji',
        templateParams,
        'xTe_0sirIJPRptXcd'
      );
    } else {
      // Send internal notification to salon only if no valid email
      await emailjs.send(
        'service_oc3tvfe',
        'template_uhpnfar',
        templateParams,
        'xTe_0sirIJPRptXcd'
      );
    }


    alert('Appointment request sent!');
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tech: '',
      message: '',
      date: '',
      time: '',
    });


    setSubmitting(false);
  };


  return (
    <main className="min-h-screen pt-24 px-4 bg-gray-50">
      <FadeInDown>
        <h1 className="text-4xl font-bold text-center text-red-600 mb-16">Book an Appointment</h1>
      </FadeInDown>

      <div className="max-w-xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <p className="text-sm text-gray-500 mb-2 text-center">
            Fields marked with <span className="text-red-500">*</span> are required.
          </p>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border ${phoneError ? 'border-red-500' : 'border-gray-300'
                } p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300`}
              maxLength={14}
              required
              placeholder="(405) 555-6655"
            />
            {phoneError && (
              <p className="text-sm text-red-500 mt-1">{phoneError}</p>
            )}

          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                disabled={!form.date}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                required
              >
                <option value="">Select a time</option>
                {getAvailableTimes().map((time) => (
                  <option key={time} value={time}>
                    {formatTime(time)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech & Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Tech <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              type="text"
              name="tech"
              value={form.tech}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Let us know what you'd like done during your visit."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Submit Appointment'}
          </button>
        </form>
      </div>
    </main>
  );
}
