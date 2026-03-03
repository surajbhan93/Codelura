import ParticipateButton from "@/components/hackathon/ParticipateButton";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // Revalidate every 60 seconds

async function getHackathon(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    // Using a longer timeout and better error propagation
    const res = await fetch(`${baseUrl}/api/hackathons/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 } 
    });
    
    if (res.status === 404) return "NOT_FOUND";
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    return res.json();
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    return "ERROR";
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const hackathon = await getHackathon(id);
  if (!hackathon || typeof hackathon === "string") return { title: "Hackathon | Codelura" };
  
  return {
    title: `${hackathon.title} | Codelura Hackathon`,
    description: hackathon.shortDescription,
    openGraph: {
      title: hackathon.title,
      description: hackathon.shortDescription,
      images: [hackathon.bannerImage],
    }
  };
}

export default async function HackathonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hackathon = await getHackathon(id);

  if (hackathon === "NOT_FOUND") {
    notFound();
  }

  if (hackathon === "ERROR" || !hackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">📡</div>
          <h1 className="text-2xl font-bold text-gray-900">Connection Error</h1>
          <p className="text-gray-600">We're having trouble reaching our servers. Please check your internet connection or try again later.</p>
          <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-24 md:pt-0">
      {/* Banner & Hero Area */}
      <div className="relative h-64 md:h-[400px] w-full bg-gray-900 overflow-hidden">
        <Image
          src={hackathon.bannerImage}
          alt={hackathon.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 pb-10">
            <Link 
              href="/hackathons" 
              className="text-white/80 hover:text-white mb-6 inline-flex items-center gap-2 text-sm transition"
            >
              ← Back to all hackathons
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {hackathon.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-xl">🏆</span>
                <span className="font-semibold">{hackathon.prizePool}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-xl">👥</span>
                <span className="font-semibold">{hackathon.participantsCount} Joined</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
              {hackathon.fullDescription}
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rules & Guidelines</h2>
            <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {hackathon.rules}
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prizes</h2>
            <div className="text-gray-600 whitespace-pre-wrap">
              {hackathon.prizeDetails}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Action */}
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl sticky top-24">
            <h3 className="text-xl font-bold mb-4">Ready to compete?</h3>
            <p className="text-indigo-200 text-sm mb-8">
              Join this challenge and showcase your skills to win exciting prizes!
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm border-b border-indigo-800 pb-3">
                <span className="text-indigo-300">Starts</span>
                <span className="font-medium">{new Date(hackathon.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-indigo-800 pb-3">
                <span className="text-indigo-300">Ends</span>
                <span className="font-medium">{new Date(hackathon.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <ParticipateButton hackathon={hackathon} />
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-indigo-400 text-white hover:bg-indigo-800"
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
