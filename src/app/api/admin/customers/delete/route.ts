import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';
import { NextResponse } from 'next/server';

type DeleteBody = {
  id?: string;
  phone?: string;
};

function digitsOnly(v: unknown): string {
  return String(v ?? '').replace(/\D/g, '');
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown as DeleteBody;

    const id = (body.id ?? '').toString().trim();
    const phone = digitsOnly(body.phone);

    if (!id && !phone) {
      return NextResponse.json({ error: 'Provide id or phone' }, { status: 400 });
    }

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
      targetId = String(data.id);
    }

    const { error: delErr, count } = await supabaseAdmin
      .from('customers')
      .delete({ count: 'exact' })
      .eq('id', targetId)
      .eq('salon_id', SALON_ID);

    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
    if (!count) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    return NextResponse.json({ deleted: count }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Optional: support HTTP DELETE verb too
export const DELETE = POST;
