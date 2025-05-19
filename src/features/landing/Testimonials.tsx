import Star from '@/components/Star';

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} />
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mt-2 mb-10">Five STARS on Google</h2>

        <div className="space-y-6 text-center">
          <blockquote className="italic text-gray-700">Lauryn says, “Friendly, clean, and professional.”</blockquote>
          <blockquote className="italic text-gray-700">“Wonderful service!” - Mckenzie</blockquote>
          <blockquote className="italic text-gray-700">“Very friendly staff. Had a very good experience and great service. 😍 Will definitely come back!” - Jesetta</blockquote>
          <blockquote className="italic text-gray-700">Kaidence said, “Very clean , loved the environment. My nails are phenomenal. I Will definitely be back !&rdquo;</blockquote>
          <a
            href="https://www.google.com/maps/place/El+Reno+Nail+Spa/@35.5133954,-97.975736,17z/data=!4m18!1m9!3m8!1s0x87ade50cb473037d:0xcc81d0f60c379674!2sEl+Reno+Nail+Spa!8m2!3d35.5133954!4d-97.9731611!9m1!1b1!16s%2Fg%2F11lw3nms5d!3m7!1s0x87ade50cb473037d:0xcc81d0f60c379674!8m2!3d35.5133954!4d-97.9731611!9m1!1b1!16s%2Fg%2F11lw3nms5d?entry=ttu&g_ep=EgoyMDI1MDUwNS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            className="text-blue-500 text-sm underline mt-1 block"
          >
            See all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
