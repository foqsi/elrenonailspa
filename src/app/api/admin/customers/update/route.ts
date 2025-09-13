import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';
import { NextResponse } from 'next/server';

type UpdateBody = {
  id: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  email?: string | null;
  notes?: string | null;
  marketing_opt_in?: boolean;
  marketingOptIn?: boolean;
  phone?: string;
  phoneDigits?: string;
  phone_number?: string;
};

function digitsOnly(v: unknown): string {
  return String(v ?? '').replace(/\D/g, '');
}

function getPgCode(err: unknown): string | undefined {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code?: string }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown as UpdateBody;

    const id = String(body.id ?? '').trim();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const first_name = (body.first_name ?? body.firstName ?? '').toString().trim();
    const last_name = (body.last_name ?? body.lastName ?? '').toString().trim();
    const emailRaw = (body.email ?? '').toString().trim();
    const notesRaw = (body.notes ?? '').toString();
    const marketing =
      typeof body.marketing_opt_in === 'boolean'
        ? body.marketing_opt_in
        : Boolean(body.marketingOptIn);

    const phCandidate = body.phone ?? body.phoneDigits ?? body.phone_number;
    const phoneDigits = digitsOnly(phCandidate);

    const updatePayload: Record<string, unknown> = {};
    if (first_name) updatePayload.first_name = first_name;
    if (last_name) updatePayload.last_name = last_name;
    if (emailRaw !== '') updatePayload.email = emailRaw || null;
    if (notesRaw !== undefined) updatePayload.notes = notesRaw.trim() || null;
    if ('marketing_opt_in' in body || 'marketingOptIn' in body) {
      updatePayload.marketing_opt_in = marketing;
    }
    if (phoneDigits) {
      if (phoneDigits.length !== 10) {
        return NextResponse.json({ error: 'phone must be 10 digits' }, { status: 400 });
      }
      updatePayload.phone = phoneDigits;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No updatable fields supplied' }, { status: 400 });
    }

    const { data, error, status } = await supabaseAdmin
      .from('customers')
      .update(updatePayload)
      .eq('id', id)
      .eq('salon_id', SALON_ID)
      .select('id')
      .single();

    if (error) {
      const code = getPgCode(error);
      if (code === '23505') {
        return NextResponse.json(
          { error: 'A customer with this phone already exists for this salon' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: status || 500 });
    }

    if (!data) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Also support PATCH
export const PATCH = POST;
