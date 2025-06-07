export interface AppointmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tech: string;
  message: string;
  date: string;
  time: string;
  salon_id: string;
}

export interface AppointmentFormLayoutProps {
  form: AppointmentFormData;
  phoneError: string;
  submitting: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  getAvailableTimes: () => string[];
  formatTime: (time: string) => string;
}
