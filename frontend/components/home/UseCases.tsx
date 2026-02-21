export default function UseCases() {
  const cases = [
    "Students preparing for tech jobs",
    "Developers upgrading skills",
    "Freelancers building portfolios",
    "Startups needing websites",
  ];

  return (
    <section className="bg-[#0b0b0b] py-24 text-white">
      <h2 className="text-center text-4xl font-bold mb-12">
        Who Is Codelura For?
      </h2>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 px-6">
        {cases.map((c) => (
          <div
            key={c}
            className="bg-black border border-gray-800 p-6 rounded-xl"
          >
            {c}
          </div>
        ))}
      </div>
    </section>
  );
}
