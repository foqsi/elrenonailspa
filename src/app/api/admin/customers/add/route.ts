import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';
import { NextResponse } from 'next/server';

type AddBody = {
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string;
  marketing_opt_in?: boolean;
  notes?: string | null;
};

function splitName(name: string | undefined) {
  const n = (name ?? '').trim();
  if (!n) return { first: '', last: '' };
  const parts = n.split(/\s+/);
  const first = parts.shift() ?? '';
  const last = parts.join(' ') || '';
  return { first, last };
}

function digitsOnly(v: unknown): string {
  return String(v ?? '').replace(/\D/g, '');
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown as AddBody;

    const { first: parsedFirst, last: parsedLast } = splitName(body.name);
    const first_name = (body.first_name ?? parsedFirst ?? '').trim();
    const last_name = (body.last_name ?? parsedLast ?? '').trim();
    const email = (body.email ?? '').toString().trim() || null;

    const phoneDigits = digitsOnly(body.phone);
    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'first_name and last_name are required' }, { status: 400 });
    }
    if (phoneDigits.length !== 10) {
      return NextResponse.json({ error: 'Phone must be 10 digits' }, { status: 400 });
    }

    const payload = {
      salon_id: SALON_ID,
      first_name,
      last_name,
      email,
      phone: phoneDigits,
      marketing_opt_in: Boolean(body.marketing_opt_in),
      notes: (body.notes ?? '')?.toString().trim() || null,
    };

    const { data, error } = await supabaseAdmin
      .from('customers')
      .upsert([payload], { onConflict: 'salon_id,phone' })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
