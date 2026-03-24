// src/pages/YourExperiments.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, ArrowLeft, Eye, Edit, Trash2, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { label: "All", value: null },
  { label: "Active", value: "active" },
  { label: "Drafts", value: "draft" },
  { label: "Completed", value: "completed" },
];

export default function YourExperiments({ user }) {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchExperiments = async (status = null) => {
    if (!token) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = `${API}/experiments`;
      if (status) {
        url += `?status=${status}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to load experiments (${res.status})`);
      }

      const data = await res.json();

      // Enrich minimally – backend should already send participant_count & completed_count
    const enriched = await Promise.all(
  data.map(async (exp) => {
    const partsRes = await fetch(
      `${API}/experiments/${exp.id}/participants`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const allParticipants = partsRes.ok ? await partsRes.json() : [];

    // ✅ Only count "real" participation (not invited / empty)
    const realParticipants = Array.isArray(allParticipants)
      ? allParticipants.filter(
          (p) => p?.status === "started" || p?.status === "complete"
        )
      : [];

    const completedCount = realParticipants.filter(
      (p) => p.status === "complete"
    ).length;

    const completionRate =
      realParticipants.length > 0
        ? Math.round((completedCount / realParticipants.length) * 100)
        : 0;

    // ✅ Derive UI status from completion logic
    let uiStatus = "draft";
    if (realParticipants.length > 0 && completionRate === 100) uiStatus = "completed";
    else if (realParticipants.length > 0) uiStatus = "active";

    return {
      id: exp.id,
      name: exp.title || "Untitled Experiment",
      status: uiStatus, // ✅ IMPORTANT: use derived status, not backend status
      participants: realParticipants.length, // ✅ IMPORTANT: real count
      completionRate,
      startDate: exp.created_at
        ? new Date(exp.created_at).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          })
        : "—",
    };
  })
);

      setExperiments(enriched);
    } catch (err) {
      console.error("Error fetching experiments:", err);
      setError(err.message || "Could not load experiments");
      setExperiments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when tab or search changes
  useEffect(() => {
  fetchExperiments();
}, []);


  // Client-side search (optional – can be removed if backend supports it)
  const filteredExperiments = experiments.filter((exp) => {
  // search filter
  const matchesSearch = exp.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  if (!matchesSearch) return false;

  // ALL tab
  if (activeTab === null) return true;

  // COMPLETED → only 100% completed
  if (activeTab === "completed") {
    return exp.participants > 0 && exp.completionRate === 100;
  }

  // DRAFTS → no participants yet
  if (activeTab === "draft") {
    return exp.participants === 0;
  }

  // ACTIVE → started but not completed
  if (activeTab === "active") {
    return exp.participants > 0 && exp.completionRate < 100;
  }

  return true;
});

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

  // const getStatusBadge = (status) => {
  //   const base = "px-3 py-1 rounded-full text-xs font-medium";
  //   switch (status?.toLowerCase()) {
  //     case "active":
  //       return `${base} bg-green-100 text-green-800`;
  //     case "inactive":
  //       return `${base} bg-orange-100 text-orange-800`;
  //     case "completed":
  //       return `${base} bg-blue-100 text-blue-800`;
  //     default:
  //       return `${base} bg-gray-100 text-gray-800`;
  //   }
  // };
const getStatusBadge = (status) => {
  const base = "px-3 py-1 rounded-full text-xs font-medium inline-flex";

  // normalize backend status → UI status
  let uiStatus = status;
  if (status === "inactive") uiStatus = "draft";

  let color = "bg-gray-100 text-gray-700"; // draft default
  if (uiStatus === "active") color = "bg-green-100 text-green-700";
  if (uiStatus === "completed") color = "bg-blue-100 text-blue-700";

  return (
    <span className={`${base} ${color}`}>
      {uiStatus}
    </span>
  );
};


  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${API}/experiments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      
      setExperiments((prev) => prev.filter((e) => e.id !== id));
      alert("Experiment deleted");
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Please log in to view your experiments</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Nav */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
         <div className="flex items-start gap-4">
  {/* Back Button */}
  <button
    onClick={() => navigate("/dashboard")}
    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-700 font-semibold">
                            <ArrowLeft className="w-4 h-4" />
                            Back
  </button>

  {/* Title */}
  <div>
    <h1 className="text-2xl font-bold text-gray-800">
      Your Experiments
    </h1>
    {/* <p className="text-xs text-gray-600 mt-1">
      Manage and monitor all your chatbot experiments
    </p> */}
  </div>
</div>


          <div className="relative">
            <button
  onClick={() => setShowExportMenu(!showExportMenu)}
  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-sm transition"
>
  <Download size={20} /> Export Data
</button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white border border-gray-200 z-50">
                  <button
                              onClick={handleExport}
                              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-600 text-white rounded-xl font-medium shadow-sm"
                            >
                              <Download size={18} />
                              Export Data
                            </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search + Tabs */}
        <div className="mb-8 space-y-5">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search experiments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
  {TABS.map((tab) => (
    <button
      key={tab.label}
      onClick={() => setActiveTab(tab.value)}
      className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
        activeTab === tab.value
          ? "bg-purple-600 text-white shadow-md"
          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>

        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">Loading experiments...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 bg-red-50 rounded-2xl">
            {error}
          </div>
        ) : filteredExperiments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            {/* <p className="text-xl text-gray-600 mb-2">
              No {activeTab !== "All" ? activeTab.toLowerCase() : ""} experiments found
            </p> */}
            <p className="text-gray-500 mb-6">
              {activeTab === null
                ? "Create your first experiment to get started."
                : `You don't have any ${activeTab.toLowerCase()} experiments yet.`}
            </p>
            <button
              onClick={() => navigate("/experiment-config")}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium"
            >
              Create Experiment
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredExperiments.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    {/* <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition">
                      {exp.name}
                    </h3>
                    <div className="mt-2">{getStatusBadge(exp.status)}</div> */}
                    <div className="flex items-center gap-3">
  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-700 transition">
    {exp.name}
  </h3>
  {getStatusBadge(exp.status)}
</div>
                  </div>

                  <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition">
                    <button
                      onClick={() => navigate(`/experiment-detail/${exp.id}`)}
                      title="View Details"
                      className="text-gray-600 hover:text-purple-600"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => navigate(`/experiment-config?experimentId=${exp.id}&tab=Flow`)}
                      title="Edit"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id, exp.name)}
                      title="Delete"
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="text-2xl font-bold mt-1">{exp.participants}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-bold mt-1 text-black-700">
  {exp.completionRate}%
</p>

                  </div>
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="text-lg font-medium mt-1">{exp.startDate}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${exp.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}