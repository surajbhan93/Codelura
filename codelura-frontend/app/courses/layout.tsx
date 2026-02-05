import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Job Oriented Courses & Notes | CodeLura",
  description:
    "Explore job-oriented courses and premium notes by CodeLura. Learn coding, software development, IT skills, and digital roles with beginner-friendly, placement-focused content.",

  keywords: [
    "job oriented courses",
    "software development course",
    "coding courses for beginners",
    "IT courses for freshers",
    "online courses india",
    "software job preparation",
    "CodeLura",
    "Referrals",
    "CodeWithSuraj"
  ],

  openGraph: {
    title: "Job Oriented Courses & Notes | CodeLura",
    description:
      "Learn coding, software development, and IT skills with CodeLura’s job-ready courses and notes.",
    url: "https://codelura.com/courses",
    siteName: "CodeLura",
    images: [
      {
        url: "https://codelura.com/og/courses.png",
        width: 1200,
        height: 630,
        alt: "CodeLura Courses & Notes",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Job Oriented Courses & Notes | CodeLura",
    description:
      "Upgrade your skills with CodeLura’s job-oriented courses and notes.",
    images: ["https://codelura.com/og/courses.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function CoursesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
