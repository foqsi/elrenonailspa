// app/api/customers/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// US-only normalization to +1XXXXXXXXXX
function toE164(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (/^\+\d{10,15}$/.test(s)) return s;
  const d = s.replace(/\D/g, '');
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  return null;
}

/**
 * GET /api/customers/search?q=...&salon_id=...
 * Response: [{ id, first_name, last_name, phone_e164 }]
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const salonId = searchParams.get('salon_id');

    if (q.length < 2) return NextResponse.json([], { status: 200 });

    const ilike = `%${q}%`;
    const digits = q.replace(/\D/g, '');

    let query = supabase
      .from('customers')
      .select('id, first_name, last_name, phone, updated_at')
      .or(
        [
          `first_name.ilike.${ilike}`,
          `last_name.ilike.${ilike}`,
          `phone.ilike.${ilike}`,
          digits.length >= 3 ? `phone.ilike.%${digits}%` : null,
        ]
          .filter(Boolean)
          .join(',')
      )
      .order('updated_at', { ascending: false })
      .limit(10);

    if (salonId) {
      query = query.eq('salon_id', salonId);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const shaped = (data || []).map((r) => ({
      id: r.id,
      first_name: r.first_name,
      last_name: r.last_name,
      phone_e164: toE164(r.phone),
    }));

    return NextResponse.json(shaped, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
