import { NextResponse } from 'next/server';

const PLACE_ID = process.env.GOOGLE_PLACE_ID!; // e.g., "ChIJ…"
const API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

export async function GET() {
  try {
    // Fields: rating, total count, reviews (max 5), and a clean Google Maps URL
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask':
          [
            'id',
            'displayName',
            'rating',
            'userRatingCount',
            'reviews',          // up to 5, relevance-sorted
            'googleMapsUri',
            'attributions',     // make attributions available
          ].join(','),
      },
      // Optional: light caching to avoid hammering the API; don’t persist long-term
      next: { revalidate: 3600 }, // 1 hour
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();

    // Normalize what your component needs
    const out = {
      name: data.displayName?.text ?? '',
      rating: data.rating ?? null,
      count: data.userRatingCount ?? 0,
      googleMapsUri: data.googleMapsUri ?? '',
      // Only map the fields you plan to display (don’t alter review text)
      reviews: (data.reviews ?? []).map((r: any) => ({
        author: r.authorAttribution?.displayName ?? 'Google user',
        authorPhoto: r.authorAttribution?.photoUri ?? null,
        authorUri: r.authorAttribution?.uri ?? null,
        rating: r.rating ?? null,
        text: r.text?.text ?? '',
        time: r.publishTime ?? null,
      })),
      attributions: data.attributions ?? [],
    };

    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
