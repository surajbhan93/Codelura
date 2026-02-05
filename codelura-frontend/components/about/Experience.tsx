"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    role: "Software Developer",
    company: "Fifth Avenue Technologies | Remote (Albany, NY, USA)",
    duration: "July 2025 – Present",
    description:
      "• Designed and maintained backend microservices using FastAPI/Django, improving system scalability.\n" +
      "• Optimized complex PostgreSQL queries and schema design, reducing latency by 35%.\n" +
      "• Automated builds and deployments with Docker and AWS (ECS, RDS, S3), ensuring smooth CI/CD.",
  },
  {
    role: "Software Developer Intern",
    company: "SynapsWeb",
    duration: "June 2024 – July 2024",
    description:
      "• Developed scalable REST APIs with Django Rest Framework, handling 500+ requests/minute.\n" +
      "• Enhanced PostgreSQL performance using indexing strategies, cutting query execution time by 40%.\n" +
      "• Deployed applications on AWS (EC2, S3, CloudFront) with automated CI/CD pipelines.",
  },
  {
    role: "Co-Founder & CEO",
    company: "MentorSetu",
    duration: "2022 – Present",
    description:
      "Built a platform empowering students, freelancers, and MSMEs with practical skills, digital transformation, and career guidance.",
  },
  {
    role: "Freelancer",
    company: "Fiverr & Local Clients",
    duration: "2020 – Present",
    description:
      "Delivered 100+ scalable, user-focused websites and applications for startups and businesses worldwide.",
  },
  {
    role: "Home Tutor",
    company: "Self-employed (Kanpur & Noida)",
    duration: "2020 – 2023",
    description:
      "Taught Java, AI/ML, and Mathematics to students with personalized guidance, significantly improving results.",
  },
  {
    role: "CyberSec Club - Member",
    company: "MNNIT Allahabad",
    duration: "2022 – 2024",
    description:
      "Participated actively in cybersecurity workshops and Capture The Flag (CTF) competitions.",
  },
  {
    role: "CyberSec Club - Coordinator",
    company: "MNNIT Allahabad",
    duration: "2024 – 2025",
    description:
      "Led the club, organized CTF competitions, and mentored juniors in cybersecurity practices.",
  },
  {
    role: "Technical Content Writer | Certificate",
    company: "GeeksforGeeks | Remote",
    duration: "Dec 2023 – Mar 2024",
    description:
      "• Authored 35+ tutorials on Python, C++, DSA, HTML, CSS, and JavaScript (2.5M+ views).\n" +
      "• Applied SEO best practices, ranking 12+ articles on Google’s first page.\n" +
      "• Engaged with 100+ developers via forums, clarifying doubts and providing guidance.",
  },
  {
    role: "Public Speaker",
    company: "Josh Talks, Seminars & Colleges",
    duration: "2021 – Present",
    description:
      "Delivered talks on freelancing, career growth, and tech guidance at Josh Talks and multiple college seminars.",
  },
];

export function Experience() {
  return (
    <section className="mt-24 px-4 md:px-12 relative">
      {/* Heading */}
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-16"
      >
        My <span className="text-primary">Experience</span>
      </motion.h1>

      {/* Timeline Wrapper */}
      <div className="relative max-w-5xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-4 sm:left-1/2 top-0 h-full w-[2px] bg-gradient-to-b from-primary/70 to-primary/20 rounded-full" />

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative flex flex-col sm:flex-row ${
                index % 2 === 0 ? "sm:flex-row-reverse" : ""
              } items-start sm:items-center`}
            >
              {/* Timeline Dot */}
              <span className="absolute left-4 sm:left-1/2 top-6 sm:top-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 sm:-translate-y-1/2 shadow-md" />

              {/* Card */}
              <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all w-full sm:w-[46%] ml-10 sm:ml-0">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={20} className="text-primary" />
                  <h2 className="text-lg md:text-xl font-semibold">
                    {exp.role}
                  </h2>
                </div>

                <h3 className="text-primary font-medium text-sm md:text-base">
                  {exp.company}
                </h3>

                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 my-2">
                  <Calendar size={14} />
                  <span>{exp.duration}</span>
                </div>

                <p className="text-sm md:text-base text-gray-600 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
