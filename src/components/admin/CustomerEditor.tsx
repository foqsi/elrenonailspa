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
      <div className="bg-white p-4 sm:p-6 rounded shadow-md">
        <h3 className="text-lg font-bold mb-3">Add Customer</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            type="text"
            placeholder="First name"
            className="border p-2 rounded w-full"
            value={newRow.first_name ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, first_name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Last name"
            className="border p-2 rounded w-full"
            value={newRow.last_name ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, last_name: e.target.value }))}
          />
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            className="border p-2 rounded w-full"
            value={newRow.phone ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, phone: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Email (optional)"
            className="border p-2 rounded w-full"
            value={newRow.email ?? ''}
            onChange={(e) => setNewRow((p) => ({ ...p, email: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!newRow.marketing_opt_in}
              onChange={(e) => setNewRow((p) => ({ ...p, marketing_opt_in: e.target.checked }))}
            />
            Marketing opt-in
          </label>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 w-full sm:w-auto"
          >
            Add Customer
          </button>
        </div>
        <textarea
          placeholder="Notes (optional)"
          className="mt-3 border p-2 rounded w-full"
          value={newRow.notes ?? ''}
          onChange={(e) => setNewRow((p) => ({ ...p, notes: e.target.value }))}
        />
      </div>

      {/* List + Search */}
      <div className="bg-white p-4 sm:p-6 rounded shadow-md">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold">Customers</h3>
          <input
            type="text"
            placeholder="Search name, email, or phone"
            className="border p-2 rounded w-full sm:w-[320px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="max-h-[600px] overflow-y-auto pr-1 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Throbber />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500">No customers found.</div>
        ) : (
          filtered.map((c) => {
            const isEditing = editingId === c.id;
            const cardClasses = isEditing
              ? 'bg-white border rounded shadow-sm'
              : 'bg-gray-50 border border-gray-200 rounded shadow-sm opacity-90';
            return (
              <div key={c.id} className={`${cardClasses} p-3 sm:p-4 grid gap-3`}>
                {/* Row 1: Name + Phone + Email */}
                <div className="grid gap-2 sm:grid-cols-12 items-start">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">First name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={(draft.first_name as string) ?? c.first_name}
                        onChange={(e) => setDraft((d) => ({ ...d, first_name: e.target.value }))}
                      />
                    ) : (
                      <div className="p-2 rounded bg-gray-100">{c.first_name}</div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Last name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={(draft.last_name as string) ?? c.last_name}
                        onChange={(e) => setDraft((d) => ({ ...d, last_name: e.target.value }))}
                      />
                    ) : (
                      <div className="p-2 rounded bg-gray-100">{c.last_name}</div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="border p-2 rounded w-full"
                        value={(draft.phone as string) ?? formatPhoneForDisplay(c.phone)}
                        onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                      />
                    ) : (
                      <div className="p-2 rounded bg-gray-100">{formatPhoneForDisplay(c.phone)}</div>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="border p-2 rounded w-full"
                        value={(draft.email as string) ?? c.email ?? ''}
                        onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      />
                    ) : (
                      <div className="p-2 rounded bg-gray-100">{c.email ?? '—'}</div>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">Opt-in</label>
                    {isEditing ? (
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!((draft.marketing_opt_in as boolean) ?? c.marketing_opt_in)}
                          onChange={(e) => setDraft((d) => ({ ...d, marketing_opt_in: e.target.checked }))}
                        />
                        <span className="text-sm text-gray-700">Marketing</span>
                      </label>
                    ) : (
                      <div className="p-2 rounded bg-gray-100">{c.marketing_opt_in ? 'Yes' : 'No'}</div>
                    )}
                  </div>
                </div>

                {/* Row 2: Notes */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  {isEditing ? (
                    <textarea
                      className="border p-2 rounded w-full"
                      value={(draft.notes as string) ?? c.notes ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                    />
                  ) : (
                    <div className="p-2 rounded bg-gray-100 min-h-[44px]">
                      {c.notes || <span className="text-gray-400">—</span>}
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="flex flex-wrap gap-2 items-center justify-end">
                  <div className="text-xs text-gray-500 mr-auto">
                    Last visit: {c.last_visit ? formatZoned(c.last_visit) : '—'} · Created: {formatZonedDate(c.created_at)}
                  </div>

                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
