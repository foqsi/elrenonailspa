// app/api/admin/customers/add/route.ts
import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';
import { NextResponse } from 'next/server';

function splitName(name: string | undefined) {
  const n = (name ?? '').trim();
  if (!n) return { first: '', last: '' };
  const parts = n.split(/\s+/);
  const first = parts.shift() ?? '';
  const last = parts.join(' ') || '';
  return { first, last };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { first: parsedFirst, last: parsedLast } = splitName(body.name);
    const first_name = (body.first_name ?? parsedFirst ?? '').trim();
    const last_name = (body.last_name ?? parsedLast ?? '').trim();
    const email = (body.email ?? '').trim() || null;

    const phoneDigits = String(body.phone ?? '').replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return NextResponse.json({ error: 'Phone must be 10 digits' }, { status: 400 });
    }
    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'first_name and last_name are required' }, { status: 400 });
    }

    const payload = {
      salon_id: SALON_ID,
      first_name: first_name,
      last_name: last_name,
      email,
      phone: phoneDigits,
      marketing_opt_in: !!body.marketing_opt_in,
      notes: body.notes?.trim?.() || null,
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
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid request' }, { status: 400 });
  }
}
