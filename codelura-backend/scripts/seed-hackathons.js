import mongoose from "mongoose";
import dotenv from "dotenv";
import Hackathon from "../App/models/Hackathon.js";

dotenv.config();

const hackathons = [
  {
    title: "AI Innovation Challenge",
    shortDescription: "Build the next generation of AI-powered applications that solve real-world problems.",
    fullDescription: "Join us for a 15-day intensive hackathon focused on Generative AI, LLMs, and innovative AI agents. Whether you're a seasoned developer or just starting with AI, this challenge provides the tools and mentorship to bring your wildest ideas to life. We're looking for projects that demonstrate technical excellence, creativity, and real impact.",
    bannerImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    prizePool: "$5,000",
    prizeDetails: "First Prize: $3,000 + Codelura Premium for Life\nSecond Prize: $1,500 + Mentorship Session\nThird Prize: $500",
    rules: "1. Teams can have 1-4 members.\n2. Projects must use at least one AI-related technology.\n3. Original work only. Any plagiarism will result in disqualification.\n4. Code must be submitted via a public GitHub repository.",
    registrationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    participants: []
  },
  {
    title: "Web3 World Summit",
    shortDescription: "Decentralize everything. Create dApps that empower communities and secure data.",
    fullDescription: "Web3 is about more than just crypto. It's about data sovereignty, decentralized governance, and transparent systems. In this hackathon, we challenge you to build dApps on various protocols that solve identity, supply chain, or social network issues. Get ready to BUIDL.",
    bannerImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),  // 10 days from now
    status: "ongoing",
    prizePool: "$10,000",
    prizeDetails: "Winner: $7,000\nRunner up: $3,000\nCommunity Choice: $1,000",
    rules: "1. All smart contracts must be open-sourced.\n2. Submissions must include a video demo (max 3 mins).\n3. Gas optimization will be a key judging criteria.",
    registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    participants: []
  },
  {
    title: "Codelura Genesis Hack",
    shortDescription: "The hackathon that started it all. Relive the best projects from our community.",
    fullDescription: "Our first ever hackathon was a massive success with over 100 projects submitted. This page serves as an archive of the event and the incredible innovations our community produced.",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
    status: "completed",
    prizePool: "$2,500",
    prizeDetails: "Awarded to 'EcoTrack', 'DecentralPay', and 'DevFlow'.",
    rules: "Event has concluded. No more submissions accepted.",
    registrationDeadline: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    participants: []
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Hackathon.deleteMany({});
    console.log("Deleted existing hackathons.");

    await Hackathon.insertMany(hackathons);
    console.log("Successfully seeded mock hackathons!");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
