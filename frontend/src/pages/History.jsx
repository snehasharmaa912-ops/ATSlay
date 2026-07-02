import { useEffect, useState } from "react";
import api from "../api/axios";
import HistoryList from "../components/HistoryList";
export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await api.get("/resume/history");
    setItems(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchHistory();
  }, []);
  const handleDelete = async (id) => {
    await api.delete(`/resume/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your analysis history</h1>
      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : (
        <HistoryList items={items} onDelete={handleDelete} />
      )}
    </div>
  );
}
