
// // src/pages/SurveyTemplatePage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { ArrowLeft, Check, AlertCircle } from "lucide-react";

// const SURVEYS = [
//   {
//     key: "SUS",
//     title: "System Usability Scale (SUS)",
//     desc: "Gold-standard 10-item questionnaire for perceived usability",
//     questions: 10,
//     time: "2–5 minutes",
//     color: "from-blue-500 to-cyan-500",
//   },
//   {
//     key: "CUQ",
//     title: "Chatbot Usability Questionnaire (CUQ)",
//     desc: "Validated specifically for conversational AI and chatbots",
//     questions: 16,
//     time: "3–6 minutes",
//     color: "from-emerald-500 to-teal-500",
//   },
//   {
//     key: "AttrakDiff",
//     title: "AttrakDiff",
//     desc: "Measures pragmatic quality, hedonic appeal, and attractiveness",
//     questions: 28,
//     time: "5–8 minutes",
//     color: "from-purple-500 to-pink-500",
//   },
// ];

// export default function SurveyTemplatePage() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const experimentId = searchParams.get("experimentId");

//   const [selected, setSelected] = useState("SUS");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Auto-detect if experiment exists
//   const [experimentExists, setExperimentExists] = useState(true);

//   useEffect(() => {
//     if (!experimentId || experimentId === "new") {
//       setExperimentExists(false);
//     } else {
//       setExperimentExists(true);
//     }
//   }, [experimentId]);

//   const addToFlow = async () => {
//     if (loading) return;
//     setLoading(true);
//     setError("");

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Session expired. Please log in again.");
//       navigate("/auth");
//       return;
//     }

//     if (!experimentId || experimentId === "new") {
//       setError("Save your experiment first in the Configuration tab!");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:8000/experiments/${experimentId}/add-survey`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ survey_type: selected }),
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(errData.detail || "Failed to add survey");
//       }

//       const data = await res.json();
//       console.log("Survey added:", data);

//       // Success! Go back and refresh flow
//       navigate(-1);
//     } catch (err) {
//       console.error("Add survey error:", err);
//       setError(err.message || "Could not add survey. Is the experiment saved?");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/50 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
//           <div className="flex items-center gap-5">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-4 hover:bg-gray-100 rounded-2xl transition"
//             >
//               <ArrowLeft className="w-7 h-7" />
//             </button>
//             <div>
//               <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Add Validated Questionnaire
//               </h1>
//               <p className="text-gray-600 mt-1">Choose a gold-standard UX scale</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Warning Banner if experiment not saved */}
//       {!experimentExists && (
//         <div className="max-w-7xl mx-auto px-8 mt-6">
//           <div className="bg-orange-100 border-2 border-orange-400 text-orange-800 px-6 py-4 rounded-2xl flex items-center gap-4">
//             <AlertCircle className="w-8 h-8" />
//             <div>
//               <p className="font-bold">Experiment Not Saved Yet</p>
//               <p>You must save your experiment in the Configuration tab before adding surveys.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-8 py-12">
//         <div className="grid lg:grid-cols-3 gap-10">
//           {/* Survey Cards */}
//           <div className="lg:col-span-2 space-y-8">
//             {SURVEYS.map((s) => (
//               <div
//                 key={s.key}
//                 onClick={() => setSelected(s.key)}
//                 className={`relative bg-white rounded-3xl shadow-2xl border-4 p-10 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-3xl ${
//                   selected === s.key
//                     ? "border-indigo-500 ring-8 ring-indigo-100"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <h3 className="text-4xl font-black text-gray-900">{s.title}</h3>
//                     <p className="text-gray-700 mt-3 text-xl leading-relaxed">{s.desc}</p>
//                   </div>
//                   {selected === s.key && (
//                     <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
//                       <Check className="w-10 h-10 text-white" />
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex gap-12 text-2xl font-bold text-gray-700">
//                   <span>{s.questions} questions</span>
//                   <span>{s.time}</span>
//                 </div>
//                 <div className={`h-3 mt-8 bg-gradient-to-r ${s.color} rounded-b-3xl`} />
//               </div>
//             ))}
//           </div>

//           {/* Preview + Add */}
//           <div className="lg:col-span-1">
//             <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-3xl p-10 sticky top-32 border-4 border-indigo-100">
//               <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Preview
//               </h2>

//               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 mb-10 border-4 border-indigo-200">
//                 <p className="font-bold text-indigo-900 mb-6 text-xl">Sample Question</p>
//                 <p className="text-gray-800 text-2xl font-medium leading-relaxed mb-10">
//                   {selected === "SUS" && "I think that I would like to use this chatbot frequently."}
//                   {selected === "CUQ" && "The chatbot understood my intentions very well."}
//                   {selected === "AttrakDiff" && "The chatbot is pleasant – unpleasant"}
//                 </p>
//                 <div className="space-y-6">
//                   {["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"].map((opt, i) => (
//                     <label key={opt} className="flex items-center gap-5 cursor-pointer group">
//                       <input
//                         type="radio"
//                         name="preview"
//                         className="w-8 h-8 text-indigo-600 focus:ring-indigo-500"
//                         defaultChecked={i === 2}
//                       />
//                       <span className="text-xl text-gray-800 group-hover:text-indigo-700 transition">
//                         {opt}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {error && (
//                 <div className="mb-6 p-6 bg-red-100 border-2 border-red-400 text-red-800 rounded-2xl flex items-center gap-4">
//                   <AlertCircle className="w-8 h-8" />
//                   <p className="font-medium">{error}</p>
//                 </div>
//               )}

//               <button
//                 onClick={addToFlow}
//                 disabled={loading || !experimentExists}
//                 className={`w-full py-8 text-2xl font-black rounded-3xl shadow-3xl transition-all flex items-center justify-center gap-5 ${
//                   loading || !experimentExists
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105"
//                 }`}
//               >
//                 {loading ? (
//                   <>Adding...</>
//                 ) : (
//                   <>
//                     <Check className="w-10 h-10" />
//                     Add {selected} to Experiment
//                   </>
//                 )}
//               </button>

//               {!experimentExists && (
//                 <p className="text-center mt-6 text-red-600 font-bold text-lg">
//                   Save experiment first → Config tab → "Launch"
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }