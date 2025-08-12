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
import ConfirmModal from '@/components/modals/ConfirmModal';

const knownDomains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'aol.com', 'me.com', 'live.com', 'msn.com', 'mail.com',
  'protonmail.com', 'gmx.com', 'zoho.com', 'yandex.com', 'fastmail.com',
  'tutanota.com', 'hey.com', 'pm.me',
  'comcast.net', 'att.net', 'cox.net', 'verizon.net', 'bellsouth.net',
  'sbcglobal.net', 'shaw.ca', 'rogers.com', 'btinternet.com', 'sky.com',
];

// === Lead-time settings ===
const MIN_LEAD_MINUTES = 120; // 2 hours
function nowPlusLead() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + MIN_LEAD_MINUTES, 0, 0);
  return d;
}

// === Date helpers (compare by day, not by time) ===
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

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
      // Compare using start-of-day to allow selecting "today"
      const selected = new Date(value + 'T00:00:00');
      const minAllowed = startOfDay(new Date()); // today at 00:00
      const maxAllowed = new Date(nextYear, 11, 31); // Dec 31 of next year (local)

      if (startOfDay(selected) < minAllowed) return;       // disallow past days
      if (startOfDay(selected) > startOfDay(maxAllowed)) return; // disallow after max

      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getAvailableTimes = () => {
    if (!form.date) return [];

    const selectedDate = new Date(form.date + 'T00:00:00');
    const isSameDay = startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime();

    const day = selectedDate.getDay();
    const startHour = day === 0 ? 12 : 10; // Sunday 12–17, others 10–18
    const endHour = day === 0 ? 17 : 18;

    const cutoff = nowPlusLead(); // now + 2 hours
    const times: string[] = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      for (const min of [0, 30]) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        const timeStr = `${h}:${m}:00`;

        // Date for this slot on the selected day
        const candidate = new Date(selectedDate);
        candidate.setHours(hour, min, 0, 0);

        // Enforce 4-hour lead time only for today
        if (isSameDay && candidate <= cutoff) continue;

        // Capacity rule
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
    if (!formValid) return;

    // Enforce 4-hour lead time at submit time
    if (form.date && form.time) {
      const [hh, mm] = form.time.split(':').map(Number);
      const slotDate = new Date(form.date + 'T00:00:00');
      slotDate.setHours(hh, mm, 0, 0);

      if (slotDate <= nowPlusLead()) {
        toast.error('Appointments must be booked at least 4 hours in advance.');
        return;
      }
    }

    const emailParts = form.email.toLowerCase().split('@');
    const domain = emailParts[1] || '';

    if (form.email && !knownDomains.includes(domain)) {
      setShowUnknownEmailModal(true);
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
          onCancel={() => setShowUnknownEmailModal(false)}
        />
      )}
    </>
  );
}
