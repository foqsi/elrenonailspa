import AppointmentForm from '@/features/appointments/AppointmentForm';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Book an Appointment | El Reno Nail Spa',
  description: 'Schedule your next visit with El Reno Nail Spa — quick and easy online booking.',
};

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen px-4">
      <Toaster position="bottom-center" />
      <AppointmentForm />
    </main>
  );
}
