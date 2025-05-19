import StoreFront from "@/components/StoreFront";

export default function About() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start">
          {/* Text Content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-red-600 mb-6">About Us</h2>
            <p className="text-gray-600 text-justify leading-relaxed">
              At <b className="text-red-600"><span className="text-gray-500">El Reno</span> Nail Spa</b>,
              <br /><br />
              <span className="text-red-600">We</span> are more than just a nail salon. We are a family-owned and
              family-operated business dedicated to serving our community with
              care and excellence.
              <br />
              <span className="text-red-600">As</span> a new addition to the town, we take pride in offering a welcoming
              and relaxing environment where every client feels valued and
              pampered.
              <br />
              <span className="text-red-600">Our</span> mission is simple: to provide outstanding nail and spa services
              that combine quality, creativity, and comfort. Whether you&apos;re here for a quick touch-up,
              a luxurious spa treatment, or stunning nail art,
              our team is committed to exceeding your expectations.
              <br />
              <span className="text-red-600">We</span> believe in building lasting relationships with our clients by
              delivering personalized care and attention to detail. Every visit to
              El Reno Nail Spa is an opportunity to relax, unwind, and leave
              feeling refreshed and confident.
              <br />
              <span className="text-red-600">Thank you</span> for welcoming us to El Reno. We look forward to serving
              you and being a part of your self-care journey!
            </p>
          </div>

          {/* Image */}
          <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0">
            <StoreFront className=" w-3xl h-3xl rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
