"use client";

export function MySkill() {
  const skills = [
    "React.js", "Next.js", "Node.js", "MongoDB",
    "TypeScript", "Tailwind CSS", "REST APIs", "Web Security"
  ];

  return (
    <section className="pt-24 px-4 md:px-12">
      <h1 className="text-4xl font-semibold text-center mb-10">
        My <span className="text-primary">Skills</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {skills.map((skill) => (
          <div
            key={skill}
            className="bg-[#313131] p-4 rounded text-center text-sm hover:scale-105 transition"
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}
