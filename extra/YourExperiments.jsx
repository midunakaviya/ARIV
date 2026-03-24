// // // src/pages/YourExperiments.jsx ← COMPLETE "Your Experiments" PAGE (Matches Prototype Exactly)
// // import React, { useState, useEffect } from "react";
// // import {
// //   Search, Download, Eye, Edit, Trash2, PlayCircle, PauseCircle, CheckCircle,
// // } from "lucide-react";

// // const API_URL = "http://localhost:8000";

// // export default function YourExperiments({ user }) {
// //   const [experiments, setExperiments] = useState([]);
// //   const [filteredExperiments, setFilteredExperiments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [activeTab, setActiveTab] = useState("All"); // All, Active, Inactive, Completed
// //   const [showExportMenu, setShowExportMenu] = useState(false);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       setLoading(false);
// //       return;
// //     }

// //     fetch(`${API_URL}/experiments`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     })
// //       .then((res) => (res.ok ? res.json() : Promise.reject()))
// //       .then((data) => {
// //         setExperiments(data);
// //         setFilteredExperiments(data);
// //       })
// //       .catch(() => {
// //         // Fallback hardcoded data for demo (matches your screenshots)
// //         const demoData = [
// //           {
// //             id: 1,
// //             name: "LEGO Chatbot Study",
// //             status: "active",
// //             participants: 12,
// //             completionRate: 85,
// //             startDate: "1/15/2024",
// //             lastActivity: "2 hours ago",
// //           },
// //           {
// //             id: 2,
// //             name: "Customer Support Bot A/B Test",
// //             status: "active",
// //             participants: 8,
// //             completionRate: 72,
// //             startDate: "1/10/2024",
// //             lastActivity: "5 hours ago",
// //           },
// //           {
// //             id: 3,
// //             name: "FAQ Assistant Evaluation",
// //             status: "active",
// //             participants: 5,
// //             completionRate: 60,
// //             startDate: "1/20/2024",
// //             lastActivity: "1 day ago",
// //           },
// //           {
// //             id: 4,
// //             name: "Product Recommendation Test",
// //             status: "completed",
// //             participants: 15,
// //             completionRate: 93,
// //             startDate: "11/15/2023",
// //             lastActivity: "3 weeks ago",
// //           },
// //           {
// //             id: 5,
// //             name: "E-commerce Bot Usability",
// //             status: "completed",
// //             participants: 20,
// //             completionRate: 88,
// //             startDate: "10/5/2023",
// //             lastActivity: "1 month ago",
// //           },
// //           {
// //             id: 6,
// //             name: "Demo Experiment",
// //             status: "inactive",
// //             participants: 1,
// //             completionRate: 100,
// //             startDate: "12/1/2023",
// //             lastActivity: "2 weeks ago",
// //           },
// //           {
// //             id: 7,
// //             name: "ABC Test",
// //             status: "inactive",
// //             participants: 1,
// //             completionRate: 50,
// //             startDate: "12/10/2023",
// //             lastActivity: "1 week ago",
// //           },
// //         ];
// //         setExperiments(demoData);
// //         setFilteredExperiments(demoData);
// //       })
// //       .finally(() => setLoading(false));
// //   }, []);

// //   useEffect(() => {
// //     let filtered = experiments;

// //     if (searchTerm) {
// //       filtered = filtered.filter((exp) =>
// //         exp.name.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     if (activeTab !== "All") {
// //       filtered = filtered.filter((exp) => exp.status === activeTab.toLowerCase());
// //     }

// //     setFilteredExperiments(filtered);
// //   }, [searchTerm, activeTab, experiments]);

// //   const handleExport = (option) => {
// //     // Same logic as dashboard
// //     alert(`Exporting ${option} experiments... (connect to backend)`);
// //     setShowExportMenu(false);
// //   };

// //   const getStatusBadge = (status) => {
// //     const colors = {
// //       active: "bg-green-100 text-green-800",
// //       inactive: "bg-gray-100 text-gray-800",
// //       completed: "bg-blue-100 text-blue-800",
// //     };
// //     return (
// //       <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.inactive}`}>
// //         {status}
// //       </span>
// //     );
// //   };

// //   const getStatusIcon = (status) => {
// //     switch (status) {
// //       case "active":
// //         return <PlayCircle className="text-green-600" size={20} />;
// //       case "inactive":
// //         return <PauseCircle className="text-gray-600" size={20} />;
// //       case "completed":
// //         return <CheckCircle className="text-blue-600" size={20} />;
// //       default:
// //         return null;
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <p className="text-2xl text-gray-600">Loading experiments...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <nav className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-800">Your Experiments</h1>
// //             <p className="text-sm text-gray-600 mt-1">Manage and monitor all your chatbot experiments</p>
// //           </div>
// //           <div className="relative">
// //             <button
// //               onClick={() => setShowExportMenu(!showExportMenu)}
// //               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-medium"
// //             >
// //               <Download size={20} /> Export Data
// //             </button>
// //             {showExportMenu && (
// //               <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
// //                 <div className="py-1">
// //                   <button onClick={() => handleExport("all")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
// //                     All Experiments
// //                   </button>
// //                   <button onClick={() => handleExport("active")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
// //                     Active Experiments
// //                   </button>
// //                   <button onClick={() => handleExport("inactive")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
// //                     Inactive Experiments
// //                   </button>
// //                   <button onClick={() => handleExport("completed")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
// //                     Completed Experiments
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </nav>

// //       <div className="max-w-7xl mx-auto p-6">
// //         {/* Search + Tabs */}
// //         <div className="mb-8">
// //           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
// //             <div className="relative w-full sm:w-96">
// //               <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //               <input
// //                 type="text"
// //                 placeholder="Search experiments..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Tabs */}
// //           <div className="flex gap-2">
// //             {["All", "Active", "Inactive", "Completed"].map((tab) => (
// //               <button
// //                 key={tab}
// //                 onClick={() => setActiveTab(tab)}
// //                 className={`px-6 py-3 rounded-xl font-medium transition ${
// //                   activeTab === tab
// //                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
// //                     : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
// //                 }`}
// //               >
// //                 {tab}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Experiment Cards */}
// //         <div className="space-y-4">
// //           {filteredExperiments.length === 0 ? (
// //             <div className="text-center py-12 text-gray-500">
// //               No experiments found for "{activeTab === "All" ? "current filter" : activeTab.toLowerCase()}".
// //             </div>
// //           ) : (
// //             filteredExperiments.map((exp) => (
// //               <div key={exp.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
// //                 <div className="flex items-start justify-between mb-4">
// //                   <div className="flex items-center gap-3">
// //                     <h3 className="text-xl font-semibold text-gray-800">{exp.name}</h3>
// //                     {getStatusBadge(exp.status)}
// //                   </div>
// //                   <div className="flex items-center gap-3">
// //                     <button className="text-purple-600 hover:text-purple-800">
// //                       <Eye size={20} />
// //                     </button>
// //                     <button className="text-blue-600 hover:text-blue-800">
// //                       <Edit size={20} />
// //                     </button>
// //                     <button className="text-red-600 hover:text-red-800">
// //                       <Trash2 size={20} />
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
// //                   <div>
// //                     <p className="text-gray-600">Participants</p>
// //                     <p className="text-2xl font-bold text-gray-800 mt-1">{exp.participants}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-600">Completion Rate</p>
// //                     <p className="text-2xl font-bold text-gray-800 mt-1">{exp.completionRate}%</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-600">Start Date</p>
// //                     <p className="text-lg font-medium text-gray-800 mt-1">{exp.startDate}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-600">Last Activity</p>
// //                     <p className="text-lg font-medium text-gray-800 mt-1 flex items-center gap-2">
// //                       {getStatusIcon(exp.status)}
// //                       {exp.lastActivity}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {/* Progress Bar */}
// //                 <div className="mt-6">
// //                   <div className="w-full bg-gray-200 rounded-full h-3">
// //                     <div
// //                       className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
// //                       style={{ width: `${exp.completionRate}%` }}
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/YourExperiments.jsx ← CONNECTED TO BACKEND (Real Data)
// import React, { useState, useEffect } from "react";
// import {
//   Search, Download, Eye, Edit, Trash2,
// } from "lucide-react";

// const API_URL = "http://localhost:8000";

// export default function YourExperiments({ user }) {
//   const [experiments, setExperiments] = useState([]);
//   const [filteredExperiments, setFilteredExperiments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("All");
//   const [showExportMenu, setShowExportMenu] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     // Fetch experiments
//     fetch(`${API_URL}/experiments`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch experiments");
//         return res.json();
//       })
//       .then(async (exps) => {
//         // For each experiment, fetch participant count and completion
//         const enriched = await Promise.all(
//           exps.map(async (exp) => {
//             const participantsRes = await fetch(`${API_URL}/experiments/${exp.id}/participants`, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const participants = participantsRes.ok ? await participantsRes.json() : [];

//             const totalParticipants = participants.length;
//             const completedParticipants = participants.filter(p => p.status === "complete").length;
//             const completionRate = totalParticipants > 0 
//               ? Math.round((completedParticipants / totalParticipants) * 100) 
//               : 0;

//             return {
//               id: exp.id,
//               name: exp.title,
//               status: exp.status,
//               participants: totalParticipants,
//               completionRate,
//               startDate: new Date(exp.created_at).toLocaleDateString("en-US", {
//                 month: "numeric",
//                 day: "numeric",
//                 year: "numeric",
//               }),
//               lastActivity: "Recently", // You can improve this with real last activity later
//             };
//           })
//         );

//         setExperiments(enriched);
//         setFilteredExperiments(enriched);
//       })
//       .catch((err) => {
//         console.error(err);
//         // Fallback to empty list
//         setExperiments([]);
//         setFilteredExperiments([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     let filtered = experiments;

//     if (searchTerm) {
//       filtered = filtered.filter((exp) =>
//         exp.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (activeTab !== "All") {
//       filtered = filtered.filter((exp) => exp.status === activeTab.toLowerCase());
//     }

//     setFilteredExperiments(filtered);
//   }, [searchTerm, activeTab, experiments]);

//   const handleExport = (option) => {
//     alert(`Exporting ${option} experiments... (implement backend call)`);
//     setShowExportMenu(false);
//   };

//   const getStatusBadge = (status) => {
//     const colors = {
//       active: "bg-green-100 text-green-800",
//       inactive: "bg-gray-100 text-gray-800",
//       completed: "bg-blue-100 text-blue-800",
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.inactive}`}>
//         {status}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-2xl text-gray-600">Loading experiments...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Your Experiments</h1>
//             <p className="text-sm text-gray-600 mt-1">Manage and monitor all your chatbot experiments</p>
//           </div>
//           <div className="relative">
//             <button
//               onClick={() => setShowExportMenu(!showExportMenu)}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-medium"
//             >
//               <Download size={20} /> Export Data
//             </button>
//             {showExportMenu && (
//               <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
//                 <div className="py-1">
//                   <button onClick={() => handleExport("all")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     All Experiments
//                   </button>
//                   <button onClick={() => handleExport("active")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Active Experiments
//                   </button>
//                   <button onClick={() => handleExport("inactive")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Inactive Experiments
//                   </button>
//                   <button onClick={() => handleExport("completed")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                     Completed Experiments
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto p-6">
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//             <div className="relative w-full sm:w-96">
//               <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search experiments..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
//               />
//             </div>
//           </div>

//           <div className="flex gap-2">
//             {["All", "Active", "Inactive", "Completed"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-3 rounded-xl font-medium transition ${
//                   activeTab === tab
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
//                     : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-4">
//           {filteredExperiments.length === 0 ? (
//             <div className="text-center py-12 text-gray-500 bg-white rounded-2xl">
//               No experiments found.
//             </div>
//           ) : (
//             filteredExperiments.map((exp) => (
//               <div key={exp.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-xl font-semibold text-gray-800">{exp.name}</h3>
//                     {getStatusBadge(exp.status)}
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <button className="text-purple-600 hover:text-purple-800">
//                       <Eye size={20} />
//                     </button>
//                     <button className="text-blue-600 hover:text-blue-800">
//                       <Edit size={20} />
//                     </button>
//                     <button className="text-red-600 hover:text-red-800">
//                       <Trash2 size={20} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
//                   <div>
//                     <p className="text-gray-600">Participants</p>
//                     <p className="text-2xl font-bold text-gray-800 mt-1">{exp.participants}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Completion Rate</p>
//                     <p className="text-2xl font-bold text-gray-800 mt-1">{exp.completionRate}%</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Start Date</p>
//                     <p className="text-lg font-medium text-gray-800 mt-1">{exp.startDate}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Last Activity</p>
//                     <p className="text-lg font-medium text-gray-800 mt-1">{exp.lastActivity}</p>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
//                       style={{ width: `${exp.completionRate}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/YourExperiments.jsx ← FULLY UPDATED & CONNECTED (Actions Working + Real Data)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:8000";

export default function YourExperiments({ user }) {
  const [experiments, setExperiments] = useState([]);
  const [filteredExperiments, setFilteredExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/experiments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch experiments");
        return res.json();
      })
      .then(async (exps) => {
        const enriched = await Promise.all(
          exps.map(async (exp) => {
            const participantsRes = await fetch(`${API_URL}/experiments/${exp.id}/participants`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const participants = participantsRes.ok ? await participantsRes.json() : [];

            const totalParticipants = participants.length;
            const completedParticipants = participants.filter((p) => p.status === "complete").length;
            const completionRate =
              totalParticipants > 0 ? Math.round((completedParticipants / totalParticipants) * 100) : 0;

            // Format date
            const startDate = new Date(exp.created_at).toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
            });

            return {
              id: exp.id,
              name: exp.title || "Untitled Experiment",
              status: exp.status || "active",
              participants: totalParticipants,
              completionRate,
              startDate,
              lastActivity: "Recently", // Can be improved later with real last activity
            };
          })
        );

        setExperiments(enriched);
        setFilteredExperiments(enriched);
      })
      .catch((err) => {
        console.error("Error loading experiments:", err);
        setExperiments([]);
        setFilteredExperiments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = experiments;

    if (searchTerm) {
      filtered = filtered.filter((exp) =>
        exp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab !== "All") {
      filtered = filtered.filter((exp) => exp.status === activeTab.toLowerCase());
    }

    setFilteredExperiments(filtered);
  }, [searchTerm, activeTab, experiments]);

  const handleExport = (option) => {
    // Placeholder – connect to real export endpoint later
    alert(`Exporting ${option} experiments...`);
    setShowExportMenu(false);
  };

  const handleView = (id) => {
    navigate(`/experiment-detail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/experiment-config?edit=${id}`);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/experiments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        // Remove from state
        setExperiments((prev) => prev.filter((e) => e.id !== id));
        alert("Experiment deleted successfully");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete experiment");
      });
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.inactive}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading experiments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Experiments</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and monitor all your chatbot experiments</p>
          </div>
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
                  {["All", "Active", "Inactive", "Completed"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleExport(opt.toLowerCase())}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {opt} Experiments
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search experiments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {["All", "Active", "Inactive", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredExperiments.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm">
              No experiments found.
            </div>
          ) : (
            filteredExperiments.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-800">{exp.name}</h3>
                    {getStatusBadge(exp.status)}
                  </div>

                  {/* ACTION BUTTONS – NOW WORKING */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleView(exp.id)}
                      className="text-purple-600 hover:text-purple-800 transition"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(exp.id)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit Experiment"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id, exp.name)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete Experiment"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="text-gray-600">Participants</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{exp.participants}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{exp.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="text-lg font-medium text-gray-800 mt-1">{exp.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Activity</p>
                    <p className="text-lg font-medium text-gray-800 mt-1">{exp.lastActivity}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${exp.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}