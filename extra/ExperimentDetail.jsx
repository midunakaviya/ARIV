// // src/pages/ExperimentDetail.jsx ← FINAL WORKING VERSION (Real Data from Backend)
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const API_URL = "http://localhost:8000";

// export default function ExperimentDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [experiment, setExperiment] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("No authentication token");
//       setLoading(false);
//       return;
//     }

//     // Fetch experiment details
//     fetch(`${API_URL}/experiments/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         // Parse steps from JSON string
//         try {
//           data.steps = JSON.parse(data.steps || "[]");
//         } catch (e) {
//           data.steps = [];
//         }
//         setExperiment(data);
//       })
//       .catch((err) => setError(`Failed to load experiment: ${err.message}`));

//     // Fetch participants for stats
//     fetch(`${API_URL}/experiments/${id}/participants`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then(setParticipants)
//       .catch((err) => console.warn("Participants load failed:", err))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-2xl text-gray-600">Loading experiment details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-xl text-red-600">{error}</p>
//       </div>
//     );
//   }

//   if (!experiment) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-xl text-red-600">Experiment not found</p>
//       </div>
//     );
//   }

//   const completedCount = participants.filter((p) => p.status === "complete").length;
//   const completionRate =
//     participants.length > 0 ? Math.round((completedCount / participants.length) * 100) : 0;

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "numeric",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800";
//       case "inactive":
//         return "bg-gray-100 text-gray-800";
//       case "completed":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-5xl mx-auto p-8">
//         <button
//           onClick={() => navigate("/your-experiments")}
//           className="mb-8 text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
//         >
//           ← Back to Experiments
//         </button>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//           <div className="flex justify-between items-start mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">{experiment.title}</h1>
//               <p className="text-gray-600">{experiment.description || "No description provided"}</p>
//             </div>
//             <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(experiment.status)}`}>
//               {experiment.status}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
//             <div className="bg-gray-50 p-6 rounded-xl">
//               <p className="text-sm text-gray-600 mb-2">Total Participants</p>
//               <p className="text-4xl font-bold text-gray-800">{participants.length}</p>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl">
//               <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
//               <p className="text-4xl font-bold text-gray-800">{completionRate}%</p>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl">
//               <p className="text-sm text-gray-600 mb-2">Created</p>
//               <p className="text-xl font-bold text-gray-800">{formatDate(experiment.created_at)}</p>
//             </div>
//           </div>

//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//             Experiment Flow ({experiment.steps.length} steps)
//           </h2>

//           <div className="space-y-4">
//             {experiment.steps.length === 0 ? (
//               <p className="text-gray-500 italic py-8 text-center">No steps configured yet.</p>
//             ) : (
//               experiment.steps.map((step, index) => (
//                 <div key={step.id || index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="font-medium text-gray-800">
//                         Step {index + 1}: {step.title || step.type || "Untitled Step"}
//                       </p>
//                       {step.subtitle && <p className="text-sm text-gray-600 mt-1">{step.subtitle}</p>}
//                       {step.survey_type && (
//                         <p className="text-sm text-gray-600 mt-1">
//                           Survey Type: {step.survey_type.toUpperCase()}
//                         </p>
//                       )}
//                       {step.type === "chatbot" && (
//                         <p className="text-sm text-gray-600 mt-1">Chatbot Interaction</p>
//                       )}
//                       {step.type === "info" && (
//                         <p className="text-sm text-gray-600 mt-1">Information Page</p>
//                       )}
//                       {step.type === "consent" && (
//                         <p className="text-sm text-gray-600 mt-1">Informed Consent</p>
//                       )}
//                     </div>
//                     <span className="text-sm text-gray-500">ID: {step.id}</span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/ExperimentDetail.jsx ← IMPROVED FLOW DISPLAY
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function ExperimentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/experiments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        try {
          data.steps = JSON.parse(data.steps || "[]");
        } catch (e) {
          data.steps = [];
        }
        setExperiment(data);
      })
      .catch((err) => setError(`Failed to load experiment: ${err.message}`));

    fetch(`${API_URL}/experiments/${id}/participants`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setParticipants)
      .catch(() => console.warn("Participants load failed"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading experiment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">Experiment not found</p>
      </div>
    );
  }

  const completedCount = participants.filter((p) => p.status === "complete").length;
  const completionRate =
    participants.length > 0 ? Math.round((completedCount / participants.length) * 100) : 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStepIconAndColor = (step) => {
    if (step.type === "info") {
      return { icon: "ℹ️", color: "bg-blue-100 text-blue-800" };
    }
    if (step.type === "consent") {
      return { icon: "✓", color: "bg-green-100 text-green-800" };
    }
    if (step.type === "chatbot") {
      return { icon: "💬", color: "bg-purple-100 text-purple-800" };
    }
    if (step.type === "survey") {
      return { icon: "📊", color: "bg-orange-100 text-orange-800" };
    }
    return { icon: "•", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={() => navigate("/your-experiments")}
          className="mb-8 text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
        >
          ← Back to Experiments
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{experiment.title}</h1>
              <p className="text-gray-600">{experiment.description || "No description provided"}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(experiment.status)}`}>
              {experiment.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Total Participants</p>
              <p className="text-4xl font-bold text-gray-800">{participants.length}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
              <p className="text-4xl font-bold text-gray-800">{completionRate}%</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Created</p>
              <p className="text-xl font-bold text-gray-800">{formatDate(experiment.created_at)}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Experiment Flow ({experiment.steps.length} {experiment.steps.length === 1 ? "step" : "steps"})
          </h2>

          <div className="space-y-6">
            {experiment.steps.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <p className="text-xl text-gray-500">No steps configured yet.</p>
                <p className="text-gray-400 mt-2">Add steps in the experiment configuration.</p>
              </div>
            ) : (
              experiment.steps.map((step, index) => {
                const { icon, color } = getStepIconAndColor(step);

                return (
                  <div
                    key={step.id || index}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center gap-6 hover:shadow-md transition"
                  >
                    <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-3xl`}>
                      {icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-gray-700">{index + 1}</span>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {step.title || "Untitled Step"}
                        </h3>
                      </div>
                      {step.subtitle && (
                        <p className="text-gray-600 mt-1">{step.subtitle}</p>
                      )}
                      {step.survey_type && (
                        <div className="mt-3 inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          Survey: {step.survey_type.toUpperCase()}
                        </div>
                      )}
                      {step.type === "chatbot" && experiment.external_chatbot_url && (
                        <p className="text-sm text-purple-700 mt-2">
                          External URL: {experiment.external_chatbot_url}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}