'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { SALON_ID } from '@/lib/constants';

interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  date: string;
  time: string;
  phone: string;
  tech: string;
  message: string | null;
}

export default function AppointmentsViewer() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('id, first_name, last_name, date, time, phone, tech, message, salon_id')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      toast.error('Failed to fetch appointments.');
      setAppointments([]);
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const upcoming = (data ?? []).filter(
      (appt) => appt.salon_id === SALON_ID && appt.date >= today
    );

    setAppointments(upcoming);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const res = await fetch('/api/appointments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      toast.error('Failed to delete appointment.');
    } else {
      toast.success('Appointment deleted!');
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    }

    setDeleting(false);
    setConfirmId(null);
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const groupedByDate = appointments.reduce<Record<string, Appointment[]>>((acc, appt) => {
    if (!acc[appt.date]) acc[appt.date] = [];
    acc[appt.date].push(appt);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 italic">No appointments found.</p>
      ) : (
        Object.entries(groupedByDate).map(([date, appts]) => (
          <div key={date}>
            <h3 className="text-xl font-bold mb-6 text-gray-900 pb-3 border-b-2 border-red-200">
              📅 {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>

            {/* Table for larger screens */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border-2 border-red-100 shadow-lg">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white sticky top-0">
                  <tr>
                    <th className="w-[80px] p-4 text-center font-bold">Actions</th>
                    <th className="w-[100px] p-4 text-left font-bold">Time</th>
                    <th className="w-[150px] p-4 text-left font-bold">Name</th>
                    <th className="w-[140px] p-4 text-left font-bold">Phone</th>
                    <th className="w-[100px] p-4 text-left font-bold">Tech</th>
                    <th className="w-auto p-4 text-left font-bold">Message</th>

                  </tr>
                </thead>
                <tbody>
                  {appts.map((appt, idx) => (
                    <tr key={appt.id} className={`border-t border-gray-100 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50`}>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setConfirmId(appt.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="p-4 whitespace-nowrap font-semibold text-gray-900">{appt.time}</td>
                      <td className="p-4 font-medium text-gray-900">
                        {appt.first_name} {appt.last_name}
                      </td>
                      <td className="p-4">
                        <a
                          href={`tel:${appt.phone}`}
                          className="text-red-600 font-medium hover:text-red-700 underline"
                        >
                          {appt.phone}
                        </a>
                      </td>
                      <td className="p-4 text-gray-700">{appt.tech}</td>
                      <td className="p-4 text-sm text-gray-700 break-words whitespace-pre-wrap max-w-md">
                        {appt.message ? (
                          <>
                            {expandedRows.has(appt.id)
                              ? appt.message
                              : appt.message.length > 80
                                ? `${appt.message.slice(0, 80)}...`
                                : appt.message}
                            {appt.message.length > 80 && (
                              <button
                                onClick={() => toggleRowExpansion(appt.id)}
                                className="ml-2 text-red-600 underline text-xs font-semibold hover:text-red-700"
                              >
                                {expandedRows.has(appt.id) ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="italic text-gray-400">No message</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card layout for mobile */}
            <div className="sm:hidden space-y-4">
              {appts.map((appt) => (
                <div key={appt.id} className="border-2 border-red-100 rounded-xl p-5 bg-gradient-to-br from-white to-red-50 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-2xl font-bold text-red-600">{appt.time}</div>
                    <button
                      onClick={() => setConfirmId(appt.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-3">
                    {appt.first_name} {appt.last_name}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-700">
                      <span className="font-bold text-gray-900">📞 Phone:</span>{' '}
                      <a href={`tel:${appt.phone}`} className="text-red-600 font-semibold underline">
                        {appt.phone}
                      </a>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-bold text-gray-900">💅 Tech:</span> {appt.tech}
                    </div>
                    <div className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                      <span className="font-bold text-gray-900">💬 Message:</span>{' '}
                      {appt.message ? (
                        <>
                          {expandedRows.has(appt.id)
                            ? appt.message
                            : appt.message.length > 80
                              ? `${appt.message.slice(0, 80)}...`
                              : appt.message}
                          {appt.message.length > 80 && (
                            <button
                              onClick={() => toggleRowExpansion(appt.id)}
                              className="ml-1 text-red-600 underline text-xs font-semibold hover:text-red-700"
                            >
                              {expandedRows.has(appt.id) ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="italic text-gray-400">No message</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border-2 border-red-100">
            <div className="text-4xl mb-4">⚠️</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">Delete Appointment?</h4>
            <p className="text-gray-600 mb-8">This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deleting}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${deleting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
                  }`}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
