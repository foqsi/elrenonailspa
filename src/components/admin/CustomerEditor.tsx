'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { SALON_ID } from '@/lib/constants';
import Throbber from '../Throbber';
import { formatZoned, formatZonedDate } from '@/lib/formattime';

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  marketing_opt_in: boolean;
  notes: string | null;
  last_visit: string | null;
  created_at: string;
};

function digitsOnly(v: string) {
  return v.replace(/\D/g, '');
}
function formatPhoneForDisplay(d: string) {
  const v = digitsOnly(d);
  if (v.length !== 10) return d || '';
  return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
}

export default function CustomerEditor() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState<Partial<Customer>>({});
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Customer>>({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('id, first_name, last_name, email, phone, marketing_opt_in, notes, last_visit, created_at')
      .eq('salon_id', SALON_ID)
      .order('last_visit', { ascending: false, nullsFirst: false })
      .limit(500);

    if (error) {
      toast.error('Failed to load customers.');
      setRows([]);
    } else {
      setRows((data || []) as Customer[]);
    }
    setLoading(false);
  }

  async function handleAdd() {
    const first = (newRow.first_name || '').trim();
    const last = (newRow.last_name || '').trim();
    const phoneDigits = digitsOnly(newRow.phone || '');
    if (!first || !last || phoneDigits.length !== 10) {
      toast.error('First, last, and a valid 10-digit phone are required.');
      return;
    }

    const payload = {
      salon_id: SALON_ID,
      first_name: first,
      last_name: last,
      email: (newRow.email || '').trim() || null,
      phone: phoneDigits,
      marketing_opt_in: !!newRow.marketing_opt_in,
      notes: (newRow.notes || '') || null,
    };

    const res = await fetch('/api/admin/customers/add', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const t = await res.text();
      console.error(t);
      toast.error('Failed to add customer.');
      return;
    }

    toast.success('Customer added!');
    setNewRow({});
    fetchCustomers();
  }

  async function handleUpdate(row: Customer) {
    const payload = {
      ...row,
      phone: digitsOnly(row.phone),
      email: row.email?.trim() || null,
      notes: row.notes?.trim() || null,
    };

    const res = await fetch('/api/admin/customers/update', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const t = await res.text();
      console.error(t);
      toast.error('Failed to update customer.');
      return;
    }

    toast.success('Customer updated!');
    setEditingId(null);
    setDraft({});
    fetchCustomers();
  }

  async function handleDelete(id: string) {
    const res = await fetch('/api/admin/customers/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const t = await res.text();
      console.error(t);
      toast.error('Failed to delete customer.');
      return;
    }

    toast.success('Customer deleted.');
    if (editingId === id) {
      setEditingId(null);
      setDraft({});
    }
    fetchCustomers();
  }

  const filtered = useMemo(() => {
    const raw = query ?? '';
    const q = raw.trim().toLowerCase();
    if (!q) return rows;
    const qDigits = q.replace(/\D/g, '');
    const hasDigits = qDigits.length > 0;

    return rows.filter((r) => {
      const name = `${r.first_name} ${r.last_name}`.toLowerCase();
      const email = (r.email || '').toLowerCase();
      const nameOrEmailMatch = name.includes(q) || email.includes(q);
      const phoneMatch = hasDigits && r.phone.replace(/\D/g, '').includes(qDigits);
      return nameOrEmailMatch || phoneMatch;
    });
  }, [rows, query]);

  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setDraft({
      ...c,
      phone: formatPhoneForDisplay(c.phone),
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };
  const saveEdit = () => {
    if (!editingId) return;
    const base = rows.find((r) => r.id === editingId);
    if (!base) return;
    const merged: Customer = {
      ...base,
      first_name: (draft.first_name ?? base.first_name) as string,
      last_name: (draft.last_name ?? base.last_name) as string,
      email: (draft.email ?? base.email) as string | null,
      phone: (draft.phone ?? base.phone) as string,
      marketing_opt_in: (draft.marketing_opt_in ?? base.marketing_opt_in) as boolean,
      notes: (draft.notes ?? base.notes) as string | null,
      // keep id/last_visit/created_at from base
    };
    handleUpdate(merged);
  };

  return (
    <div className="space-y-8">
      {/* Add Customer */}
      <div className="bg-gradient-to-br from-white to-red-50 p-8 rounded-2xl shadow-lg border-2 border-red-100">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">➕ Add New Customer</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-6">
          <input
            type="text"
            placeholder="First name"
            className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-3 rounded-lg w-full font-medium transition-colors"
            value={newRow.first_name ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, first_name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Last name"
            className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-3 rounded-lg w-full font-medium transition-colors"
            value={newRow.last_name ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, last_name: e.target.value }))}
          />
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-3 rounded-lg w-full font-medium transition-colors"
            value={newRow.phone ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, phone: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Email (optional)"
            className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-3 rounded-lg w-full font-medium transition-colors"
            value={newRow.email ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, email: e.target.value }))}
          />
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 bg-white rounded-lg p-3 border-2 border-gray-200">
            <input
              type="checkbox"
              className="w-5 h-5 accent-red-600 rounded cursor-pointer"
              checked={!!newRow.marketing_opt_in}
              onChange={(e) => setNewRow((p) => ({ ...p, marketing_opt_in: e.target.checked }))}
            />
            <span>Marketing</span>
          </label>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Add Customer
          </button>
        </div>
        <textarea
          placeholder="Notes (optional)"
          className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-3 rounded-lg w-full font-medium h-24 resize-none transition-colors"
          value={newRow.notes ?? ''}
          onChange={(e) => setNewRow((p) => ({ ...p, notes: e.target.value }))}
        />
      </div>

      {/* List + Search */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">👥 Customer List</h3>
          <input
            type="text"
            placeholder="🔍 Search name, email, or phone"
            className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-3 rounded-lg w-full sm:w-[320px] font-medium transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Cards */}
        <div className="max-h-[700px] overflow-y-auto pr-3 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Throbber />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-lg">No customers found.</div>
          ) : (
            filtered.map((c) => {
              const isEditing = editingId === c.id;
              return (
                <div key={c.id} className={`${isEditing ? 'bg-white border-2 border-red-400' : 'bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100'} rounded-xl p-6 transition-all`}>
                  {/* Row 1: Name + Phone + Email */}
                  <div className="grid gap-4 sm:grid-cols-12 items-start mb-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">First</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-2 rounded-lg w-full font-medium transition-colors"
                          value={(draft.first_name as string) ?? c.first_name}
                          onChange={(e) => setDraft((d) => ({ ...d, first_name: e.target.value }))}
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-white font-semibold text-gray-900">{c.first_name}</div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Last</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-2 rounded-lg w-full font-medium transition-colors"
                          value={(draft.last_name as string) ?? c.last_name}
                          onChange={(e) => setDraft((d) => ({ ...d, last_name: e.target.value }))}
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-white font-semibold text-gray-900">{c.last_name}</div>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-2 rounded-lg w-full font-medium transition-colors"
                          value={(draft.phone as string) ?? formatPhoneForDisplay(c.phone)}
                          onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-white font-semibold text-red-600">{formatPhoneForDisplay(c.phone)}</div>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-2 rounded-lg w-full font-medium transition-colors"
                          value={(draft.email as string) ?? c.email ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-white text-sm text-gray-700">{c.email ?? '—'}</div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Opt-in</label>
                      {isEditing ? (
                        <label className="inline-flex items-center gap-2 p-2 bg-white rounded-lg border-2 border-gray-200 w-full cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                            checked={!!((draft.marketing_opt_in as boolean) ?? c.marketing_opt_in)}
                            onChange={(e) => setDraft((d) => ({ ...d, marketing_opt_in: e.target.checked }))}
                          />
                          <span className="font-semibold text-gray-700">Marketing</span>
                        </label>
                      ) : (
                        <div className={`p-2 rounded-lg font-bold ${c.marketing_opt_in ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {c.marketing_opt_in ? '✓ Yes' : '✗ No'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Notes */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Notes</label>
                    {isEditing ? (
                      <textarea
                        className="border-2 border-gray-200 focus:border-red-500 focus:outline-none p-3 rounded-lg w-full font-medium resize-none h-20 transition-colors"
                        value={(draft.notes as string) ?? c.notes ?? ''}
                        onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                      />
                    ) : (
                      <div className="p-3 rounded-lg bg-white min-h-[60px] text-sm text-gray-700 border border-gray-200">
                        {c.notes || <span className="text-gray-400 italic">—</span>}
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="flex flex-wrap gap-3 items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      📅 Last: {c.last_visit ? formatZoned(c.last_visit) : '—'} | Created: {formatZonedDate(c.created_at)}
                    </div>

                    {!isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(c)}
                          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
