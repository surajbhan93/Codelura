"use client";

import { useEffect, useState } from "react";
import HackathonCard from "./HackathonCard";
import api from "@/lib/api";

const tabs = ["upcoming", "ongoing", "completed"] as const;
type TabStatus = typeof tabs[number];

// Singleton cache with TTL (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;
const singletonCache = new Map<string, { data: any[]; timestamp: number }>();

export default function HackathonTabs() {
  const [activeTab, setActiveTab] = useState<TabStatus>("upcoming");
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHackathons = async (status: string) => {
    const now = Date.now();
    const cached = singletonCache.get(status);

    // Check if cache is valid (not expired)
    if (cached && now - cached.timestamp < CACHE_TTL) {
      setHackathons(cached.data);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/api/hackathons?status=${status}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setHackathons(data);
      
      // Update singleton cache
      singletonCache.set(status, { data, timestamp: now });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons(activeTab);
  }, [activeTab]);

  return (
    <div id="hackathon-tabs" className="space-y-8">
      {/* Tabs Menu */}
      <div className="flex gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold capitalize transition-all relative whitespace-nowrap ${
              activeTab === tab
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Loading State (Skeletons) */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                </div>
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-red-900">Unable to load hackathons</h3>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={() => fetchHackathons(activeTab)}
            className="mt-6 bg-red-600 text-white px-8 py-2 rounded-xl font-medium hover:bg-red-700 transition shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && hackathons.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900">No {activeTab} hackathons found</h3>
          <p className="text-gray-500 mt-2">Check back later for new upcoming challenges!</p>
        </div>
      )}

      {/* Success State (Cards) */}
      {!loading && !error && hackathons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id || hackathon._id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </div>
  );
}
