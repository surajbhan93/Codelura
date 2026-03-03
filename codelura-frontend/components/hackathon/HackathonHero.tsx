"use client";

import { Button } from "@/components/ui/button";

export default function HackathonHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
          Codelura Ecosystem
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
          Codelura <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Hackathons</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Build. Compete. Win. Show the world what you can create in the next generation of tech challenges.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.getElementById("hackathon-tabs")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-2xl hover:shadow-gray-900/20 active:scale-95"
          >
            Explore Hackathons
          </button>
          <button className="px-10 py-5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all active:scale-95">
            Host Your Own
          </button>
        </div>
      </div>
    </section>
  );
}
