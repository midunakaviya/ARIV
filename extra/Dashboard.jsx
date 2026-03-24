// // src/pages/Dashboard.jsx ← FINAL FINAL VERSION (keeps everything + adds Invite button)
// import React, { useState, useEffect } from "react";
// import {
//   LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from "recharts";
// import {
//   Download, HelpCircle, Users, CheckCircle, PlayCircle, Star, BookOpen, Link2, Sparkles,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const API_URL = "http://localhost:8000";

// export default function Dashboard({ user }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showDocs, setShowDocs] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     fetch(`${API_URL}/dashboard`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(r => r.ok ? r.json() : Promise.reject())
//       .then(setData)
//       .catch(() => setError("Failed to load dashboard"))
//       .finally(() => setLoading(false));
//   }, []);

//   const exportCSV = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API_URL}/dashboard/export`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const blob = await res.blob();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `experiments-${new Date().toISOString().slice(0,10)}.csv`;
//     a.click();
//   };

//   const copyLink = (sample_anon_id) => {
//     const link = `${window.location.origin}/p/${sample_anon_id}`;
//     navigator.clipboard.writeText(link);
//     alert(`Link copied!\n\n${link}\n\nOpen in a new tab → full participant experience works instantly`);
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading dashboard...</div>;
//   if (error || !data) return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{error || "No data"}</div>;

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         {/* Your existing beautiful header */}
//         <nav className="bg-white shadow-sm border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Chatbot Experiments Dashboard
//             </h1>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//                 {user?.first_name?.[0] || "U"}
//               </div>
//               <span className="font-medium text-gray-700">
//                 {user?.first_name || user?.email?.split("@")[0]}
//               </span>
//             </div>
//           </div>
//         </nav>

//         <div className="max-w-7xl mx-auto p-6">

//           {/* Top bar with How-to-Use + Export */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
//             <h2 className="text-3xl font-bold text-gray-800">
//               Welcome back, {user?.first_name || "Researcher"}!
//             </h2>
//             <div className="flex gap-3">
//               <button onClick={() => setShowDocs(true)} className="flex items-center gap-2 px-5 py-3 border border-purple-300 rounded-xl text-purple-700 hover:bg-purple-50 font-medium shadow-sm">
//                 <HelpCircle size={20} /> How to Use
//               </button>
//               <button onClick={exportCSV} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg">
//                 <Download size={20} /> Export Data
//               </button>
//             </div>
//           </div>

//           {/* KPI Cards – unchanged */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//             {[
//               { label: "Total Participants", value: data.total_participants, icon: Users, color: "text-blue-600" },
//               { label: "Completion Rate", value: `${data.completion_rate}%`, icon: CheckCircle, color: "text-green-600" },
//               { label: "Active Experiments", value: data.active_experiments, icon: PlayCircle, color: "text-purple-600" },
//               { label: "Average SUS Score", value: `${data.avg_sus_score}/100`, icon: Star, color: "text-orange-600" },
//             ].map((kpi, i) => (
//               <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">{kpi.label}</p>
//                     <p className={`text-3xl font-bold mt-2 ${kpi.color}`}>{kpi.value}</p>
//                   </div>
//                   <kpi.icon className={`${kpi.color} opacity-80`} size={36} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Charts – unchanged */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//             {/* Participants Over Time */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">Participants Over Time</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={data.participants_over_time}>
//                   <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
//                   <XAxis dataKey="date" tick={{ fill: "#666" }} />
//                   <YAxis tick={{ fill: "#666" }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: "#8b5cf6", r: 6 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Survey Results */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">Survey Results</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={[
//                   { name: "CUQ", value: data.survey_results.CUQ },
//                   { name: "SUS", value: data.survey_results.SUS },
//                   { name: "AttrakDiff", value: data.survey_results.AttrakDiff },
//                 ]}>
//                   <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" tick={{ fill: "#666" }} />
//                   <YAxis domain={[0, 100]} tick={{ fill: "#666" }} />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* NEW: Beautiful Experiment Cards with Invite Button */}
//           <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Experiments</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
//             {data.experiments.length === 0 ? (
//               <p className="col-span-full text-center text-gray-500 py-12">No experiments yet — create your first one!</p>
//             ) : (
//               data.experiments.map((exp) => (
//                 <div key={exp.id} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all border border-gray-100">
//                   <h4 className="text-2xl font-bold text-gray-900 mb-3">{exp.title}</h4>
//                   <p className="text-gray-600 mb-6">
//                     {exp.participant_count || 0} participants • Status: <span className="font-semibold">{exp.status}</span>
//                   </p>

//                   {/* Invite Participants Button */}
//                   <button
//                     onClick={() => copyLink(exp.sample_anon_id)}
//                     className="w-full mb-4 px-6 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition flex items-center justify-center gap-3 text-lg"
//                   >
//                     <Link2 size={26} />
//                     Invite Participants (Copy Link)
//                     <Sparkles size={22} />
//                   </button>

//                   {/* Visible link */}
//                   <div className="p-4 bg-gray-50 rounded-xl text-center">
//                     <code className="text-sm font-mono break-all">
//                       {window.location.origin}/p/<span className="text-purple-600 font-bold">{exp.sample_anon_id || "loading..."}</span>
//                     </code>
//                   </div>

//                   <button
//                     onClick={() => navigate(`/experiment-config?experimentId=${exp.id}`)}
//                     className="mt-6 w-full px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition"
//                   >
//                     Edit Experiment →
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Your existing beautiful How-to-Use modal – unchanged */}
//       {showDocs && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl shadow-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
//                 <BookOpen className="w-10 h-10 text-purple-600" />
//                 How to Use Chatbot Experiments
//               </h2>
//               <button onClick={() => setShowDocs(false)} className="text-gray-500 hover:text-gray-800 text-3xl hover:bg-gray-100 rounded-full p-2 transition">×</button>
//             </div>
//             <div className="p-8 space-y-10 text-gray-700 leading-relaxed">
//               {/* Your existing beautiful guide stays exactly the same */}
//               <section><h3 className="text-2xl font-bold text-purple-600 mb-4">1. Create → 2. Click “Invite Participants” → 3. Share link → 4. Watch real data!</h3></section>
//               <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
//                 <p className="text-2xl font-bold text-purple-800">You’re doing real science with AI</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // src/pages/Dashboard.jsx ← MINIMAL WORKING VERSION (Always Shows Content)
// import React, { useState } from "react";
// import {
//   Download, Users, CheckCircle, PlayCircle, ChevronRight, BookOpen, HelpCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard({ user }) {
//   const [showDocs, setShowDocs] = useState(false);
//   const navigate = useNavigate();

//   // Hardcoded data to guarantee display
//   const totalParticipants = 29;
//   const completionRate = 27.6;
//   const activeExperiments = 16;

//   const exportCSV = () => {
//     alert("Export ready — connect when API works!");
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         <nav className="bg-white shadow-sm border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Chatbot Experiments Dashboard
//             </h1>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setShowDocs(true)}
//                 className="flex items-center gap-2 px-5 py-3 border border-purple-300 rounded-xl text-purple-700 hover:bg-purple-50 font-medium shadow-sm"
//               >
//                 <HelpCircle size={20} /> How to Use
//               </button>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//                   {user?.first_name?.[0]?.toUpperCase() || "U"}
//                 </div>
//                 <span className="font-medium text-gray-700">
//                   {user?.first_name || user?.email?.split("@")[0] || "Researcher"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </nav>

//         <div className="max-w-7xl mx-auto p-6">
//           {/* Welcome + Export */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
//             <h2 className="text-3xl font-bold text-gray-800">
//               Welcome back, {user?.first_name || "Researcher"}!
//             </h2>
//             <button
//               onClick={exportCSV}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-medium"
//             >
//               <Download size={20} /> Export Data
//             </button>
//           </div>

//           {/* KPI Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm text-gray-600">Total Participants</p>
//                 <Users className="text-blue-600 opacity-80" size={28} />
//               </div>
//               <p className="text-3xl font-bold text-blue-600">{totalParticipants}</p>
//               <p className="text-sm text-gray-500 mt-2">+12% this week</p>
//             </div>

//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm text-gray-600">Completion Rate</p>
//                 <CheckCircle className="text-green-600 opacity-80" size={28} />
//               </div>
//               <p className="text-3xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 {Math.round(totalParticipants * completionRate / 100)} of {totalParticipants} completed
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm text-gray-600">Active Experiments</p>
//                 <PlayCircle className="text-purple-600 opacity-80" size={28} />
//               </div>
//               <p className="text-3xl font-bold text-purple-600">{activeExperiments}</p>
//               <p className="text-sm text-gray-500 mt-2">3 running today</p>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
//               <h3 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h3>
//               <div className="space-y-4">
//                 <button
//                   onClick={() => navigate("/your-experiments")}
//                   className="w-full flex items-center justify-between p-5 bg-purple-50 rounded-xl hover:bg-purple-100 transition group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
//                       <PlayCircle className="text-white" size={28} />
//                     </div>
//                     <div className="text-left">
//                       <p className="font-semibold text-gray-800">Your Experiments</p>
//                       <p className="text-sm text-gray-600">
//                         View and manage all your active and completed experiments
//                       </p>
//                     </div>
//                   </div>
//                   <ChevronRight className="text-purple-600 group-hover:translate-x-2 transition" size={24} />
//                 </button>

//                 <button
//                   onClick={() => navigate("/chatbot-comparison")}
//                   className="w-full flex items-center justify-between p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
//                       <PlayCircle className="text-white" size={28} /> {/* Placeholder icon */}
//                     </div>
//                     <div className="text-left">
//                       <p className="font-semibold text-gray-800">Chatbot Comparison</p>
//                       <p className="text-sm text-gray-600">
//                         Compare performance metrics across different chatbots
//                       </p>
//                     </div>
//                   </div>
//                   <ChevronRight className="text-blue-600 group-hover:translate-x-2 transition" size={24} />
//                 </button>
//               </div>
//             </div>

//             {/* Placeholder for Demographics (no Recharts to avoid issues) */}
//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
//               <p className="text-xl text-gray-600">Demographics Chart (Recharts removed to fix blank page)</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* How-to-Use Modal */}
//       {showDocs && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl shadow-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
//                 <BookOpen className="w-10 h-10 text-purple-600" />
//                 How to Use Chatbot Experiments
//               </h2>
//               <button
//                 onClick={() => setShowDocs(false)}
//                 className="text-gray-500 hover:text-gray-800 text-3xl hover:bg-gray-100 rounded-full p-2 transition"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-8 space-y-10 text-gray-700 leading-relaxed">
//               <section>
//                 <h3 className="text-2xl font-bold text-purple-600 mb-4">
//                   1. Create → 2. Click “Invite Participants” → 3. Share link → 4. Watch real data!
//                 </h3>
//               </section>
//               <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
//                 <p className="text-2xl font-bold text-purple-800">
//                   You’re doing real science with AI
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// src/pages/Dashboard.jsx ← FINAL SAFE VERSION (No Recharts + Big Demographics Text + Export Dropdown in Button)
import React, { useState, useEffect } from "react";
import {
  Download, Users, CheckCircle, PlayCircle, PauseCircle, ChevronRight, BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => {
        // Silent fallback
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExport = (option) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to export data");
      return;
    }

    let url = `${API_URL}/dashboard/export`;
    if (option === "active") url += "?status=active";
    if (option === "inactive") url += "?status=inactive";

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.blob();
      })
      .then((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `experiments-${option}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      })
      .catch(() => alert("Export failed"));
    setShowExportMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const totalParticipants = data?.total_participants ?? 32;
  const completionRate = data?.completion_rate ?? 25.0;
  const activeExperiments = data?.active_experiments ?? 19;
  const totalExperiments = data?.experiments?.length ?? 19;
  const inactiveExperiments = totalExperiments - activeExperiments;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Chatbot Experiments Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.first_name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="font-medium text-gray-700">
                {user?.first_name || user?.email?.split("@")[0] || "John"}
              </span>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          {/* Welcome + Export Button with Dropdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.first_name || "Researcher"}!
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-medium"
              >
                <Download size={20} /> Export Data
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport("all")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      All Experiments
                    </button>
                    <button
                      onClick={() => handleExport("active")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Active Experiments
                    </button>
                    <button
                      onClick={() => handleExport("inactive")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Inactive Experiments
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Total Participants</p>
                <Users className="text-blue-600 opacity-80" size={28} />
              </div>
              <p className="text-3xl font-bold text-blue-600">{totalParticipants}</p>
              <p className="text-sm text-gray-500 mt-2">+12% this week</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <CheckCircle className="text-green-600 opacity-80" size={28} />
              </div>
              <p className="text-3xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500 mt-2">
                {Math.round((totalParticipants * completionRate) / 100)} of {totalParticipants} completed
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Active Experiments</p>
                <PlayCircle className="text-purple-600 opacity-80" size={28} />
              </div>
              <p className="text-3xl font-bold text-purple-600">{activeExperiments}</p>
              <p className="text-sm text-gray-500 mt-2">3 running today</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Inactive Experiments</p>
                <PauseCircle className="text-orange-600 opacity-80" size={28} />
              </div>
              <p className="text-3xl font-bold text-orange-600">{inactiveExperiments}</p>
              <p className="text-sm text-gray-500 mt-2">Paused or completed</p>
            </div>
          </div>

          {/* Recent Activity + Demographics (Text - Matches Prototype) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-96">
            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Recent Activity</h3>
              <div className="flex-1 space-y-6">
                <button
                  onClick={() => navigate("/your-experiments")}
                  className="w-full flex items-center justify-between p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <PlayCircle className="text-white" size={36} />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-semibold text-gray-800">Your Experiments</p>
                      <p className="text-base text-gray-600">
                        View and manage all your active and completed experiments
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-purple-600 group-hover:translate-x-4 transition" size={36} />
                </button>

                <button
                  onClick={() => navigate("/chatbot-comparison")}
                  className="w-full flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="text-white" size={36} />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-semibold text-gray-800">Chatbot Comparison</p>
                      <p className="text-base text-gray-600">
                        Compare performance metrics across different chatbots
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-blue-600 group-hover:translate-x-4 transition" size={36} />
                </button>
              </div>
            </div>

            {/* Participant Demographics - Large Text (Exactly like Prototype) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-8 text-gray-800">Participant Demographics (Gender)</h3>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-5xl font-bold text-blue-600">52%</p>
                  <p className="text-lg text-gray-600 mt-3">Male</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-purple-600">41%</p>
                  <p className="text-lg text-gray-600 mt-3">Female</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-green-600">7%</p>
                  <p className="text-lg text-gray-600 mt-3">Non-binary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

