import Link from "next/link";
import Image from "next/image";
import ParticipateButton from "./ParticipateButton";

interface Hackathon {
  id: string;
  _id?: string;
  title: string;
  shortDescription: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "completed";
  prizePool: string;
  participantsCount: number;
}

const statusColors = {
  ongoing: "bg-green-500",
  upcoming: "bg-yellow-500",
  completed: "bg-gray-500",
};

export default function HackathonCard({ hackathon }: { hackathon: any }) {
  const id = hackathon.id || hackathon._id;
  
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col h-full transform hover:-translate-y-2">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={hackathon.bannerImage}
          alt={hackathon.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <span
          className={`absolute top-4 right-4 text-[11px] uppercase tracking-widest text-white px-3 py-1.5 rounded-full font-bold shadow-lg backdrop-blur-md ${statusColors[hackathon.status as keyof typeof statusColors] || "bg-gray-500"}`}
        >
          {hackathon.status}
        </span>
      </div>

      <div className="p-8 flex flex-col flex-1 space-y-6">
        <div className="space-y-2">
          <Link href={`/hackathons/${id}`}>
            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {hackathon.title}
            </h3>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {hackathon.shortDescription}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(hackathon.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(hackathon.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Prize Pool</span>
            <div className="text-indigo-600 font-black text-lg flex items-center gap-1">
              <span>💎</span> {hackathon.prizePool}
            </div>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Participants</span>
            <div className="text-gray-900 font-black text-lg flex items-center justify-end gap-1">
              {hackathon.participantsCount} <span>🔥</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <ParticipateButton hackathon={hackathon} />
        </div>
      </div>
    </div>
  );
}
