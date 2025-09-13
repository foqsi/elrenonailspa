import { supabase } from '@/lib/supabaseClient';
import emailjs from 'emailjs-com';
import { AppointmentFormData } from './types';
import { SALON_ID } from '@/lib/constants';

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
    .eq('date', date)
    .eq('salon_id', SALON_ID);

  const slotCount: Record<string, number> = {};
  data?.forEach(({ time }) => {
    const formatted = normalizeTime(time);
    slotCount[formatted] = (slotCount[formatted] || 0) + 1;
  });

  return slotCount;
}

export async function findCustomerByPhone(rawPhone: string) {
  const phoneDigits = rawPhone.replace(/\D/g, '');
  if (phoneDigits.length !== 10) return null;

  const { data, error } = await supabase
    .from('customers')
    .select('id, first_name, last_name, email, phone')
    .eq('salon_id', SALON_ID)
    .eq('phone', phoneDigits)
    .maybeSingle();

  if (error) {
    console.error('findCustomerByPhone error:', error.message);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id as string,
    firstName: data.first_name || '',
    lastName: data.last_name || '',
    email: data.email || '',
    phone: data.phone || phoneDigits,
  };
}

export async function upsertCustomer(payload: {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone: string;
}) {
  const phoneDigits = payload.phone.replace(/\D/g, '');
  const { data: existing, error: findErr } = await supabase
    .from('customers')
    .select('id, first_name, last_name, email')
    .eq('salon_id', SALON_ID)
    .eq('phone', phoneDigits)
    .maybeSingle();

  if (findErr) throw findErr;

  if (existing) {
    const newFirst = payload.firstName?.trim() || existing.first_name;
    const newLast = payload.lastName?.trim() || existing.last_name;
    const newEmail = (payload.email ?? existing.email) || null;

    if (
      newFirst !== existing.first_name ||
      newLast !== existing.last_name ||
      newEmail !== existing.email
    ) {
      const { error: updErr } = await supabase
        .from('customers')
        .update({
          first_name: newFirst,
          last_name: newLast,
          email: newEmail,
        })
        .eq('id', existing.id);
      if (updErr) throw updErr;
    }
    return existing.id as string;
  }

  const { data: created, error: insErr } = await supabase
    .from('customers')
    .insert([
      {
        salon_id: SALON_ID,
        phone: phoneDigits,
        email: payload.email || null,
        first_name: (payload.firstName && payload.firstName.trim()) || 'Guest',
        last_name: (payload.lastName && payload.lastName.trim()) || 'Customer',
      },
    ])
    .select('id')
    .single();

  if (insErr) throw insErr;
  return created!.id as string;
}

export async function submitAppointment(form: AppointmentFormData) {
  const selectedTime = normalizeTime(form.time);
  const phoneDigits = form.phone.replace(/\D/g, '');

  const { data: existing, error: capErr } = await supabase
    .from('appointments')
    .select('id')
    .eq('date', form.date)
    .eq('time', selectedTime)
    .eq('salon_id', SALON_ID);
  if (capErr) throw capErr;
  if (existing && existing.length >= 5) throw new Error('Slot full');

  const customerId = await upsertCustomer({
    firstName: capitalize(form.firstName),
    lastName: capitalize(form.lastName),
    email: form.email?.trim() ? form.email.trim() : null,
    phone: phoneDigits,
  });

  const { error, data, status } = await supabase
    .from('appointments')
    .insert([{
      customer_id: customerId,
      salon_id: SALON_ID,
      date: form.date,
      time: selectedTime,
      tech: capitalize(form.tech),
      message: form.message,
      first_name: capitalize(form.firstName),
      last_name: capitalize(form.lastName),
      email: form.email || null,
      phone: phoneDigits,
    }])
    .select();

  if (error || status >= 400) throw new Error(error?.message || 'Failed to insert');

  // ---- NEW: bump customers.last_visit to the scheduled visit datetime ----
  // Build a local Date from date (YYYY-MM-DD) + time (HH:MM:SS), then to ISO.
  const visitLocal = new Date(`${form.date}T${selectedTime}`);
  const visitISO = visitLocal.toISOString();

  // Only update if it's newer than what's stored (or if null)
  await supabase
    .from('customers')
    .update({ last_visit: visitISO })
    .eq('id', customerId)
    .eq('salon_id', SALON_ID)
    .or(`last_visit.is.null,last_visit.lt.${visitISO}`);

  // -----------------------------------------------------------------------

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

  await emailjs.send('service_oc3tvfe', templateId, templateParams, 'xTe_0sirIJPRptXcd');

  return data;
}
