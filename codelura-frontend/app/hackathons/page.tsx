import HackathonHero from "@/components/hackathon/HackathonHero";
import HackathonTabs from "@/components/hackathon/HackathonTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathons | Codelura",
  description: "Explore and participate in upcoming, ongoing, and completed hackathons at Codelura.",
};

export default function HackathonsPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pt-20 md:pt-0">
      <HackathonHero />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-16 md:py-24">
        <HackathonTabs />
      </div>
    </main>
  );
}
