'use client';

import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from '@react-google-maps/api';
import { useState, useRef } from 'react';
import Image from 'next/image';

const center = { lat: 35.51309382301597, lng: -97.97322797601785 };

export default function ContactPage() {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [infoOpen, setInfoOpen] = useState(true);

  if (!isLoaded) {
    return <p className="text-center py-20">Loading map...</p>;
  }

  return (
    <main className="min-h-screen pt-8 bg-white">
      {/* Map Container */}
      <div className="w-full flex justify-center px-4 sm:px-0 py-8">
        <div className="w-[95vw] sm:w-full max-w-3xl h-[400px] sm:h-[500px] rounded-lg shadow overflow-hidden">
          <GoogleMap
            center={center}
            zoom={16}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={(map) => {
              mapRef.current = map;
              map.panBy(0, 100);
            }}
          >
            <MarkerF position={center} onClick={() => setInfoOpen(!infoOpen)} />
            {infoOpen && (
              <InfoWindowF position={center} onCloseClick={() => setInfoOpen(false)}>
                <div className="w-60 sm:w-64">
                  <Image
                    src="/images/storefront.jpg"
                    alt="El Reno Nail Spa"
                    width={256}
                    height={112}
                    className="w-full h-28 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-bold text-red-600 mb-1">El Reno Nail Spa</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    1605 Investors Ave<br />El Reno, OK 73036
                  </p>
                  <a
                    href="https://www.google.com/maps/place/El+Reno+Nail+Spa/@35.5133997,-97.975736,17z/data=!3m1!4b1!4m6!3m5!1s0x87ade50cb473037d:0xcc81d0f60c379674!8m2!3d35.5133954!4d-97.9731611!16s%2Fg%2F11lw3nms5d?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    View on Google Maps
                  </a>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        </div>
      </div>
    </main>
  );
}
