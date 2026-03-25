
// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Download,
  Users,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  Loader2,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


const API = import.meta.env.VITE_API_URL;

const COLORS = [
  "#A855F7",    // 5 – vivid vibrant purple (accents, active states)
  "#4f1b7c",    // 6 – rich strong purple (main buttons, sidebar base)
  "#7C3AED",    // 7 – deep electric purple (your current button tone)
  "#6B21A8",    // 8 – dark royal purple (dark text, borders)
  "#4C1D95",    // 9 – very dark indigo-purple (shadows, high contrast)
  "#E9D5FF",    // 2 – light lavender (soft card/hover base)
  "#D7B9FF",    // 3 – light-medium purple (visible but gentle)
  "#C084FC",    // 4 – medium bright purple (icons, medium segments)
  "#FCEFFF",    // 0 – extremely light lavender (almost white, very subtle bg)
  "#F3E5FF",    // 1 – very light pastel purple
  
];
export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalParticipants: 0,
    completionRate: 0,
    activeExperiments: 0,
    inactiveExperiments: 0,
  });

  const [demographics, setDemographics] = useState({
    total_participants: 0,
    age: {},
    profession: {},
    country: {},
    chatbot_usage: {},
  });

  const [selectedMetric, setSelectedMetric] = useState("Age");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("role") !== "company") {
      navigate("/participant/dashboard");
      return;
    }
    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again");
      setLoading(false);
      return;
    }

    try {
      // 1. Main dashboard stats (total participants, completion rate, experiments)
      const dashboardRes = await fetch(`${API}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!dashboardRes.ok) {
        const errText = await dashboardRes.text();
        throw new Error(errText || "Failed to load dashboard overview");
      }

      const dashboard = await dashboardRes.json();
      console.log("Main dashboard data:", dashboard); // ← debug

      setStats({
        totalParticipants: dashboard.total_participants || 0,
        completionRate: dashboard.completion_rate
          ? Math.round(dashboard.completion_rate) // backend already returns percentage
          : 0,
        activeExperiments:
          dashboard.experiments?.filter((e) => e.status === "active")?.length || 0,
        inactiveExperiments:
          dashboard.experiments?.filter((e) => e.status !== "active")?.length || 0,
      });

      // 2. Participant demographics – from users table (correct endpoint!)
      const demoRes = await fetch(`${API}/dashboard/participant-demographics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (demoRes.ok) {
        const demoData = await demoRes.json();
        console.log("Demographics loaded:", demoData); // ← very important debug
        setDemographics(demoData);
      } else {
        const errText = await demoRes.text();
        console.warn("Demographics endpoint failed:", errText);
        setDemographics({
          total_participants: 0,
          age: {},
          profession: {},
          country: {},
          chatbot_usage: {},
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Something went wrong while loading the dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/dashboard/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chatbot-experiments-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  // Prepare chart data
  let chartData = [];
  const metricKey = selectedMetric.toLowerCase().replace(" ", "_"); // e.g. "chatbot_usage" or "profession"

  if (demographics?.[metricKey]) {
    chartData = Object.entries(demographics[metricKey])
      .filter(([_, value]) => value > 0) // hide zero values
      .map(([name, percent]) => ({
        name,
        value: Number(percent.toFixed(1)), // ensure clean numbers
      }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/70 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Couldn't load dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 pb-12">
      {/* Welcome + Export Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h1>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-sm transition"
          >
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard
            icon={<Users />}
            title="Total Participants"
            value={stats.totalParticipants.toLocaleString()}
            subtitle="Across all experiments"
          />
          <KpiCard
            icon={<CheckCircle />}
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            subtitle="Participants completed"
          />
          <KpiCard
            icon={<PlayCircle />}
            title="Active Experiments"
            value={stats.activeExperiments}
            subtitle="Currently running"
          />
          <KpiCard
            icon={<PauseCircle />}
            title="Inactive Experiments"
            value={stats.inactiveExperiments}
            subtitle="Paused or ended"
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Your Experiments section */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-[560px]">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Experiments</h2>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50/40">
              <div className="text-center max-w-[320px]">
                <div className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-lg">
  <BarChart3 size={48} strokeWidth={1.8} />
</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  View and Manage Experiments
                </h3>

                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  Access all your active and completed experiments. Track progress,
                  view analytics, and manage experiment settings.
                </p>

                <button
                  onClick={() => navigate("/your-experiments")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow transition hover:shadow-lg"
                >
                  View Experiments →
                </button>
              </div>
            </div>
          </div>

          {/* Participant Demographics */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[560px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Participant Demographics
              </h2>

              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Age</option>
                <option>Profession</option>
                <option>Country</option>
                <option>Chatbot Usage</option>
              </select>
            </div>

            {demographics.total_participants === 0 || chartData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Users className="h-20 w-20 text-gray-300 mb-6" />
                <p className="text-xl font-medium">No demographic data yet</p>
                <p className="text-sm mt-3 text-center max-w-xs">
                  Participants need to register and join at least one of your experiments.
                </p>
              </div>
            ) : (
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={130}
                      paddingAngle={0}
                      startAngle={0}           // Start from top (common in dashboards)
                      endAngle={360}
                      dataKey="value"
                      label={({ name, value }) =>
                        value > 3 ? `${name} ${value}%` : ""
                      }
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={40} 
                      iconType="circle"
                      formatter={(value) => value}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, title, value, subtitle, color }) {

  return (
  <div className="rounded-2xl p-6 border bg-purple-50 border-purple-100">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-4xl font-bold text-gray-900 mt-1">{value}</p>
      </div>

      <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
        {React.cloneElement(icon, { size: 28 })}
      </div>
    </div>

    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);
}
