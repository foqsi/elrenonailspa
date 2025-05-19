'use client';

import FadeInDown from '@/components/animations/FadeInDown';

interface AppointmentFormLayoutProps {
    form: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        tech: string;
        message: string;
        date: string;
        time: string;
    };
    phoneError: string;
    submitting: boolean;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    getAvailableTimes: () => string[];
    formatTime: (time: string) => string;
}

export default function AppointmentFormLayout({
    form,
    phoneError,
    submitting,
    handleChange,
    handleSubmit,
    getAvailableTimes,
    formatTime,
}: AppointmentFormLayoutProps) {
    return (
        <main className="min-h-screen pt-20 px-4 bg-gray-50">
            <FadeInDown>
                <h1 className="text-4xl font-bold text-center text-red-600 mb-16">Book an Appointment</h1>
            </FadeInDown>

            <div className="max-w-xl mx-auto bg-white p-8 shadow-lg rounded-lg">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <p className="text-sm text-gray-500 mb-2 text-center">
                        Fields marked with <span className="text-red-500">*</span> are required.
                    </p>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className={`w-full border ${phoneError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300`}
                            maxLength={14}
                            required
                            placeholder="(405) 555-6655"
                        />
                        {phoneError && (
                            <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Time <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                disabled={!form.date}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                                required
                            >
                                <option value="">Select a time</option>
                                {getAvailableTimes().map((time) => (
                                    <option key={time} value={time}>
                                        {formatTime(time)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tech & Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Tech <span className="text-gray-400 text-sm">(optional)</span>
                        </label>
                        <input
                            type="text"
                            name="tech"
                            value={form.tech}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                            placeholder="Let us know what you'd like done during your visit."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
                    >
                        {submitting ? 'Sending...' : 'Submit Appointment'}
                    </button>
                </form>
            </div>
        </main>
    );
}
