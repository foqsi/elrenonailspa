'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { SALON_ID } from '@/lib/constants';
import Throbber from '../Throbber';

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
  if (v.length !== 10) return d;
  return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
}

export default function CustomerEditor() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState<Partial<Customer>>({});
  const [query, setQuery] = useState('');

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
    fetchCustomers();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = `${r.first_name} ${r.last_name}`.toLowerCase();
      return (
        name.includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        digitsOnly(r.phone).includes(digitsOnly(q))
      );
    });
  }, [rows, query]);

  return (
    <div className="space-y-8">
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

      <div className="max-h-[600px] overflow-y-auto pr-1 space-y-4 border rounded bg-white p-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Throbber />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500">No customers found.</div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white p-3 sm:p-4 border rounded-md shadow-sm grid gap-2 sm:grid-cols-12 items-start"
            >
              <input
                type="text"
                className="border p-2 rounded w-full sm:col-span-2"
                value={c.first_name}
                onChange={(e) =>
                  setRows((prev) => prev.map((r) => (r.id === c.id ? { ...r, first_name: e.target.value } : r)))
                }
              />
              <input
                type="text"
                className="border p-2 rounded w-full sm:col-span-2"
                value={c.last_name}
                onChange={(e) =>
                  setRows((prev) => prev.map((r) => (r.id === c.id ? { ...r, last_name: e.target.value } : r)))
                }
              />
              <input
                type="tel"
                className="border p-2 rounded w-full sm:col-span-2"
                value={formatPhoneForDisplay(c.phone)}
                onChange={(e) =>
                  setRows((prev) => prev.map((r) => (r.id === c.id ? { ...r, phone: e.target.value } : r)))
                }
              />
              <input
                type="email"
                className="border p-2 rounded w-full sm:col-span-3"
                value={c.email ?? ''}
                onChange={(e) =>
                  setRows((prev) => prev.map((r) => (r.id === c.id ? { ...r, email: e.target.value } : r)))
                }
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-1">
                <input
                  type="checkbox"
                  checked={!!c.marketing_opt_in}
                  onChange={(e) =>
                    setRows((prev) => prev.map((r) => (r.id === c.id ? { ...r, marketing_opt_in: e.target.checked } : r)))
                  }
                />
                Opt-in
              </label>
              <textarea
                className="border p-2 rounded w-full sm:col-span-12"
                placeholder="Notes"
                value={c.notes ?? ''}
                onChange={(e) =>
                  setRows((prev) => prev.map((r) => (r.id === c.id ? { ...r, notes: e.target.value } : r)))
                }
              />
              <div className="sm:col-span-12 flex flex-wrap gap-2 justify-end">
                <div className="text-xs text-gray-500 mr-auto">
                  Last visit: {c.last_visit ? new Date(c.last_visit).toLocaleString() : '—'} · Created:{' '}
                  {new Date(c.created_at).toLocaleDateString()}
                </div>
                <button
                  onClick={() =>
                    handleUpdate({
                      ...c,
                      phone: digitsOnly(c.phone),
                      email: c.email?.trim() || null,
                      notes: c.notes?.trim() || null,
                    })
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
