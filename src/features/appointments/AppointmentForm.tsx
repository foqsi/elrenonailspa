'use client';

import { useEffect, useState } from 'react';
import {
  fetchBookedSlots,
  normalizeTime,
  formatTime,
  capitalize,
  submitAppointment,
  findCustomerByPhone,
} from './api';
import { AppointmentFormData } from './types';
import AppointmentFormLayout from './AppointmentFormLayout';
import { SALON_ID } from '@/lib/constants';
import { toast } from 'react-hot-toast';

const MIN_LEAD_MINUTES = 120;
function nowPlusLead() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + MIN_LEAD_MINUTES, 0, 0);
  return d;
}
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
  const [showDetails, setShowDetails] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResultNote, setLookupResultNote] = useState<string | null>(null);

  const [customerFound, setCustomerFound] = useState(false);

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
      setForm(prev => ({ ...prev, phone: formatted }));
      setPhoneError(digits.length === 10 ? '' : 'Please enter a valid 10-digit phone number.');
      setLookupResultNote(null);
      return;
    }

    if (name === 'email') {
      setForm(prev => ({ ...prev, email: value }));
      const parts = value.split('@');
      if (value && (parts.length !== 2 || !parts[1].includes('.'))) setEmailError('Please enter a valid email.');
      else setEmailError('');
      return;
    }

    if (name === 'date') {
      const selected = new Date(value + 'T00:00:00');
      const minAllowed = startOfDay(new Date());
      const maxAllowed = new Date(new Date().getFullYear() + 1, 11, 31);
      if (startOfDay(selected) < minAllowed) return;
      if (startOfDay(selected) > startOfDay(maxAllowed)) return;
      setForm(prev => ({ ...prev, date: value }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLookup = async () => {
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLookupLoading(true);
    const found = await findCustomerByPhone(form.phone);

    if (found) {
      setForm(prev => ({
        ...prev,
        firstName: found.firstName || '',
        lastName: found.lastName || '',
        email: found.email || '',
      }));
      setCustomerFound(true); // <-- lock phone when found
      setLookupResultNote(
        `Welcome back${found.firstName ? `, ${capitalize(found.firstName)}` : ''}! We prefilled your details.`
      );
    } else {
      setForm(prev => ({ ...prev, firstName: '', lastName: '', email: '' }));
      setCustomerFound(false); // <-- keep phone editable for sign-up
      setLookupResultNote('Thank you for choosing us! Please complete your details below.');
    }

    setShowDetails(true);
    setLookupLoading(false);
  };

  const getAvailableTimes = () => {
    if (!form.date) return [];
    const selectedDate = new Date(form.date + 'T00:00:00');
    const isSameDay = startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime();

    const day = selectedDate.getDay();
    const startHour = day === 0 ? 12 : 10; // Sun 12–17, else 10–18
    const endHour = day === 0 ? 17 : 18;

    const cutoff = nowPlusLead();
    const times: string[] = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      for (const min of [0, 30]) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        const timeStr = `${h}:${m}:00`;

        const candidate = new Date(selectedDate);
        candidate.setHours(hour, min, 0, 0);

        if (isSameDay && candidate <= cutoff) continue;
        if (!bookedSlots[timeStr] || bookedSlots[timeStr] < 5) {
          times.push(timeStr);
        }
      }
    }
    return times;
  };

  const formValid =
    showDetails &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.phone.replace(/\D/g, '').length === 10 &&
    form.date &&
    form.time &&
    !emailError &&
    !phoneError &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;

    // 2-hour lead guard at submit time too
    const [hh, mm] = form.time.split(':').map(Number);
    const slotDate = new Date(form.date + 'T00:00:00');
    slotDate.setHours(hh, mm, 0, 0);
    if (slotDate <= nowPlusLead()) {
      toast.error('Appointments must be booked at least 2 hours in advance.');
      return;
    }

    try {
      setSubmitting(true);
      await submitAppointment({
        ...form,
        firstName: capitalize(form.firstName),
        lastName: capitalize(form.lastName),
        tech: capitalize(form.tech),
        time: normalizeTime(form.time),
      });
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
      setShowDetails(false);
      setLookupResultNote(null);
      setEmailError('');
      setPhoneError('');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppointmentFormLayout
        form={form}
        emailError={emailError}
        phoneError={phoneError}
        submitting={submitting}
        formValid={!!formValid}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        getAvailableTimes={getAvailableTimes}
        formatTime={formatTime}
        showDetails={showDetails}
        lookupLoading={lookupLoading}
        onLookup={handleLookup}
        lookupResultNote={lookupResultNote}
        customerFound={customerFound}
      />
    </>
  );
}
