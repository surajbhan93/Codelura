export default function SubmissionStatus({ status, score }) {
  const statusStyles = {
    "Not Submitted": "bg-gray-200 text-gray-600",
    "Submitted": "bg-blue-100 text-blue-600",
    "Under Review": "bg-yellow-100 text-yellow-600",
    "Evaluated": "bg-green-100 text-green-600",
  };
  return (
    <div className="my-3">
      <span className={`px-3 py-1 text-sm rounded-full ${statusStyles[status] || "bg-gray-200"}`}>
        {status}
      </span>
      {score && <div className="mt-2 text-sm font-medium">Score: {score}</div>}
    </div>
  );
}