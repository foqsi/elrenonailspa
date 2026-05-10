'use client';

import FadeInUp from '@/components/animations/FadeInUp';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';

type Review = {
  name: string;
  rating: number;
  text: string;
  emoji?: string;
};

const reviews: Review[] = [
  {
    name: 'Jesetta H.',
    rating: 5,
    text: 'Very friendly staff. Had a very good experience and great service. Will definitely come back!',
    emoji: '😍',
  },
  {
    name: 'Lauryn H.',
    rating: 5,
    text: 'Friendly, clean, and professional.',
    emoji: '⭐',
  },
  {
    name: 'Kaidence M.',
    rating: 5,
    text: 'Very clean, loved the environment. My nails are phenomenal. I will definitely be back!',
    emoji: '✨',
  },
];

export default function Reviews() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
            <span className="text-red-600 font-semibold text-sm">TESTIMONIALS</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it — hear from our happy customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, i) => {
            const animations = [FadeInLeft, FadeInUp, FadeInRight];
            const AnimComponent = animations[i % 3];

            return (
              <AnimComponent key={i}>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-100 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {'★'.repeat(review.rating)}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 mb-6 flex-grow italic">
                    &quot;{review.text}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-4 border-t border-red-200">
                    <p className="font-semibold text-gray-900">
                      {review.name}
                    </p>
                    <span className="text-2xl">{review.emoji}</span>
                  </div>
                </div>
              </AnimComponent>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Love us? Share your experience on Google!</p>
          <a
            href="https://www.google.com/maps/place/El+Reno+Nail+Spa/@35.5133954,-97.975736,17z/data=!4m18!1m9!3m8!1s0x87ade50cb473037d:0xcc81d0f60c379674!2sEl+Reno+Nail+Spa!8m2!3d35.5133954!4d-97.9731611!9m1!1b1!16s%2Fg%2F11lw3nms5d!3m7!1s0x87ade50cb473037d:0xcc81d0f60c379674!8m2!3d35.5133954!4d-97.9731611!9m1!1b1!16s%2Fg%2F11lw3nms5d?entry=ttu&g_ep=EgoyMDI1MDUwNS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            See All Reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}