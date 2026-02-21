import SectionWrapper from "@/components/shared/SectionWrapper";

const services = [
  "Portfolio Websites",
  "Startup Landing Pages",
  "Admin Panels",
  "SaaS Dashboards",
  "Full-Stack Projects"
];

export default function ServicesSection() {
  return (
    <SectionWrapper bg="bg-[#0f0f0f]">
      <h2 className="mb-12 text-center text-4xl font-bold text-white">
        Website Development Services
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s}
            className="rounded-xl border border-gray-800 bg-black p-6 text-gray-300 hover:border-indigo-500 transition"
          >
            {s}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
