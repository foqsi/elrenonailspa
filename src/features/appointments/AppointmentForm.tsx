'use client';

import { useState, useEffect } from 'react';
import {
  fetchBookedSlots,
  normalizeTime,
  formatTime,
  capitalize,
  submitAppointment,
} from './api';
import { AppointmentFormData } from './types';
import AppointmentFormLayout from './AppointmentFormLayout';
import { toast } from 'react-hot-toast';

export default function AppointmentForm() {
  const [form, setForm] = useState<AppointmentFormData>({
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
    if (!form.date) return;
    fetchBookedSlots(form.date).then(setBookedSlots);
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
        const timeStr = `${h}:${m}:00`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      setSubmitting(false);
      return;
    }

    const selectedTime = normalizeTime(form.time);

    const submission: AppointmentFormData = {
      ...form,
      firstName: capitalize(form.firstName),
      lastName: capitalize(form.lastName),
      tech: capitalize(form.tech),
      phone: phoneDigits,
      time: selectedTime,
    };

    try {
      await submitAppointment(submission);
      toast.success('Appointment request sent!');
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
    } catch (err) {
      if (err instanceof Error && err.message === 'Slot full') {
        toast.error('Sorry, this time slot is fully booked. Please choose another.');
      } else {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
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
