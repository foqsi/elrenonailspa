import { NextResponse } from 'next/server';

const PLACE_ID = process.env.GOOGLE_PLACE_ID!;
const API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

// Google Places Types
type PlaceReview = {
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
  rating?: number;
  text?: { text?: string };
  publishTime?: string;
};

type PlaceResponse = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlaceReview[];
  attributions?: unknown[];
};

export async function GET() {
  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': [
          'id',
          'displayName',
          'rating',
          'userRatingCount',
          'reviews',
          'googleMapsUri',
          'attributions',
        ].join(','),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = (await res.json()) as PlaceResponse;

    const out = {
      name: data.displayName?.text ?? '',
      rating: data.rating ?? null,
      count: data.userRatingCount ?? 0,
      googleMapsUri: data.googleMapsUri ?? '',
      reviews: (data.reviews ?? []).map((r: PlaceReview) => ({
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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
