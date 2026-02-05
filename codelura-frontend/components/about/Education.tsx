"use client";

import Lottie from "lottie-react";
import readingBook from "@/public/lottie/learning.json";

export function Education() {
  return (
    <section className="pt-24 px-4 md:px-12">
      <h1 className="text-4xl font-semibold text-center mb-12">
        My <span className="text-primary">Qualification</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <Lottie animationData={readingBook} loop className="max-w-md mx-auto" />

        <div className="space-y-6">
          {[
            {
              title: "B.Tech in Mechanical Engineering",
              year: "2021 – 2025",
              desc: "NIT Allahabad",
            },
            {
              title: "Class 12th (CBSE)",
              year: "2020 – 2021",
              desc: "PCM Background",
            },
            {
              title: "GATE CSE",
              year: "AIR 823",
              desc: "All India Rank",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#313131] p-6 rounded-lg shadow hover:shadow-primary transition"
            >
              <h3 className="text-xl text-primary font-semibold">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-400">{item.year}</p>
              <p className="text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
