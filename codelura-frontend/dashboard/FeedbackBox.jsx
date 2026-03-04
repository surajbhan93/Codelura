export default function FeedbackBox({ feedback }) {
  if (!feedback)
    return <div className="bg-gray-100 p-4 rounded-xl text-gray-500">Feedback not generated yet.</div>;
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-2">AI Feedback</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>
    </div>
  );
}