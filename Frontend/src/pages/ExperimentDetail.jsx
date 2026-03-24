// // src/pages/ExperimentDetail.jsx
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
//   const [chatbotMap, setChatbotMap] = useState({});

//   const getStepTint = (step) => {
//   // soft, professional tints
//   if (step.type === "consent") return "bg-emerald-50 border-emerald-100";
//   if (step.type === "survey") return "bg-indigo-50 border-indigo-100";
//   if (step.id === "chatbot" || step.type === "task") return "bg-violet-50 border-violet-100";
//   // info / default
//   return "bg-slate-50 border-slate-200";
// };

// const getNumberTint = (step) => {
//   if (step.type === "consent") return "bg-emerald-100 text-emerald-800 border-emerald-200";
//   if (step.type === "survey") return "bg-indigo-100 text-indigo-800 border-indigo-200";
//   if (step.id === "chatbot" || step.type === "task") return "bg-violet-100 text-violet-800 border-violet-200";
//   return "bg-white text-slate-800 border-slate-200";
// };

//   const normalizeStepsFromBackend = (stepsRaw) => {
//     const steps = Array.isArray(stepsRaw) ? stepsRaw : [];

//     return steps.map((s) => {
//       if (s?.type !== "survey") return s;

//       const questions = s.questions || s.config?.questions || [];
//       const title =
//         s.title ||
//         (s.survey_type
//           ? `${String(s.survey_type).toUpperCase()} Questionnaire`
//           : "Survey");

//       return {
//         ...s,
//         title,
//         subtitle: `${Array.isArray(questions) ? questions.length : 0} questions`,
//         config: {
//           ...(s.config || {}),
//           survey_type: s.survey_type || s.config?.survey_type,
//           questions: Array.isArray(questions) ? questions : [],
//           intro: s.config?.intro || "",
//           randomize_questions: s.config?.randomize_questions || false,
//           require_all_questions: s.config?.require_all_questions ?? true,
//         },
//       };
//     });
//   };

//   const buildPrototypeFlow = (stepsFromState) => {
//     const steps = Array.isArray(stepsFromState) ? stepsFromState : [];

//     const hasAllBase = ["welcome", "consent", "chatbot", "thankyou"].every((sid) =>
//       steps.some((s) => s.id === sid)
//     );

//     if (hasAllBase) return steps;

//     const surveys = steps.filter((s) => s.type === "survey");

//     const base = [
//       {
//         id: "welcome",
//         title: "Welcome Message",
//         subtitle: "Greet participants",
//         type: "info",
//         config: { welcomeTitle: "", welcomeMessage: "" },
//       },
//       {
//         id: "consent",
//         title: "Informed Consent",
//         subtitle: "Get participant agreement",
//         type: "consent",
//         config: { message: "" },
//       },
//       {
//         id: "chatbot",
//         title: "Chatbot Interaction",
//         subtitle: "Main experiment task",
//         type: "task",
//         config: { message: "" },
//       },
//       {
//         id: "thankyou",
//         title: "Thank You",
//         subtitle: "Completion message",
//         type: "info",
//         config: { message: "" },
//       },
//     ];

//     const out = [];
//     for (const b of base) {
//       out.push(b);
//       if (b.id === "chatbot") out.push(...surveys);
//     }
//     return out;
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("No authentication token");
//       setLoading(false);
//       return;
//     }

//     const headers = { Authorization: `Bearer ${token}` };

//     const loadAll = async () => {
//       try {
//         const [expRes, botsRes, partsRes] = await Promise.allSettled([
//           fetch(`${API_URL}/experiments/${id}`, { headers }),
//           fetch(`${API_URL}/chatbots`, { headers }),
//           fetch(`${API_URL}/experiments/${id}/participants`, { headers }),
//         ]);

//         // ----- Experiment -----
//         if (expRes.status === "fulfilled") {
//           const res = expRes.value;
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           const data = await res.json();

//           let stepsRaw = [];
//           if (Array.isArray(data.steps)) {
//             stepsRaw = data.steps;
//           } else if (typeof data.steps === "string") {
//             try {
//               stepsRaw = JSON.parse(data.steps || "[]");
//             } catch {
//               stepsRaw = [];
//             }
//           }

//           const normalized = normalizeStepsFromBackend(stepsRaw);
//           const finalSteps = buildPrototypeFlow(normalized);

//           setExperiment({ ...data, steps: finalSteps });
//         } else {
//           throw new Error("Experiment request failed");
//         }

//         // ----- Chatbots map -----
//         if (botsRes.status === "fulfilled") {
//           const res = botsRes.value;
//           const bots = res.ok ? await res.json() : [];
//           const map = {};
//           (bots || []).forEach((b) => (map[String(b.id)] = b.name));
//           setChatbotMap(map);
//         } else {
//           setChatbotMap({});
//         }

//         // ----- Participants -----
//         if (partsRes.status === "fulfilled") {
//           const res = partsRes.value;
//           const list = res.ok ? await res.json() : [];
//           setParticipants(Array.isArray(list) ? list : []);
//         } else {
//           setParticipants([]);
//         }
//       } catch (e) {
//         setError(`Failed to load experiment: ${e.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAll();
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
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 {experiment.title}
//               </h1>
//               <p className="text-gray-600">
//                 {experiment.description || "No description provided"}
//               </p>
//             </div>
//             <span
//               className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
//                 experiment.status
//               )}`}
//             >
//               {experiment.status}
//             </span>
//           </div>

//           <div className="mt-4 space-y-1 text-sm text-gray-700">
//             {experiment.chatbot_id_a && (
//               <div>
//                 <span className="font-semibold">Chatbot A:</span>{" "}
//                 {chatbotMap[String(experiment.chatbot_id_a)] ||
//                   `ID ${experiment.chatbot_id_a}`}
//               </div>
//             )}

//             {experiment.chatbot_id_b && (
//               <div>
//                 <span className="font-semibold">Chatbot B:</span>{" "}
//                 {chatbotMap[String(experiment.chatbot_id_b)] ||
//                   `ID ${experiment.chatbot_id_b}`}
//               </div>
//             )}

//             {experiment.external_chatbot_url && (
//               <div className="text-purple-700">
//                 <span className="font-semibold">External URL:</span>{" "}
//                 {experiment.external_chatbot_url}
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 mt-8">
//             <div className="bg-gray-50 p-6 rounded-xl">
//               <p className="text-sm text-gray-600 mb-2">Total Participants</p>
//               <p className="text-4xl font-bold text-gray-800">
//                 {participants.length}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl">
//               <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
//               <p className="text-4xl font-bold text-gray-800">
//                 {completionRate}%
//               </p>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl">
//               <p className="text-sm text-gray-600 mb-2">Created</p>
//               <p className="text-xl font-bold text-gray-800">
//                 {formatDate(experiment.created_at)}
//               </p>
//             </div>
//           </div>

//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//             Experiment Flow ({experiment.steps.length}{" "}
//             {experiment.steps.length === 1 ? "step" : "steps"})
//           </h2>

//           <div className="space-y-6">
//             {experiment.steps.length === 0 ? (
//               <div className="text-center py-16 bg-gray-50 rounded-2xl">
//                 <p className="text-xl text-gray-500">No steps configured yet.</p>
//                 <p className="text-gray-400 mt-2">
//                   Add steps in the experiment configuration.
//                 </p>
//               </div>
//             ) : (
//               experiment.steps.map((step, index) => {
//   return (
//     <div
//       key={step.id || index}
//       className={`rounded-2xl p-6 flex items-start gap-6 hover:shadow-md transition border ${getStepTint(step)}`}
//     >
//       {/* Number only (replaces icon) */}
//       <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getNumberTint(step)}`}>
//          <span className="text-lg font-bold">{index + 1}</span>
//       </div>

//       <div className="flex-1">
//         <h3 className="text-xl font-semibold text-gray-800">
//           {step.title || "Untitled Step"}
//         </h3>

//         {step.subtitle && (
//           <p className="text-gray-600 mt-1">{step.subtitle}</p>
//         )}

//         {step.survey_type && (
//           <div className="mt-3 inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
//             Survey: {String(step.survey_type).toUpperCase()}
//           </div>
//         )}

//         {(step.id === "chatbot" || step.type === "task") &&
//           experiment.external_chatbot_url && (
//             <p className="text-sm text-purple-700 mt-2">
//               External URL: {experiment.external_chatbot_url}
//             </p>
//           )}
//       </div>
//     </div>
//   );
// })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/ExperimentDetail.jsx
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
  const [chatbotMap, setChatbotMap] = useState({});

 const getStepTint = () => {
  return "bg-purple-50 border-purple-200";
};

const getNumberTint = () => {
  return "bg-purple-600 text-white border-purple-600";
};

  const normalizeStepsFromBackend = (stepsRaw) => {
    const steps = Array.isArray(stepsRaw) ? stepsRaw : [];

    return steps.map((s) => {
      if (s?.type !== "survey") return s;

      const questions = s.questions || s.config?.questions || [];
      const title =
        s.title ||
        (s.survey_type
          ? `${String(s.survey_type).toUpperCase()} Questionnaire`
          : "Survey");

      return {
        ...s,
        title,
        subtitle: `${Array.isArray(questions) ? questions.length : 0} questions`,
        config: {
          ...(s.config || {}),
          survey_type: s.survey_type || s.config?.survey_type,
          questions: Array.isArray(questions) ? questions : [],
          intro: s.config?.intro || "",
          randomize_questions: s.config?.randomize_questions || false,
          require_all_questions: s.config?.require_all_questions ?? true,
        },
      };
    });
  };

  const buildPrototypeFlow = (stepsFromState) => {
    const steps = Array.isArray(stepsFromState) ? stepsFromState : [];

    const hasAllBase = ["welcome", "consent", "chatbot", "thankyou"].every((sid) =>
      steps.some((s) => s.id === sid)
    );

    if (hasAllBase) return steps;

    const surveys = steps.filter((s) => s.type === "survey");

    const base = [
      {
        id: "welcome",
        title: "Welcome Message",
        subtitle: "Greet participants",
        type: "info",
        config: { welcomeTitle: "", welcomeMessage: "" },
      },
      {
        id: "consent",
        title: "Informed Consent",
        subtitle: "Get participant agreement",
        type: "consent",
        config: { message: "" },
      },
      {
        id: "chatbot",
        title: "Chatbot Interaction",
        subtitle: "Main experiment task",
        type: "task",
        config: { message: "" },
      },
      {
        id: "thankyou",
        title: "Thank You",
        subtitle: "Completion message",
        type: "info",
        config: { message: "" },
      },
    ];

    const out = [];
    for (const b of base) {
      out.push(b);
      if (b.id === "chatbot") out.push(...surveys);
    }
    return out;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const loadAll = async () => {
      try {
        const [expRes, botsRes, partsRes] = await Promise.allSettled([
          fetch(`${API_URL}/experiments/${id}`, { headers }),
          fetch(`${API_URL}/chatbots`, { headers }),
          fetch(`${API_URL}/experiments/${id}/participants`, { headers }),
        ]);

        // ----- Experiment -----
        if (expRes.status === "fulfilled") {
          const res = expRes.value;
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          let stepsRaw = [];
          if (Array.isArray(data.steps)) {
            stepsRaw = data.steps;
          } else if (typeof data.steps === "string") {
            try {
              stepsRaw = JSON.parse(data.steps || "[]");
            } catch {
              stepsRaw = [];
            }
          }

          const normalized = normalizeStepsFromBackend(stepsRaw);
          const finalSteps = buildPrototypeFlow(normalized);

          setExperiment({ ...data, steps: finalSteps });
        } else {
          throw new Error("Experiment request failed");
        }

        // ----- Chatbots map -----
        if (botsRes.status === "fulfilled") {
          const res = botsRes.value;
          const bots = res.ok ? await res.json() : [];
          const map = {};
          (bots || []).forEach((b) => (map[String(b.id)] = b.name));
          setChatbotMap(map);
        } else {
          setChatbotMap({});
        }

        // ----- Participants -----
        if (partsRes.status === "fulfilled") {
          const res = partsRes.value;
          const list = res.ok ? await res.json() : [];
          setParticipants(Array.isArray(list) ? list : []);
        } else {
          setParticipants([]);
        }
      } catch (e) {
        setError(`Failed to load experiment: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {experiment.title}
              </h1>
              <p className="text-gray-600">
                {experiment.description || "No description provided"}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                experiment.status
              )}`}
            >
              {experiment.status}
            </span>
          </div>

          <div className="mt-4 space-y-1 text-sm text-gray-700">
            {experiment.chatbot_id_a && (
              <div>
                <span className="font-semibold">Chatbot A:</span>{" "}
                {chatbotMap[String(experiment.chatbot_id_a)] ||
                  `ID ${experiment.chatbot_id_a}`}
              </div>
            )}

            {experiment.chatbot_id_b && (
              <div>
                <span className="font-semibold">Chatbot B:</span>{" "}
                {chatbotMap[String(experiment.chatbot_id_b)] ||
                  `ID ${experiment.chatbot_id_b}`}
              </div>
            )}

            {experiment.external_chatbot_url && (
              <div className="text-purple-700">
                <span className="font-semibold">External URL:</span>{" "}
                {experiment.external_chatbot_url}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 mt-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Total Participants</p>
              <p className="text-4xl font-bold text-gray-800">
                {participants.length}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
              <p className="text-4xl font-bold text-gray-800">
                {completionRate}%
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Created</p>
              <p className="text-xl font-bold text-gray-800">
                {formatDate(experiment.created_at)}
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Experiment Flow ({experiment.steps.length}{" "}
            {experiment.steps.length === 1 ? "step" : "steps"})
          </h2>

          <div className="space-y-6">
            {experiment.steps.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <p className="text-xl text-gray-500">No steps configured yet.</p>
                <p className="text-gray-400 mt-2">
                  Add steps in the experiment configuration.
                </p>
              </div>
            ) : (
              experiment.steps.map((step, index) => {
  return (
    <div
      key={step.id || index}
      className={`rounded-2xl p-6 flex items-start gap-6 hover:shadow-md transition border ${getStepTint(step)}`}
    >
      {/* Number only (replaces icon) */}
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getNumberTint(step)}`}>
         <span className="text-lg font-bold">{index + 1}</span>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800">
          {step.title || "Untitled Step"}
        </h3>

        {step.subtitle && (
          <p className="text-gray-600 mt-1">{step.subtitle}</p>
        )}

        {step.survey_type && (
          <div className="mt-3 inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Survey: {String(step.survey_type).toUpperCase()}
          </div>
        )}

        {(step.id === "chatbot" || step.type === "task") &&
          experiment.external_chatbot_url && (
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

