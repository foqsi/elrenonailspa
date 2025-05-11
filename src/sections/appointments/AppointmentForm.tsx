'use client';

import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { supabase } from '@/lib/supabaseClient';
import AppointmentFormLayout from '@/components/AppointmentFormLayout';

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
  const [bookedSlots, setBookedSlots] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchBookings = async () => {
      if (!form.date) return;
      const { data } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', form.date);

      const slotCount: Record<string, number> = {};
      data?.forEach(({ time }) => {
        slotCount[time] = (slotCount[time] || 0) + 1;
      });

      setBookedSlots(slotCount);
    };

    fetchBookings();
  }, [form.date]);

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

    const day = selectedDate.getDay();
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

        if (!bookedSlots[timeStr] || bookedSlots[timeStr] < 5) {
          times.push(timeStr);
        }
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

    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', form.date)
      .eq('time', form.time);

    if (existing && existing.length >= 5) {
      alert('Sorry, this time slot is fully booked. Please choose another.');
      setSubmitting(false);
      return;
    }

    await supabase.from('appointments').insert([
      {
        first_name: capitalize(form.firstName),
        last_name: capitalize(form.lastName),
        email: form.email || null,
        phone: phoneDigits,
        tech: capitalize(form.tech),
        message: form.message,
        date: form.date,
        time: form.time,
      },
    ]);

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
      await emailjs.send(
        'service_oc3tvfe',
        'template_ywly2ji',
        templateParams,
        'xTe_0sirIJPRptXcd'
      );
    } else {
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
    <AppointmentFormLayout
      form={form}
      phoneError={phoneError}
      submitting={submitting}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      getAvailableTimes={getAvailableTimes}
      formatTime={formatTime}
    />
  );
}
