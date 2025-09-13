import supabaseAdmin from '@/lib/supabaseAdmin';
import { SALON_ID } from '@/lib/constants';
import { NextResponse } from 'next/server';

function digitsOnly(v: string) {
  return String(v || '').replace(/\D/g, '');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Accept both snake_case and camelCase
    const first_name = (body.first_name ?? body.firstName ?? '').toString().trim();
    const last_name = (body.last_name ?? body.lastName ?? '').toString().trim();
    const emailRaw = (body.email ?? '').toString().trim();
    const notesRaw = (body.notes ?? '').toString();
    const marketing = !!(body.marketing_opt_in ?? body.marketingOptIn);

    // Normalize phone (optional — only validate if provided)
    const phoneDigits = digitsOnly(body.phone ?? body.phoneDigits ?? body.phone_number);

    // Build an update payload from provided fields only (don’t clobber columns unintentionally)
    const updatePayload: Record<string, any> = {};
    if (first_name) updatePayload.first_name = first_name;
    if (last_name) updatePayload.last_name = last_name;
    if (emailRaw !== '') updatePayload.email = emailRaw || null; // empty string -> NULL
    if (notesRaw !== undefined) updatePayload.notes = notesRaw.trim() || null;
    if (body.hasOwnProperty('marketing_opt_in') || body.hasOwnProperty('marketingOptIn')) {
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
      // Handle unique violation on (salon_id, phone)
      if ((error as any).code === '23505') {
        return NextResponse.json(
          { error: 'A customer with this phone already exists for this salon' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: status || 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Invalid request' }, { status: 400 });
  }
}

// Optional: also support PATCH with the same handler
export const PATCH = POST;
