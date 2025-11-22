'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type CustomerHit = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_e164: string | null; // computed by /api/customers/search from your "phone" column
};

export default function MessagesPanel({ salonId }: { salonId?: string }) {
  // Audience switches
  const [allOptIn, setAllOptIn] = useState(false);
  const [testOnly, setTestOnly] = useState(false);

  // Search/selection
  const [q, setQ] = useState('');
  const [results, setResults] = useState<CustomerHit[]>([]);
  const [selected, setSelected] = useState<CustomerHit[]>([]);
  const [searching, setSearching] = useState(false);
  const searchAbortRef = useRef<AbortController | null>(null);

  // Message + links
  const [googleReviewLink, setGoogleReviewLink] = useState('https://g.page/r/your-short-review-link');
  const [facebookReviewLink, setFacebookReviewLink] = useState('https://www.facebook.com/YourPage/reviews');
  const [body, setBody] = useState(
    'El Reno Nail Spa: Thanks for visiting! Would you leave us a quick Google review? {link} Reply STOP to opt out.'
  );

  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState<'google' | 'facebook' | null>(null);

  // Final composed text (supports {link}/{google} and {facebook})
  const finalText = useMemo(
    () =>
      body.replace(/\{link\}|\{google\}/gi, googleReviewLink).replace(/\{facebook\}/gi, facebookReviewLink),
    [body, googleReviewLink, facebookReviewLink]
  );
  const charCount = finalText.length;
  const segments = Math.ceil(charCount / 160);

  // Mutually exclusive toggles
  function toggleAllOptIn(checked: boolean) {
    setAllOptIn(checked);
    if (checked) setTestOnly(false);
  }
  function toggleTestOnly(checked: boolean) {
    setTestOnly(checked);
    if (checked) setAllOptIn(false);
  }

  // Debounced search (name/phone)
  useEffect(() => {
    if (!q || q.trim().length < 2 || allOptIn || testOnly) {
      setResults([]);
      return;
    }

    let active = true;
    const timeout = setTimeout(async () => {
      try {
        setSearching(true);
        searchAbortRef.current?.abort();
        searchAbortRef.current = new AbortController();

        const url = new URL('/api/customers/search', window.location.origin);
        url.searchParams.set('q', q);
        if (salonId) url.searchParams.set('salon_id', salonId);

        const res = await fetch(url.toString(), { signal: searchAbortRef.current.signal });
        if (!res.ok) throw new Error('Search failed');
        const data: CustomerHit[] = await res.json();
        if (active) setResults(data.slice(0, 10));
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
      searchAbortRef.current?.abort();
    };
  }, [q, allOptIn, testOnly, salonId]);

  function addRecipient(hit: CustomerHit) {
    if (!hit.phone_e164) return;
    const exists = selected.some((r) => r.phone_e164 === hit.phone_e164);
    if (!exists) setSelected((s) => [hit, ...s]);
    setQ('');
    setResults([]);
  }

  function removeRecipient(phone_e164: string | null) {
    if (!phone_e164) return;
    setSelected((s) => s.filter((r) => r.phone_e164 !== phone_e164));
  }

  function clearRecipients() {
    setSelected([]);
  }

  async function postJSON(url: string, payload: unknown) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json().catch(() => ({}));
  }

  // Send:
  // - allOptIn  -> audience: 'all_opted_in'
  // - testOnly  -> audience: 'all_test'
  // - else      -> explicit list (phone_e164[])
  async function handleSend() {
    if (!finalText || finalText.trim().length === 0) {
      alert('Message body is empty.');
      return;
    }
    if (!allOptIn && !testOnly && selected.length === 0) {
      alert('Select at least one recipient or choose an audience.');
      return;
    }

    const confirmMsg = allOptIn
      ? 'Send to ALL opted-in customers?'
      : testOnly
        ? 'Send to ALL test users?'
        : `Send to ${selected.length} selected recipient(s)?`;
    if (!confirm(confirmMsg)) return;

    try {
      setSending(true);

      if (allOptIn) {
        await postJSON('/api/twilio/messages/send', {
          mode: 'bulk',
          audience: 'all_opted_in',
          body: finalText,
          salon_id: salonId,
        });
      } else if (testOnly) {
        await postJSON('/api/twilio/messages/send', {
          mode: 'bulk',
          audience: 'all_test',
          body: finalText,
          salon_id: salonId,
        });
      } else {
        const to = selected.map((r) => r.phone_e164).filter((p): p is string => !!p);
        await postJSON('/api/twilio/messages/send', {
          mode: 'selected',
          to,
          body: finalText,
          salon_id: salonId,
        });
      }

      alert('Send triggered.');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to send.';
      alert(message || 'Failed to send.');
    } finally {
      setSending(false);
    }
  }

  async function copyLink(which: 'google' | 'facebook') {
    const val = which === 'google' ? googleReviewLink : facebookReviewLink;
    try {
      await navigator.clipboard.writeText(val);
      setCopied(which);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      alert('Copy failed.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Messages <span className='text-red-600'>DO NOT USE</span></h3>

      {/* Audience toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allOptIn}
            onChange={(e) => toggleAllOptIn(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Send to all opted-in customers</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={testOnly}
            onChange={(e) => toggleTestOnly(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Send only to test users</span>
        </label>
      </div>

      {/* Search + Recipients (hidden if sending to all/test) */}
      {!allOptIn && !testOnly && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search customers (name or phone)</label>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type at least 2 characters…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {q && results.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 rounded-md border border-gray-200 bg-white shadow z-20 max-h-64 overflow-auto">
                {results.map((r) => {
                  const name = [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || 'Unnamed';
                  const phone = r.phone_e164 ?? '';
                  return (
                    <button
                      key={`${r.id}-${phone}`}
                      onClick={() => addRecipient(r)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-0"
                    >
                      <div className="font-medium">{name}</div>
                      <div className="text-xs text-gray-600">{phone}</div>
                    </button>
                  );
                })}
              </div>
            )}
            {searching && <div className="absolute right-3 top-2.5 text-xs text-gray-500">Searching…</div>}
          </div>

          {/* Selected recipients */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Recipients ({selected.length})</label>
              {selected.length > 0 && (
                <button onClick={clearRecipients} className="text-xs text-red-600 hover:underline">
                  Clear
                </button>
              )}
            </div>
            {selected.length > 0 ? (
              <div className="rounded-md border border-gray-300 p-2 max-h-40 overflow-auto">
                {selected.map((r) => {
                  const name = [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || 'Unnamed';
                  return (
                    <div key={`${r.id}-${r.phone_e164}`} className="flex items-center justify-between gap-2 py-1">
                      <div className="text-sm">
                        <span className="font-medium">{name}</span>{' '}
                        <span className="text-gray-600">{r.phone_e164}</span>
                      </div>
                      <button
                        onClick={() => removeRecipient(r.phone_e164)}
                        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 border border-dashed rounded p-3">
                No recipients selected. Use the search above to add people.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review links + copy actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Review Link</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={googleReviewLink}
              onChange={(e) => setGoogleReviewLink(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://g.page/r/..."
            />
            <button onClick={() => copyLink('google')} className="shrink-0 px-3 py-2 rounded-md border bg-gray-50 hover:bg-gray-100">
              {copied === 'google' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Use GBP “Ask for reviews” or writereview?placeid= link.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Review Link</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={facebookReviewLink}
              onChange={(e) => setFacebookReviewLink(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://www.facebook.com/YourPage/reviews"
            />
            <button onClick={() => copyLink('facebook')} className="shrink-0 px-3 py-2 rounded-md border bg-gray-50 hover:bg-gray-100">
              {copied === 'facebook' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Message editor + preview */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="mt-1 text-xs text-gray-600">Characters: {charCount} | Estimated segments: {segments}</div>
          <div className="mt-2 text-sm">
            <span className="font-semibold">Preview:</span>
            <div className="mt-1 rounded border bg-gray-50 px-3 py-2 text-gray-800">{finalText}</div>
            <p className="text-xs text-gray-500 mt-1">
              Placeholders supported: <code>{'{link}'}</code> or <code>{'{google}'}</code> for Google,{' '}
              <code>{'{facebook}'}</code> for Facebook.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send Message'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Audience:{' '}
            {allOptIn ? 'All opted-in customers' : testOnly ? 'All test users' : `${selected.length} selected`}. Your
            backend should enforce eligibility (e.g., <code>sms_allowed = true</code>).
          </p>
        </div>
      </div>
    </div>
  );
}
