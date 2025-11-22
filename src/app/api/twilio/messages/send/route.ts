// app/api/messages/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

export const runtime = 'nodejs';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER!; // e.g. +1405...
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// US-only E.164 normalization
function toE164(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (/^\+\d{10,15}$/.test(s)) return s;
  const d = s.replace(/\D/g, '');
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith('1')) return `+${d}`;
  return null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const DELAY_MS = 150;

type Payload =
  | { mode: 'test'; to: string; body: string; salon_id?: string }
  | { mode: 'selected'; to: string[]; body: string; salon_id?: string }
  | { mode: 'bulk'; audience: 'all_opted_in' | 'all_test'; body: string; salon_id?: string };

async function sendMany(e164s: string[], body: string) {
  const sids: string[] = [];
  let sent = 0;
  for (const to of e164s) {
    try {
      const r = await client.messages.create({ to, from: TWILIO_FROM, body });
      sids.push(r.sid);
      sent++;
      await sleep(DELAY_MS);
    } catch {
      // optionally log failures
    }
  }
  return { sent, sids };
}

export async function POST(req: NextRequest) {
  try {
    const json = (await req.json()) as Payload;
    const body = (json as any).body?.toString?.().trim?.();
    if (!body) return NextResponse.json({ error: 'Missing body' }, { status: 400 });

    // 1) TEST
    if (json.mode === 'test') {
      const to = toE164(json.to);
      if (!to) return NextResponse.json({ error: 'Invalid test number' }, { status: 400 });
      const r = await client.messages.create({ to, from: TWILIO_FROM, body });
      return NextResponse.json({ sent: 1, sids: [r.sid] }, { status: 200 });
    }

    // 2) SELECTED
    if (json.mode === 'selected') {
      const list = (json.to || [])
        .map((n) => toE164(n))
        .filter((v): v is string => !!v);
      if (list.length === 0)
        return NextResponse.json({ error: 'No valid recipients' }, { status: 400 });
      const { sent, sids } = await sendMany(Array.from(new Set(list)), body);
      return NextResponse.json({ sent, sids }, { status: 200 });
    }

    // 3) BULK
    if (json.mode === 'bulk') {
      const salonId = json.salon_id || null;

      // Build base query using your existing "phone" column
      let base = supabase.from('customers').select('phone, sms_opt_in, sms_opt_in_at, sms_opt_out, sms_opt_out_at, sms_test');

      if (salonId) base = base.eq('salon_id', salonId);

      // Fetch all potential rows, then filter by audience:
      const { data, error } = await base.not('phone', 'is', null);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      let phones: string[] = [];

      if (json.audience === 'all_opted_in') {
        phones = (data || [])
          .filter((r) => {
            const inAt = r.sms_opt_in_at ? new Date(r.sms_opt_in_at as any).getTime() : 0;
            const outAt = r.sms_opt_out_at ? new Date(r.sms_opt_out_at as any).getTime() : 0;
            return (
              r.sms_opt_in === true &&
              inAt > 0 &&
              (outAt === 0 || inAt > outAt) &&
              r.sms_opt_out !== true
            );
          })
          .map((r) => r.phone as string);
      } else if (json.audience === 'all_test') {
        phones = (data || [])
          .filter((r) => r.sms_test === true)
          .map((r) => r.phone as string);
      } else {
        return NextResponse.json({ error: 'Invalid audience' }, { status: 400 });
      }

      const e164s = Array.from(
        new Set(phones.map((p) => toE164(p)).filter((p): p is string => !!p))
      );

      if (e164s.length === 0)
        return NextResponse.json({ sent: 0, sids: [], note: 'No eligible numbers' }, { status: 200 });

      const { sent, sids } = await sendMany(e164s, body);
      return NextResponse.json({ sent, sids }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ error: message || 'Server error' }, { status: 500 });
  }
}
