import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
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

  const chartData = [...items]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((item, i) => ({
      index: i + 1,
      score: item.atsScore,
      label: new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }));

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold">Your analysis history</h1>

      {!loading && chartData.length >= 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-sm font-semibold mb-4 flex items-center gap-1.5">
            <TrendingUp size={15} className="text-accent" />
            Score trend across your scans
          </p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "#1e293b" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "#1e293b" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : (
        <HistoryList items={items} onDelete={handleDelete} />
      )}
    </div>
  );
}
