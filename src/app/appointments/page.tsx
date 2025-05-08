import AppointmentForm from '@/sections/appointments/AppointmentForm';

export const metadata = {
  title: 'Book an Appointment | El Reno Nail Spa',
  description: 'Schedule your next visit with El Reno Nail Spa — quick and easy online booking.',
};

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <AppointmentForm />
    </main>
  );
}
