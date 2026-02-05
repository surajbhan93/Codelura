export default function TestimonialsSection() {
  return (
    <section className="bg-black py-24 text-white">
      <h2 className="text-center text-4xl font-bold mb-12">
        What People Say About Codelura
      </h2>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl">
          “Amazing mentorship and practical content.”
        </div>

        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl">
          “Helped me build real projects & clients.”
        </div>

        <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-xl">
          “One of the best platforms for developers.”
        </div>
      </div>
    </section>
  );
}
