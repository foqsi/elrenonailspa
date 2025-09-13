import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';
import { NextResponse } from 'next/server';

function digitsOnly(v: string) {
  return String(v || '').replace(/\D/g, '');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = (body?.id || '').trim();
    const phone = digitsOnly(body?.phone || '');

    if (!id && !phone) {
      return NextResponse.json({ error: 'Provide id or phone' }, { status: 400 });
    }

    // If phone provided, look up the row id first (scoped to salon)
    let targetId = id;
    if (!targetId && phone) {
      const { data, error } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('salon_id', SALON_ID)
        .eq('phone', phone)
        .maybeSingle();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (!data) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      targetId = data.id as string;
    }

    const { error: delErr, count } = await supabaseAdmin
      .from('customers')
      .delete({ count: 'exact' })
      .eq('id', targetId)
      .eq('salon_id', SALON_ID);

    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
    if (!count) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    // If your FK is ON DELETE SET NULL on appointments.customer_id, past appointments remain.
    return NextResponse.json({ deleted: count }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid request' }, { status: 400 });
  }
}

// Optional: support the HTTP DELETE verb too (same body shape)
export const DELETE = POST;
