"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Codelura } from "@/components/about/Codelura";


import { BottomLine } from "@/components/shared/BottomLine";
import { MySkill } from "@/components/about/MySkill";
import { Education } from "@/components/about/Education";
import { Experience } from "@/components/about/Experience";
import { TeamScroller } from "@/components/about/TeamScroller";
export default function AboutPage() {
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    axios
      .get("https://codewithsuraj-portfolio-backend.onrender.com/api/resume/latest")
      .then((res) => {
        setResumeLink(
          "https://codewithsuraj-portfolio-backend.onrender.com" +
            res.data.path
        );
      });
  }, []);

  return (
    <section className="pt-16 my-16 px-4 md:px-12">
        <Codelura />
        <TeamScroller/>
      {/* Heading */}
      <motion.div
        className="mb-12 text-center"
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <h3 className="text-neutral-400">Something About Myself</h3>
        <h1 className="text-4xl md:text-5xl font-semibold">
          About <span className="text-primary">Me</span>
        </h1>
        <BottomLine />
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <Image
            src="https://i.ibb.co/kVMGMxWJ/my.png"
            alt="Suraj Bhan"
            width={280}
            height={280}
            className="rounded-full shadow-lg"
            priority
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center md:text-left">
            Suraj Bhan – Full-Stack Developer | Entrepreneur | Mentor
          </h1>

          <TypeAnimation
            className="text-xl md:text-2xl text-primary font-bold text-center md:text-left"
            sequence={[
              "A Full-stack Developer", 2000,
              "A MERN Stack Developer", 2000,
              "A Web Security Enthusiast", 2000,
              "A Blockchain Enthusiast", 2000,
              "A Freelancer Building Scalable Solutions", 2000,
            ]}
            repeat={Infinity}
          />

          <p className="mt-6 text-neutral-300 text-sm md:text-base leading-relaxed">
            I’m a MERN & TypeScript Developer with 3+ years of freelancing
            experience, building 100+ websites for startups and global clients.
            I focus on scalable, secure and user-centric digital products.
            <br /><br />
            Co-Founder & CEO of <b>MentorSetu</b>, mentoring 500+ learners across
            Bharat. Background includes <b>GATE CSE AIR-823</b>, NIT Allahabad,
            and industry experience at Synapsweb & Fifth Avenue Technologies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
            <p><span className="text-primary">Email:</span> suraj933628@gmail.com</p>
            <p><span className="text-primary">Location:</span> Noida, UP, India</p>
          </div>
        </motion.div>
      </div>

      <MySkill />
      <Education />
      <Experience />
    </section>
  );
}
