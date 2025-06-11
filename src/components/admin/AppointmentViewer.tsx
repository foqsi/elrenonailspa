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
      next.has(id) ? next.delete(id) : next.add(id);
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
            <h3 className="text-lg font-bold mb-4 text-gray-800">{date}</h3>

            {/* Table for larger screens */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 min-w-[600px]">
                <thead className="bg-red-100 text-left">
                  <tr>
                    <th className="w-[80px] p-2 border text-center">Actions</th>
                    <th className="w-[100px] p-2 border">Time</th>
                    <th className="w-[150px] p-2 border">Name</th>
                    <th className="w-[140px] p-2 border">Phone</th>
                    <th className="w-[100px] p-2 border">Tech</th>
                    <th className="w-auto p-2 border">Message</th>

                  </tr>
                </thead>
                <tbody>
                  {appts.map((appt) => (
                    <tr key={appt.id} className="hover:bg-red-50">
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => setConfirmId(appt.id)}
                          className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="p-2 border whitespace-nowrap">{appt.time}</td>
                      <td className="p-2 border">
                        {appt.first_name} {appt.last_name}
                      </td>
                      <td className="p-2 border">
                        <a
                          href={`tel:${appt.phone}`}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {appt.phone}
                        </a>
                      </td>
                      <td className="p-2 border">{appt.tech}</td>
                      <td className="p-2 border text-sm text-gray-700 break-words whitespace-pre-wrap max-w-md">
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
                                className="ml-2 text-blue-600 underline text-xs"
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
                <div key={appt.id} className="border rounded p-4 bg-white shadow-sm">
                  <div className="flex justify-between mb-2">
                    <div className="text-lg text-red-600">{appt.time}</div>
                    <button
                      onClick={() => setConfirmId(appt.id)}
                      className="text-red-600 text-xs font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-base font-semibold text-gray-800 mb-1">
                    {appt.first_name} {appt.last_name}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Phone:</span>{' '}
                    <a href={`tel:${appt.phone}`} className="text-blue-600 underline">
                      {appt.phone}
                    </a>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Tech:</span> {appt.tech}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    <span className="font-medium">Message:</span>{' '}
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
                            className="ml-1 text-blue-600 underline text-xs"
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
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Delete Appointment?</h4>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deleting}
                className={`px-4 py-2 rounded text-white ${deleting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
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
