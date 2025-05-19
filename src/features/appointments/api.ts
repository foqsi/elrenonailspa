import { supabase } from '@/lib/supabaseClient';
import emailjs from 'emailjs-com';
import { AppointmentFormData } from './types';

export const normalizeTime = (raw: string): string => {
  const [h = '00', m = '00', s = '00'] = raw.split(':');
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
};

export const formatTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export async function fetchBookedSlots(date: string) {
  const { data } = await supabase
    .from('appointments')
    .select('time')
    .eq('date', date);

  const slotCount: Record<string, number> = {};
  data?.forEach(({ time }) => {
    const formatted = normalizeTime(time);
    slotCount[formatted] = (slotCount[formatted] || 0) + 1;
  });

  return slotCount;
}

export async function submitAppointment(form: AppointmentFormData) {
  const selectedTime = normalizeTime(form.time);
  const phoneDigits = form.phone.replace(/\D/g, '');

  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('date', form.date)
    .eq('time', selectedTime);

  if (existing && existing.length >= 5) {
    throw new Error('Slot full');
  }

  const { error, data, status } = await supabase
    .from('appointments')
    .insert([
      {
        first_name: capitalize(form.firstName),
        last_name: capitalize(form.lastName),
        email: form.email || null,
        phone: phoneDigits,
        tech: capitalize(form.tech),
        message: form.message,
        date: form.date,
        time: selectedTime,
      },
    ])
    .select();

  if (error || status >= 400) {
    throw new Error(error?.message || 'Failed to insert');
  }

  const templateParams = {
    firstName: capitalize(form.firstName),
    lastName: capitalize(form.lastName),
    email: form.email || 'N/A',
    phone: phoneDigits,
    tech: capitalize(form.tech),
    message: form.message,
    date: form.date,
    time: formatTime(selectedTime),
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const templateId = isValidEmail ? 'template_ywly2ji' : 'template_uhpnfar';

  await emailjs.send(
    'service_oc3tvfe',
    templateId,
    templateParams,
    'xTe_0sirIJPRptXcd'
  );

  return data;
}
