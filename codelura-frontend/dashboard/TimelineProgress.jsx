export default function TimelineProgress({ currentStage }) {
  const stages = ["Registration", "Ongoing", "Submission Closed", "Results"];
  return (
    <div className="my-4">
      <div className="flex justify-between text-xs mb-2">
        {stages.map((stage) => (
          <span key={stage} className={stage === currentStage ? "font-bold text-black" : "text-gray-400"}>
            {stage}
          </span>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div className="h-2 bg-black rounded-full transition-all duration-500"
          style={{ width: `${(stages.indexOf(currentStage) + 1) * 25}%` }}/>
      </div>
    </div>
  );
}