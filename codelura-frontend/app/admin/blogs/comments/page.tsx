import api from "@/lib/api";

export default async function AdminComments() {
  const { data } = await api.get("/admin/comments", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return (
    <div>
      <h2 className="font-bold mb-3">Comments</h2>
      {data.map((c: any) => (
        <div key={c._id}>{c.comment}</div>
      ))}
    </div>
  );
}
