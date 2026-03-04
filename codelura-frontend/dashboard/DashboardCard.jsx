"use client";
import Link from "next/link";
import TimelineProgress from "./TimelineProgress";
import SubmissionStatus from "./SubmissionStatus";
import RankBadge from "./RankBadge";

export default function DashboardCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-5 flex flex-col">
      <img src={data.banner} alt={data.title} className="rounded-xl h-40 w-full object-cover mb-4"/>
      <h2 className="text-xl font-semibold mb-2">{data.title}</h2>
      <TimelineProgress currentStage={data.currentStage} />
      <SubmissionStatus status={data.submissionStatus} score={data.score} />
      {data.rank && <RankBadge rank={data.rank} />}
      <Link href={`/dashboard/${data.id}`} className="mt-auto bg-black text-white text-center py-2 rounded-xl hover:bg-gray-800 transition">
        Open Dashboard
      </Link>
    </div>
  );
}