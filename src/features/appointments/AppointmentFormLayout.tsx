'use client';

import FadeInDown from '@/components/animations/FadeInDown';
import FadeInUp from '@/components/animations/FadeInUp';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';
import SlideDown from '@/components/animations/SlideDown';
import FadeUpSection from '@/components/animations/FadeUpSection';

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
    emailError: string;
    phoneError: string;
    submitting: boolean;
    formValid: boolean;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    getAvailableTimes: () => string[];
    formatTime: (time: string) => string;
    showDetails: boolean;
    lookupLoading: boolean;
    onLookup: () => void;
    lookupResultNote: string | null;
    customerFound: boolean;
}

export default function AppointmentFormLayout({
    form,
    emailError,
    phoneError,
    submitting,
    formValid,
    handleChange,
    handleSubmit,
    getAvailableTimes,
    formatTime,
    showDetails,
    lookupLoading,
    onLookup,
    lookupResultNote,
    customerFound,
}: AppointmentFormLayoutProps) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    const minDate = today.toISOString().split('T')[0];
    const maxDate = `${nextYear}-12-31`;

    const digitsOk = form.phone.replace(/\D/g, '').length === 10;
    const disabled = lookupLoading || !digitsOk;

    const introText = !showDetails
        ? 'Enter your phone number to continue.'
        : (lookupResultNote ?? 'Thank you for choosing us! Please fill in your details below.');

    return (
        <main className="min-h-screen pt-20 px-4 pb-20">
            {/* Hero Section */}
            <FadeInDown>
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
                        <span className="text-red-600 font-semibold text-sm">BOOK YOUR VISIT</span>
                    </div>
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">Schedule Your Appointment</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Choose your preferred date and time, and we'll take care of the rest.
                        It's quick, easy, and takes just a few minutes.
                    </p>
                </div>
            </FadeInDown>

            <div className="max-w-5xl mx-auto">
                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <FadeInLeft>
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">✨</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Booking</h3>
                            <p className="text-gray-700 text-sm">Book in minutes with our simple online form</p>
                        </div>
                    </FadeInLeft>
                    <FadeInUp>
                        <div className="bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">📅</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Availability</h3>
                            <p className="text-gray-700 text-sm">See available times instantly and pick what works</p>
                        </div>
                    </FadeInUp>
                    <FadeInRight>
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">💳</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Card Needed</h3>
                            <p className="text-gray-700 text-sm">Reserve your spot with just your phone number</p>
                        </div>
                    </FadeInRight>
                </div>

                {/* Main Form */}
                <FadeUpSection>
                    <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-100 max-w-2xl mx-auto">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <p className="text-center text-gray-700 font-medium mb-6" aria-live="polite">
                                    {introText}
                                </p>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            disabled={customerFound}
                                            className={`flex-1 border-2 ${phoneError ? 'border-red-500' : 'border-gray-300'} p-4 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400`}
                                            maxLength={14}
                                            required
                                            placeholder="(405) 555-6655"
                                        />
                                        {!showDetails && (
                                            <button
                                                type="button"
                                                onClick={onLookup}
                                                disabled={disabled}
                                                className={`px-6 py-4 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 ${disabled
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-1'
                                                    }`}
                                            >
                                                {lookupLoading ? 'Checking…' : 'Continue'}
                                            </button>
                                        )}
                                    </div>
                                    {phoneError && <p className="text-sm text-red-500 mt-2">{phoneError}</p>}
                                </div>
                            </div>

                            <SlideDown open={showDetails} className="mt-2" durationMs={1250}>
                                <div className="space-y-6 pt-6 border-t-2 border-gray-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={form.firstName}
                                                onChange={handleChange}
                                                disabled={customerFound}
                                                className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                                                placeholder="Jane"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={form.lastName}
                                                onChange={handleChange}
                                                disabled={customerFound}
                                                className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Email <span className="text-gray-500 text-sm font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            disabled={customerFound}
                                            className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                                            placeholder="jane@example.com"
                                        />
                                        {emailError && <p className="text-sm text-red-500 mt-2">{emailError}</p>}
                                    </div>

                                    {customerFound && (
                                        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-700 text-sm">
                                            <p className="font-semibold mb-1">Welcome back!</p>
                                            <p>We prefilled your information. If anything needs updating, let our staff know.</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Preferred Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={form.date}
                                                onChange={handleChange}
                                                min={minDate}
                                                max={maxDate}
                                                className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Preferred Time <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="time"
                                                value={form.time}
                                                onChange={handleChange}
                                                disabled={!form.date}
                                                className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
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

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Preferred Technician <span className="text-gray-500 text-sm font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="tech"
                                            value={form.tech}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                                            placeholder="Enter technician name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Message <span className="text-gray-500 text-sm font-normal">(optional)</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            className="w-full border-2 border-gray-300 p-4 rounded-lg h-28 resize-none focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-400"
                                            placeholder="Let us know what you'd like done during your visit..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!formValid}
                                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${formValid
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg transform hover:-translate-y-1'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {submitting ? 'Sending…' : 'Confirm Appointment'}
                                    </button>
                                </div>
                            </SlideDown>
                        </form>
                    </div>
                </FadeUpSection>

                {/* Bottom CTA */}
                <FadeInUp>
                    <div className="mt-20 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 rounded-2xl p-12 shadow-xl text-center text-white">
                        <h3 className="text-3xl font-bold mb-4">Questions Before Booking?</h3>
                        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                            Feel free to give us a call or visit our contact page to chat with our team directly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="inline-block bg-white text-red-600 font-bold py-4 px-8 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Contact Us
                            </a>
                            <button
                                onClick={() => window.location.href = 'tel:+1-405-555-0123'}
                                className="inline-block border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-lg transition-colors"
                            >
                                Call (405) 555-0123
                            </button>
                        </div>
                    </div>
                </FadeInUp>
            </div>
        </main>
    );
}
