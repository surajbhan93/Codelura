"use client";

import Image from "next/image";

const teamRoles = [
  { title: "Frontend Developer", img: "/team/frontend.jpg" },
  { title: "Backend Developer", img: "/team/backend.jpg" },
  { title: "Co-Founder & CEO", img: "/team/ceo.jpg" },
  { title: "HR Manager", img: "/team/hr.png" },
  { title: "ML Doveloper", img: "/team/ML.jpg" },
  { title: "UI/UX Designer", img: "/team/ui.png" },
  
  { title: "Marketing Head", img: "/team/marketing.png" },
  
  { title: "Database Engineer", img: "/team/database.png" },
  { title: "Social Media Handler", img: "/team/social.jpeg" },
];

export function TeamScroller() {
  return (
    <section className="pt-24 pb-16 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold">
          Our <span className="text-primary">Team</span>
        </h1>
        <p className="text-neutral-400 mt-2">
          People behind Codelura’s vision & execution
        </p>
      </div>

      {/* Scroller */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-10 animate-scroll-left w-max">
          {[...teamRoles, ...teamRoles].map((role, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[160px]"
            >
              {/* Gradient Ring */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 p-[3px]">
                <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={role.img}
                    alt={role.title}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-center">
                {role.title}
              </h3>
              <p className="text-xs text-neutral-400">Explore Role</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
