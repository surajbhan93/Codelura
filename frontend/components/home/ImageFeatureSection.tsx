import Image from "next/image";
import SectionWrapper from "@/components/shared/SectionWrapper";

export default function ImageFeatureSection() {
  return (
    <SectionWrapper bg="bg-black">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold text-white">
            Learn with Real-World Content
          </h2>
          <p className="mt-4 text-gray-400">
            Blogs, case studies, system design, backend & frontend material —
            curated from real industry experience.
          </p>
          <ul className="mt-6 space-y-2 text-gray-300 text-sm">
            <li>✔ Practical tutorials</li>
            <li>✔ Interview-oriented learning</li>
            <li>✔ Paid & free content</li>
          </ul>
        </div>

        <Image
          src="/home/learning.png"
          alt="Learning"
          width={520}
          height={380}
          className="rounded-xl border border-gray-800"
        />
      </div>
    </SectionWrapper>
  );
}
