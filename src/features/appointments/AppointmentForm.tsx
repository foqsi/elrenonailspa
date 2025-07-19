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
import { SALON_ID } from '@/lib/constants';
import ConfirmModal from '@/components/modals/ConfirmModal'; // You’ll need to create this

const knownDomains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'aol.com', 'me.com', 'live.com', 'msn.com', 'mail.com',
  'protonmail.com', 'gmx.com', 'zoho.com', 'yandex.com', 'fastmail.com',
  'tutanota.com', 'hey.com', 'pm.me',
  'comcast.net', 'att.net', 'cox.net', 'verizon.net', 'bellsouth.net',
  'sbcglobal.net', 'shaw.ca', 'rogers.com', 'btinternet.com', 'sky.com',
];

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
    salon_id: SALON_ID,
  });

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Record<string, number>>({});
  const [showUnknownEmailModal, setShowUnknownEmailModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const nextYear = currentYear + 1;

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
    } else if (name === 'email') {
      setForm((prev) => ({ ...prev, email: value }));

      const emailParts = value.split('@');
      if (emailParts.length !== 2 || !emailParts[1].includes('.')) {
        setEmailError('Please enter a valid email.');
      } else {
        setEmailError('');
      }
    } else if (name === 'date') {
      const selected = new Date(value);
      const maxAllowed = new Date(`${nextYear}-12-31`);
      const today = new Date();
      if (selected < today || selected > maxAllowed) return;

      setForm((prev) => ({ ...prev, [name]: value }));
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

  const formValid =
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.phone.replace(/\D/g, '').length === 10 &&
    form.date !== '' &&
    form.time !== '' &&
    (form.email.trim() === '' || emailError === '') &&
    phoneError === '' &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Skip if invalid
    if (!formValid) return;

    // Check if email domain is in the trusted list
    const emailParts = form.email.toLowerCase().split('@');
    const domain = emailParts[1] || '';

    if (form.email && !knownDomains.includes(domain)) {
      setShowUnknownEmailModal(true);
      setPendingSubmission(true);
      return;
    }

    await actuallySubmitForm();
  };

  const actuallySubmitForm = async () => {
    setSubmitting(true);
    const phoneDigits = form.phone.replace(/\D/g, '');
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
        salon_id: SALON_ID,
      });
      setEmailError('');
      setPhoneError('');
    } catch (err) {
      if (err instanceof Error && err.message === 'Slot full') {
        toast.error('Sorry, this time slot is fully booked. Please choose another.');
      } else {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setSubmitting(false);
      setShowUnknownEmailModal(false);
      setPendingSubmission(false);
    }
  };

  return (
    <>
      <AppointmentFormLayout
        form={form}
        emailError={emailError}
        phoneError={phoneError}
        submitting={submitting}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        getAvailableTimes={getAvailableTimes}
        formatTime={formatTime}
        formValid={formValid}
      />

      {showUnknownEmailModal && (
        <ConfirmModal
          title="Unrecognized Email Domain"
          message={`The email you entered uses "${form.email.split('@')[1]}" which is not in our list of known providers. Are you sure it's correct?`}
          onConfirm={actuallySubmitForm}
          onCancel={() => {
            setShowUnknownEmailModal(false);
            setPendingSubmission(false);
          }}
        />
      )}
    </>
  );
}
