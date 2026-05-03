type Review = {
  name: string;
  rating: number;
  text: string;
};

const reviews: Review[] = [
  {
    name: 'Jesetta H.',
    rating: 5,
    text: 'Very friendly staff. Had a very good experience and great service. 😍 Will definitely come back!',
  },
  {
    name: 'Lauryn H.',
    rating: 5,
    text: 'Friendly, clean, and professional.',
  },
  {
    name: 'Kaidence M.',
    rating: 5,
    text: 'Very clean, loved the environment. My nails are phenomenal. I Will definitely be back!',
  },
];

export default function Reviews() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          What Our Clients Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-3">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>

              <p className="text-gray-600 mb-4">{`"${review.text}"`}</p>

              <p className="font-semibold text-gray-800">
                - {review.name}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/El+Reno+Nail+Spa/@35.5133954,-97.975736,17z/data=!4m18!1m9!3m8!1s0x87ade50cb473037d:0xcc81d0f60c379674!2sEl+Reno+Nail+Spa!8m2!3d35.5133954!4d-97.9731611!9m1!1b1!16s%2Fg%2F11lw3nms5d!3m7!1s0x87ade50cb473037d:0xcc81d0f60c379674!8m2!3d35.5133954!4d-97.9731611!9m1!1b1!16s%2Fg%2F11lw3nms5d?entry=ttu&g_ep=EgoyMDI1MDUwNS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            className="text-blue-500 text-sm underline mt-1 block"
          >
            View more on Google →
          </a>
        </div>
      </div>
    </section>
  );
}