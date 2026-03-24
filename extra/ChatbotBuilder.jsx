
  // // // src/pages/ChatbotBuilder.jsx — FINAL PERFECT & COMPILABLE (2025)
  // // import React, { useState, useRef } from "react";
  // // import { useNavigate } from "react-router-dom";
  // // import {
  // //   ArrowLeft, Sparkles, Upload, Link2, FileText,
  // //   Mic, Paperclip, Send, Copy, Check, Globe, Bot, Trash2, Plus,
  // //   Monitor, Smartphone, Eye, Palette, ChevronRight, Image as ImageIcon
  // // } from "lucide-react";

  // // const templates = [
  // //   { id: "support", name: "Customer Support", desc: "FAQs, tickets, live help", color: "#3b82f6" },
  // //   { id: "ecommerce", name: "E-commerce", desc: "Shopping assistant, order tracking", color: "#8b5cf6" },
  // //   { id: "appointment", name: "Appointment", desc: "Book meetings & consultations", color: "#10b981" },
  // //   { id: "recruit", name: "Recruitment", desc: "Candidate screening & scheduling", color: "#f59e0b" },
  // //   { id: "feedback", name: "Feedback", desc: "Collect reviews & NPS", color: "#ec4899" },
  // // ];

  // // const defaultAvatars = [
  // //   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1555952517-af35707b4c13?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1554151228-14d9def65654?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  // // ];

  // // export default function ChatbotBuilder() {
  // //   const navigate = useNavigate();
  // //   const fileInputRef = useRef(null);

  // //   const [step, setStep] = useState("template");
  // //   const [selectedTemplate, setSelectedTemplate] = useState("ecommerce");
  // //   const [agentName, setAgentName] = useState("Mila");
  // //   const [agentRole, setAgentRole] = useState("E-commerce Shopping Assistant");
  // //   const [greetingMessage, setGreetingMessage] = useState("Hello! I'm Mila, your friendly AI agent. How can I help you today?");
  // //   const [agentAvatar, setAgentAvatar] = useState(defaultAvatars[4]);
  // //   const [headerColor, setHeaderColor] = useState("#8b5cf6");
  // //   const [botBubbleColor, setBotBubbleColor] = useState("#8b5cf6");
  // //   const [borderRadius, setBorderRadius] = useState(28);
  // //   const [previewMode, setPreviewMode] = useState("desktop");

  // //   const [knowledgeText, setKnowledgeText] = useState("");
  // //   const [websiteUrl, setWebsiteUrl] = useState("");
  // //   const [uploadedFiles, setUploadedFiles] = useState([]);
  // //   const [qaPairs, setQaPairs] = useState([{ question: "", answer: "" }]);

  // //   const [messages, setMessages] = useState([]);
  // //   const [input, setInput] = useState("");
  // //   const [isRecording, setIsRecording] = useState(false);
  // //   const [copiedEmbed, setCopiedEmbed] = useState(false);
  // //   const [copiedLink, setCopiedLink] = useState(false);

  // //   const embedId = "cb_" + Math.random().toString(36).substr(2, 9);
  // //   const embedUrl = `https://yourchatbot.com/c/${embedId}`;
  // //   const embedCode = `<script src="https://cdn.yourchatbot.com/embed.js"></script>
  // // <script>
  // //   Chatbot.init({
  // //     id: "${embedId}",
  // //     name: "${agentName}",
  // //     role: "${agentRole}",
  // //     avatar: "${agentAvatar}",
  // //     color: "${headerColor}",
  // //     greeting: "${greetingMessage.replace(/"/g, '\\"')}"
  // //   });
  // // </script>`;

  // //   const handleAvatarUpload = (e) => {
  // //     const file = e.target.files[0];
  // //     if (file) {
  // //       const reader = new FileReader();
  // //       reader.onload = (ev) => setAgentAvatar(ev.target.result);
  // //       reader.readAsDataURL(file);
  // //     }
  // //   };

  // //   const handleKnowledgeUpload = (e) => {
  // //     const files = Array.from(e.target.files);
  // //     setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }))]);
  // //   };

  // //   const addQAPair = () => setQaPairs(prev => [...prev, { question: "", answer: "" }]);
  // //   const updateQAPair = (i, field, val) => setQaPairs(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  // //   const sendMessage = () => {
  // //     if (!input.trim()) return;
  // //     setMessages(prev => [...prev, { text: input, sender: "user" }]);
  // //     setTimeout(() => {
  // //       setMessages(prev => [...prev, { text: "Thanks for your message! I'm trained on your knowledge base.", sender: "bot" }]);
  // //     }, 1000);
  // //     setInput("");
  // //   };

  // //   const startVoice = () => {
  // //     setIsRecording(true);
  // //     setTimeout(() => {
  // //       setInput("Can you help me track my order?");
  // //       setIsRecording(false);
  // //     }, 2500);
  // //   };

  // //   const copyEmbed = () => { navigator.clipboard.writeText(embedCode); setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); };
  // //   const copyLink = () => { navigator.clipboard.writeText(embedUrl); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); };

  // //   // CLEAN CHATBOT PREVIEW — NO BLINKING
  // //   const ChatbotPreview = () => (
  // //     <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
  // //       <div className="p-6 text-center" style={{ backgroundColor: headerColor }}>
  // //         <img src={agentAvatar} alt={agentName} className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-xl" />
  // //         <h3 className="text-xl font-bold text-white mt-4">{agentName}</h3>
  // //         <p className="text-sm text-white/90">{agentRole}</p>
  // //       </div>

  // //       <div className="p-6 space-y-6 min-h-80 max-h-96 overflow-y-auto bg-gray-50">
  // //         <div className="max-w-xs ml-auto">
  // //           <div className="p-5 rounded-3xl text-white shadow-lg" style={{ backgroundColor: botBubbleColor, borderRadius: `${borderRadius}px` }}>
  // //             <p className="text-sm">{greetingMessage}</p>
  // //           </div>
  // //         </div>
  // //         {messages.map((m, i) => (
  // //           <div key={i} className={m.sender === "user" ? "max-w-xs ml-auto" : "max-w-xs"}>
  // //             <div
  // //               className={`p-4 rounded-3xl shadow-md text-sm ${m.sender === "user" ? "bg-gray-200" : ""}`}
  // //               style={m.sender === "bot" ? { backgroundColor: botBubbleColor, color: "white", borderRadius: `${borderRadius}px` } : { borderRadius: `${borderRadius}px` }}
  // //             >
  // //               {m.text}
  // //             </div>
  // //           </div>
  // //         ))}
  // //       </div>

  // //       <div className="p-4 border-t bg-white">
  // //         <div className="flex items-center gap-2">
  // //           <button className="p-2 hover:bg-gray-100 rounded-full"><Paperclip className="w-5 h-5 text-gray-600" /></button>
  // //           <input
  // //             type="text"
  // //             value={input}
  // //             onChange={(e) => setInput(e.target.value)}
  // //             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
  // //             placeholder="Type a message..."
  // //             className="flex-1 px-4 py-3 rounded-full border text-sm focus:outline-none focus:border-purple-400"
  // //           />
  // //           <button onClick={startVoice} className={`p-3 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-100"}`}>
  // //             <Mic className="w-5 h-5" />
  // //           </button>
  // //           <button onClick={sendMessage} className="p-3 bg-purple-600 text-white rounded-full shadow-lg">
  // //             <Send className="w-5 h-5" />
  // //           </button>
  // //         </div>
  // //       </div>
  // //     </div>
  // //   );

  // //   return (
  // //     <>
  // //       <header className="bg-white border-b sticky top-0 z-50 shadow-lg">
  // //         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
  // //           <div className="flex items-center gap-6">
  // //             <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-100 rounded-xl transition">
  // //               <ArrowLeft className="w-6 h-6" />
  // //             </button>
  // //             <div>
  // //               <h1 className="text-2xl font-bold flex items-center gap-3">
  // //                 <Sparkles className="w-8 h-8 text-purple-600" />
  // //                 AI Chatbot Builder
  // //               </h1>
  // //               <p className="text-sm text-gray-500">Professional • No-code • Beats Jotform AI</p>
  // //             </div>
  // //           </div>
  // //           <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition">
  // //             Deploy Live
  // //           </button>
  // //         </div>

  // //         <div className="bg-gray-50 border-b">
  // //           <div className="max-w-7xl mx-auto px-6 py-4">
  // //             <div className="flex items-center justify-between text-sm font-medium">
  // //               {["template", "persona", "avatar", "knowledge", "style", "greeting", "deploy"].map((s, i) => (
  // //                 <div key={s} className={`flex items-center gap-3 ${step === s ? "text-purple-600" : "text-gray-400"}`}>
  // //                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? "bg-purple-600 text-white scale-110 shadow-lg" : "bg-gray-200"}`}>
  // //                     {i + 1}
  // //                   </div>
  // //                   <span className="hidden sm:block capitalize">{s === "deploy" ? "Share & Embed" : s}</span>
  // //                   {i < 6 && <ChevronRight className="w-5 h-5 text-gray-300" />}
  // //                 </div>
  // //               ))}
  // //             </div>
  // //           </div>
  // //         </div>
  // //       </header>

  // //       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
  // //         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6 py-10">

  // //           {/* LEFT: Builder Steps */}
  // //           <div className="space-y-8">

  // //             {step === "template" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10">
  // //                 <h2 className="text-3xl font-bold mb-8">Choose a Template</h2>
  // //                 <div className="grid grid-cols-2 gap-6">
  // //                   {templates.map(t => (
  // //                     <button
  // //                       key={t.id}
  // //                       onClick={() => {
  // //                         setSelectedTemplate(t.id);
  // //                         setHeaderColor(t.color);
  // //                         setBotBubbleColor(t.color);
  // //                         setStep("persona");
  // //                       }}
  // //                       className={`p-8 rounded-2xl border-4 transition-all ${selectedTemplate === t.id ? "border-purple-500 shadow-xl" : "border-gray-200 hover:border-gray-300"}`}
  // //                     >
  // //                       <div className="w-16 h-16 rounded-full mb-4" style={{ backgroundColor: t.color }} />
  // //                       <h3 className="font-bold text-xl">{t.name}</h3>
  // //                       <p className="text-sm text-gray-600 mt-2">{t.desc}</p>
  // //                     </button>
  // //                   ))}
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "persona" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
  // //                 <h2 className="text-3xl font-bold">AI Persona</h2>
  // //                 <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="Agent Name" className="w-full px-6 py-5 text-2xl font-bold border-2 rounded-2xl" />
  // //                 <input value={agentRole} onChange={e => setAgentRole(e.target.value)} placeholder="Role / Title" className="w-full px-6 py-5 text-xl border-2 rounded-2xl" />
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("template")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("avatar")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "avatar" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10">
  // //                 <h2 className="text-3xl font-bold mb-8">Choose Avatar</h2>
  // //                 <div className="grid grid-cols-4 gap-6 mb-8">
  // //                   {defaultAvatars.map((src, i) => (
  // //                     <button key={i} onClick={() => setAgentAvatar(src)} className={`rounded-2xl overflow-hidden border-4 ${agentAvatar === src ? "border-purple-500" : "border-gray-200"}`}>
  // //                       <img src={src} alt="" className="w-full h-full object-cover" />
  // //                     </button>
  // //                   ))}
  // //                 </div>
  // //                 <button onClick={() => fileInputRef.current.click()} className="w-full py-5 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3">
  // //                   <ImageIcon className="w-8 h-8" /> Upload Custom Avatar
  // //                 </button>
  // //                 <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
  // //                 <div className="flex gap-4 mt-8">
  // //                   <button onClick={() => setStep("persona")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("knowledge")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "knowledge" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-10">
  // //                 <h2 className="text-3xl font-bold flex items-center gap-4">
  // //                   <FileText className="w-10 h-10 text-green-600" /> Train Your AI
  // //                 </h2>
  // //                 <textarea value={knowledgeText} onChange={e => setKnowledgeText(e.target.value)} placeholder="Paste FAQs, product info..." className="w-full h-40 p-6 rounded-2xl border-2" />
  // //                 <div>
  // //                   <button onClick={() => fileInputRef.current.click()} className="w-full py-12 border-4 border-dashed rounded-3xl flex flex-col items-center gap-4">
  // //                     <Upload className="w-16 h-16 text-purple-500" />
  // //                     <span className="text-xl font-bold">Upload Documents</span>
  // //                   </button>
  // //                   <input ref={fileInputRef} type="file" multiple onChange={handleKnowledgeUpload} className="hidden" />
  // //                   {uploadedFiles.map((f, i) => (
  // //                     <div key={i} className="mt-4 p-4 bg-purple-50 rounded-xl flex justify-between items-center">
  // //                       <span>{f.name} ({f.size})</span>
  // //                       <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}><Trash2 className="w-5 h-5" /></button>
  // //                     </div>
  // //                   ))}
  // //                 </div>
  // //                 <div className="flex gap-4">
  // //                   <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://yourwebsite.com" className="flex-1 px-6 py-5 rounded-2xl border-2" />
  // //                   <button className="px-8 py-5 bg-orange-600 text-white rounded-2xl font-bold flex items-center gap-2"><Link2 /> Add</button>
  // //                 </div>
  // //                 <div>
  // //                   <div className="flex justify-between mb-4">
  // //                     <h3 className="text-2xl font-bold">Q&A Training</h3>
  // //                     <button onClick={addQAPair} className="text-purple-600 flex items-center gap-2"><Plus /> Add</button>
  // //                   </div>
  // //                   {qaPairs.map((pair, i) => (
  // //                     <div key={i} className="mb-6 space-y-4 p-6 bg-gray-50 rounded-2xl">
  // //                       <input placeholder="Question" value={pair.question} onChange={e => updateQAPair(i, "question", e.target.value)} className="w-full px-5 py-4 rounded-xl border" />
  // //                       <textarea placeholder="Answer" value={pair.answer} onChange={e => updateQAPair(i, "answer", e.target.value)} className="w-full px-5 py-4 rounded-xl border h-28 resize-none" />
  // //                     </div>
  // //                   ))}
  // //                 </div>
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("avatar")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("style")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "style" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-10">
  // //                 <h2 className="text-3xl font-bold flex items-center gap-4"><Palette className="w-10 h-10" /> Style</h2>
  // //                 <div className="grid grid-cols-2 gap-8">
  // //                   <div>
  // //                     <label className="text-lg font-bold">Header & Bot Color</label>
  // //                     <input type="color" value={headerColor} onChange={e => { setHeaderColor(e.target.value); setBotBubbleColor(e.target.value); }} className="w-24 h-24 rounded-2xl cursor-pointer mt-4" />
  // //                   </div>
  // //                   <div>
  // //                     <label className="text-lg font-bold">Border Radius: {borderRadius}px</label>
  // //                     <input type="range" min="8" max="40" value={borderRadius} onChange={e => setBorderRadius(+e.target.value)} className="w-full mt-4" />
  // //                   </div>
  // //                 </div>
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("knowledge")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("greeting")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "greeting" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
  // //                 <h2 className="text-3xl font-bold">Greeting Message</h2>
  // //                 <textarea value={greetingMessage} onChange={e => setGreetingMessage(e.target.value)} className="w-full h-48 p-8 text-xl rounded-2xl border-2" />
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("style")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("deploy")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Finish & Deploy</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "deploy" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
  // //                 <Bot className="w-24 h-24 text-purple-600 mx-auto mb-6" />
  // //                 <h2 className="text-4xl font-bold mb-4">Your AI Chatbot is LIVE!</h2>
  // //                 <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 my-10">
  // //                   <p className="text-lg mb-4">Direct Link</p>
  // //                   <div className="flex gap-4 bg-white/20 rounded-2xl p-5">
  // //                     <Globe className="w-8 h-8" />
  // //                     <input value={embedUrl} readOnly className="flex-1 bg-transparent text-white font-mono" />
  // //                     <button onClick={copyLink} className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold">
  // //                       {copiedLink ? <Check /> : "Copy"}
  // //                     </button>
  // //                   </div>
  // //                 </div>
  // //                 <pre className="bg-gray-900 text-green-400 p-8 rounded-2xl text-left font-mono text-sm overflow-x-auto mb-8">
  // //                   {embedCode}
  // //                 </pre>
  // //                 <button onClick={copyEmbed} className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4">
  // //                   {copiedEmbed ? <><Check className="w-8 h-8" /> Copied!</> : <><Copy className="w-6 h-6" /> Copy Embed Code</>}
  // //                 </button>
  // //               </div>
  // //             )}
  // //           </div>
  // //           {activeTab === "llm" && (
  // //           <LLMConfig
  // //           chatbot={currentChatbot}
  // //           onSave={(config) => {
  // //           // Save to your chatbot object
  // //           updateChatbot({ ...currentChatbot, llm_config: config });
  // //           alert("LLM connected! Your chatbot now uses real AI.");
  // //          }}
  // //         />
  // // )}

  // //           {/* RIGHT: LIVE PREVIEW WITH REAL DEVICE FRAMES */}
  // //           <div className="sticky top-24">
  // //             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
  // //               <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
  // //                 <div className="flex items-center gap-4">
  // //                   <Eye className="w-6 h-6" />
  // //                   <span className="text-xl font-bold">Live Preview</span>
  // //                 </div>
  // //                 <div className="flex bg-white/20 rounded-xl p-2 gap-2">
  // //                   <button
  // //                     onClick={() => setPreviewMode("desktop")}
  // //                     className={`px-5 py-3 rounded-lg flex items-center gap-2 transition ${previewMode === "desktop" ? "bg-white text-purple-600" : "text-white/80"}`}
  // //                   >
  // //                     <Monitor className="w-5 h-5" /> Desktop
  // //                   </button>
  // //                   <button
  // //                     onClick={() => setPreviewMode("mobile")}
  // //                     className={`px-5 py-3 rounded-lg flex items-center gap-2 transition ${previewMode === "mobile" ? "bg-white text-purple-600" : "text-white/80"}`}
  // //                   >
  // //                     <Smartphone className="w-5 h-5" /> Mobile
  // //                   </button>
  // //                 </div>
  // //               </div>

  // //               <div className="p-10 bg-gray-50">
  // //                 {previewMode === "mobile" && (
  // //                   <div className="mx-auto w-80 relative">
  // //                     <div className="absolute inset-0 bg-black rounded-3xl shadow-2xl"></div>
  // //                     <div className="relative bg-white rounded-3xl overflow-hidden border-8 border-black">
  // //                       <div className="bg-gray-200 h-6 rounded-t-2xl relative">
  // //                         <div className="absolute top-1 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-full"></div>
  // //                       </div>
  // //                       <div className="h-96 overflow-hidden">
  // //                         <ChatbotPreview />
  // //                       </div>
  // //                     </div>
  // //                   </div>
  // //                 )}

  // //                 {previewMode === "desktop" && (
  // //                   <div className="mx-auto w-full max-w-4xl">
  // //                     <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-4 shadow-2xl">
  // //                       <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
  // //                         <div className="bg-gray-300 h-8 flex items-center px-4 gap-3">
  // //                           <div className="flex gap-2">
  // //                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
  // //                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
  // //                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
  // //                           </div>
  // //                         </div>
  // //                         <div className="bg-white p-8">
  // //                           <div className="max-w-2xl mx-auto">
  // //                             <ChatbotPreview />
  // //                           </div>
  // //                         </div>
  // //                       </div>
  // //                     </div>
  // //                   </div>
  // //                 )}
  // //               </div>
  // //             </div>
  // //           </div>
  // //         </div>
  // //       </div>
  // //     </>
  // //   );
  // // }

  // // // src/pages/ChatbotBuilder.jsx — FINAL FIXED & PERFECT (NO ERRORS)
  // // import React, { useState, useRef } from "react";
  // // import { useNavigate } from "react-router-dom";
  // // import {
  // //   ArrowLeft, Sparkles, Upload, Link2, FileText,
  // //   Mic, Paperclip, Send, Copy, Check, Globe, Bot, Trash2, Plus,
  // //   Monitor, Smartphone, Eye, Palette, ChevronRight, Image as ImageIcon
  // // } from "lucide-react";

  // // // const templates = [
  // // //   { id: "support", name: "Customer Support", desc: "FAQs, tickets, live help", color: "#3b82f6" },
  // // //   { id: "ecommerce", name: "E-commerce", desc: "Shopping assistant, order tracking", color: "#8b5cf6" },
  // // //   { id: "appointment", name: "Appointment", desc: "Book meetings & consultations", color: "#10b981" },
  // // //   { id: "recruit", name: "Recruitment", desc: "Candidate screening & scheduling", color: "#f59e0b" },
  // // //   { id: "feedback", name: "Feedback", desc: "Collect reviews & NPS", color: "#ec4899" },
  // // // ];
  // // const templates = [
  // //   { 
  // //     id: "support", 
  // //     name: "Customer Support", 
  // //     desc: "FAQs, tickets, live help", 
  // //     color: "#3b82f6",
  // //     agentName: "Emma",
  // //     agentRole: "Customer Support Agent",
  // //     greeting: "Hi there! I'm Emma, your support assistant. How can I help you today?"
  // //   },
  // //   { 
  // //     id: "ecommerce", 
  // //     name: "E-commerce", 
  // //     desc: "Shopping assistant, order tracking", 
  // //     color: "#8b5cf6",
  // //     agentName: "Mila",
  // //     agentRole: "Shopping Assistant",
  // //     greeting: "Hey! I'm Mila, your personal shopping assistant. What are you looking for today?"
  // //   },
  // //   { 
  // //     id: "appointment", 
  // //     name: "Appointment", 
  // //     desc: "Book meetings & consultations", 
  // //     color: "#10b981",
  // //     agentName: "Sarah",
  // //     agentRole: "Scheduling Assistant",
  // //     greeting: "Hello! I'm Sarah, here to help you book appointments. What time works for you?"
  // //   },
  // //   { 
  // //     id: "recruit", 
  // //     name: "Recruitment", 
  // //     desc: "Candidate screening & scheduling", 
  // //     color: "#f59e0b",
  // //     agentName: "Alex",
  // //     agentRole: "Recruitment Specialist",
  // //     greeting: "Hi! I'm Alex from HR. I'd love to learn more about your experience. Shall we start?"
  // //   },
  // //   { 
  // //     id: "feedback", 
  // //     name: "Feedback", 
  // //     desc: "Collect reviews & NPS", 
  // //     color: "#ec4899",
  // //     agentName: "Lily",
  // //     agentRole: "Feedback Assistant",
  // //     greeting: "Hi! I'm Lily. We’d love to hear your thoughts — it only takes 30 seconds!"
  // //   },
  // // ];

  // // // const defaultAvatars = [
  // // //   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  // // //   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  // // //   "https://images.unsplash.com/photo-1555952517-af35707b4c13?w=120&h=120&fit=crop&crop=face",
  // // //   "https://images.unsplash.com/photo-1554151228-14d9def65654?w=120&h=120&fit=crop&crop=face",
  // // //   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  // // //   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  // // // ];
  // // const defaultAvatars = [
  // //   // === PROFESSIONAL HUMANS ===
  // //   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  // //   "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",

  // //   // === GORGEOUS ILLUSTRATED HUMANS (Open Peeps + Avataaars Pro) ===
  // //   "https://api.dicebear.com/8.x/open-peeps/svg?seed=Sarah&face=smile&backgroundColor=f8f9fa",
  // //   "https://api.dicebear.com/8.x/open-peeps/svg?seed=Mia&face=cheeky&backgroundColor=e8f5e8",
  // //   "https://api.dicebear.com/8.x/open-peeps/svg?seed=Leo&face=calm&backgroundColor=fff3cd",
  // //   "https://api.dicebear.com/8.x/open-peeps/svg?seed=Jack&face=driven&backgroundColor=e0e7ff",

  // //   // === ANIME / KAWAII (next-gen style) ===
  // //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Kaori&size=120&backgroundColor=ff9ff3",
  // //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Yuki&size=120&backgroundColor=a29bfe",
  // //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Aiko&size=120&backgroundColor=74b9ff",

  // //   // Adventurer style – clean, modern anime
  // //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Hana&hair=short01&accessories=glasses&backgroundColor=ff9ff3",
  // //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Ryuu&hair=long02&eyes=variant07&backgroundColor=a29bfe",
  // //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Miko&hair=short02&eyes=variant09&backgroundColor=ffd93d",
  // //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Kaito&hair=short03&accessories=glasses&backgroundColor=ff6b6b",

  // //   // Adventurer-neutral (more realistic anime faces)
  // //   "https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Ayumi&hair=long&backgroundColor=f8f9fa",
  // //   "https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Haruto&hair=short&eyes=variant05&backgroundColor=e3f2fd",
  // //   "https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Yuna&hair=ponytail&accessories=glasses&backgroundColor=e8f5e8",
  // //   "https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Ren&hair=messy&backgroundColor=fff3cd",


  // //   // Lorelei – soft lofi anime girls (perfect for friendly bots)
  // //   "https://api.dicebear.com/8.x/lorelei/svg?seed=Mika&hairColor=ff6b6b&backgroundColor=ffffff",
  // //   "https://api.dicebear.com/8.x/lorelei/svg?seed=Rika&hairColor=a29bfe&backgroundColor=ffffff",
  // //   "https://api.dicebear.com/8.x/lorelei/svg?seed=Sayuri&hairColor=74b9ff&backgroundColor=ffffff",
  // //   "https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=Yui&hairColor=ffd93d",

  // //   // Big Ears – kawaii chibi anime style
  // //   "https://api.dicebear.com/8.x/big-ears/svg?seed=Choco&backgroundColor=ff9ff3",
  // //   "https://api.dicebear.com/8.x/big-ears/svg?seed=Mochi&backgroundColor=a29bfe",
  // //   "https://api.dicebear.com/8.x/big-ears-neutral/svg?seed=Pudding&backgroundColor=74b9ff",

  // //   // Dilan style – clean modern anime (very premium)
  // //   "https://api.dicebear.com/8.x/miniavs/svg?seed=FoxBoy&backgroundColor=a29bfe",

    
  // //   // === BONUS: MICRO ANIMAL-ROBOT HYBRIDS (insanely cute) ===
  // //   "https://api.dicebear.com/8.x/fun-emoji/svg?seed=robotcat&size=120",
  // //   "https://api.dicebear.com/8.x/fun-emoji/svg?seed=bunnybot&size=120",
  // //   "https://api.dicebear.com/8.x/fun-emoji/svg?seed=pandabot&size=120",
  // //   "https://api.dicebear.com/8.x/fun-emoji/svg?seed=foxrobot&size=120",

  // // ];

  // // export default function ChatbotBuilder() {
  // //   const navigate = useNavigate();
  // //   const fileInputRef = useRef(null);

  // //   const [step, setStep] = useState("template");
  // //   const [selectedTemplate, setSelectedTemplate] = useState("ecommerce");
  // //   const [agentName, setAgentName] = useState("Mila");
  // //   const [agentRole, setAgentRole] = useState("E-commerce Shopping Assistant");
  // //   const [greetingMessage, setGreetingMessage] = useState("Hello! I'm Mila, your friendly AI agent. How can I help you today?");
  // //   const [agentAvatar, setAgentAvatar] = useState(defaultAvatars[4]);
  // //   const [headerColor, setHeaderColor] = useState("#8b5cf6");
  // //   const [botBubbleColor, setBotBubbleColor] = useState("#8b5cf6");
  // //   const [borderRadius, setBorderRadius] = useState(28);
  // //   const [previewMode, setPreviewMode] = useState("desktop");

  // //   const [knowledgeText, setKnowledgeText] = useState("");
  // //   const [websiteUrl, setWebsiteUrl] = useState("");
  // //   const [uploadedFiles, setUploadedFiles] = useState([]);
  // //   const [qaPairs, setQaPairs] = useState([{ question: "", answer: "" }]);

  // //   const [messages, setMessages] = useState([]);
  // //   const [input, setInput] = useState("");
  // //   const [isTyping, setIsTyping] = useState(false);
  // //   const [isRecording, setIsRecording] = useState(false);
  // //   const [copiedEmbed, setCopiedEmbed] = useState(false);
  // //   const [copiedLink, setCopiedLink] = useState(false);

  // //   const embedId = "cb_" + Math.random().toString(36).substr(2, 9);
  // //   const embedUrl = `https://yourchatbot.com/c/${embedId}`;
  // //   const embedCode = `<script src="https://cdn.yourchatbot.com/embed.js"></script>
  // // <script>
  // //   Chatbot.init({
  // //     id: "${embedId}",
  // //     name: "${agentName}",
  // //     role: "${agentRole}",
  // //     avatar: "${agentAvatar}",
  // //     color: "${headerColor}",
  // //     greeting: "${greetingMessage.replace(/"/g, '\\"')}"
  // //   });
  // // </script>`;

  // //   const handleAvatarUpload = (e) => {
  // //     const file = e.target.files[0];
  // //     if (file) {
  // //       const reader = new FileReader();
  // //       reader.onload = (ev) => setAgentAvatar(ev.target.result);
  // //       reader.readAsDataURL(file);
  // //     }
  // //   };

  // //   const handleKnowledgeUpload = (e) => {
  // //     const files = Array.from(e.target.files);
  // //     setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }))]);
  // //   };

  // //   const addQAPair = () => setQaPairs(prev => [...prev, { question: "", answer: "" }]);
  // //   const updateQAPair = (i, field, val) => setQaPairs(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  // //   // const sendMessage = async () => {
  // //   //   if (!input.trim()) return;

  // //   //   const userMessage = input.trim();
  // //   //   setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
  // //   //   setInput("");
  // //   //   setIsTyping(true);

  // //   //   try {
  // //   //    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/llm/chat`, {
  // //   //       method: "POST",
  // //   //       headers: { "Content-Type": "application/json" },
  // //   //       body: JSON.stringify({
  // //   //         provider: "groq",
  // //   //         model: "llama3-70b-8192",
  // //   //         temperature: 0.7,
  // //   //         max_tokens: 1024,
  // //   //         messages: [
  // //   //           { role: "system", content: greetingMessage },
  // //   //           ...messages.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
  // //   //           { role: "user", content: userMessage }
  // //   //         ]
  // //   //       })
  // //   //     });

  // //   //     const data = await response.json();
  // //   //     setMessages(prev => [...prev, { text: data.response || "I'm thinking...", sender: "bot" }]);
  // //   //   } catch (err) {
  // //   //     setMessages(prev => [...prev, { text: "Sorry, I'm having connection issues.", sender: "bot" }]);
  // //   //   } finally {
  // //   //     setIsTyping(false);
  // //   //   }
  // //   // };
  // //     const sendMessage = async () => {
  // //     if (!input.trim()) return;

  // //     const userMessage = input.trim();

  // //     // Show user message instantly
  // //     setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
  // //     setInput("");
  // //     setIsTyping(true);

  // //     // Build full conversation history including the new message
  // //     const fullHistory = [
  // //       { role: "system", content: greetingMessage },
  // //       ...messages.map(m => ({
  // //         role: m.sender === "user" ? "user" : "assistant",
  // //         content: m.text
  // //       })),
  // //       { role: "user", content: userMessage }
  // //     ];

  // //     try {
  // //       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/llm/chat`, {
  // //         method: "POST",
  // //         headers: { "Content-Type": "application/json" },
  // //         body: JSON.stringify({
  // //           provider: "groq",
  // //           model: "llama3-70b-8192",
  // //           temperature: 0.7,
  // //           max_tokens: 1024,
  // //           messages: fullHistory
  // //         })
  // //       });

  // //       if (!response.ok) throw new Error("Network error");

  // //       const data = await response.json();
  // //       setMessages(prev => [...prev, { text: data.response.trim(), sender: "bot" }]);
  // //     } catch (err) {
  // //       console.error("AI Error:", err);
  // //       setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: "bot" }]);
  // //     } finally {
  // //       setIsTyping(false);
  // //     }
  // //   };

  // //   const startVoice = () => {
  // //     setIsRecording(true);
  // //     setTimeout(() => {
  // //       setInput("Can you help me track my order?");
  // //       setIsRecording(false);
  // //     }, 2500);
  // //   };

  // //   const copyEmbed = () => { 
  // //     navigator.clipboard.writeText(embedCode); 
  // //     setCopiedEmbed(true); 
  // //     setTimeout(() => setCopiedEmbed(false), 2000); 
  // //   };
    
  // //   const copyLink = () => { 
  // //     navigator.clipboard.writeText(embedUrl); 
  // //     setCopiedLink(true); 
  // //     setTimeout(() => setCopiedLink(false), 2000); 
  // //   };

  // //   const ChatbotPreview = () => (
  // //     <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
  // //       <div className="p-6 text-center" style={{ backgroundColor: headerColor }}>
  // //         <img src={agentAvatar} alt={agentName} className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-xl" />
  // //         <h3 className="text-xl font-bold text-white mt-4">{agentName}</h3>
  // //         <p className="text-sm text-white/90">{agentRole}</p>
  // //       </div>

  // //       <div className="p-6 space-y-6 min-h-80 max-h-96 overflow-y-auto bg-gray-50">
  // //         <div className="max-w-xs ml-auto">
  // //           <div 
  // //             className="p-5 rounded-3xl text-white shadow-lg" 
  // //             style={{ backgroundColor: botBubbleColor, borderRadius: `${borderRadius}px` }}
  // //           >
  // //             <p className="text-sm">{greetingMessage}</p>
  // //           </div>
  // //         </div>

  // //         {messages.map((m, i) => (
  // //           <div key={i} className={m.sender === "user" ? "max-w-xs ml-auto" : "max-w-xs"}>
  // //             <div
  // //               className={`p-4 rounded-3xl shadow-md text-sm ${m.sender === "user" ? "bg-gray-200" : ""}`}
  // //               style={
  // //                 m.sender === "bot" 
  // //                   ? { backgroundColor: botBubbleColor, color: "white", borderRadius: `${borderRadius}px` }
  // //                   : { borderRadius: `${borderRadius}px` }
  // //               }
  // //             >
  // //               {m.text}
  // //             </div>
  // //           </div>
  // //         ))}

  // //         {isTyping && (
  // //           <div className="max-w-xs">
  // //             <div className="p-4 rounded-3xl bg-gray-300 flex gap-2">
  // //               <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
  // //               <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
  // //               <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
  // //             </div>
  // //           </div>
  // //         )}
  // //       </div>

  // //       <div className="p-4 border-t bg-white">
  // //         <div className="flex items-center gap-2">
  // //           <button className="p-2 hover:bg-gray-100 rounded-full"><Paperclip className="w-5 h-5 text-gray-600" /></button>
  // //           <input
  // //             type="text"
  // //             value={input}
  // //             onChange={(e) => setInput(e.target.value)}
  // //             onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
  // //             placeholder="Type a message..."
  // //             className="flex-1 px-4 py-3 rounded-full border text-sm focus:outline-none focus:border-purple-400"
  // //           />
  // //           <button onClick={startVoice} className={`p-3 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-100"}`}>
  // //             <Mic className="w-5 h-5" />
  // //           </button>
  // //           <button onClick={sendMessage} className="p-3 bg-purple-600 text-white rounded-full shadow-lg">
  // //             <Send className="w-5 h-5" />
  // //           </button>
  // //         </div>
  // //       </div>
  // //     </div>
  // //   );

  // //   return (
  // //     <>
  // //       <header className="bg-white border-b sticky top-0 z-50 shadow-lg">
  // //         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
  // //           <div className="flex items-center gap-6">
  // //             <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-100 rounded-xl transition">
  // //               <ArrowLeft className="w-6 h-6" />
  // //             </button>
  // //             <div>
  // //               <h1 className="text-2xl font-bold flex items-center gap-3">
  // //                 <Sparkles className="w-8 h-8 text-purple-600" />
  // //                 AI Chatbot Builder
  // //               </h1>
  // //               <p className="text-sm text-gray-500">Professional Real AI</p>
  // //             </div>
  // //           </div>
  // //           <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition">
  // //             Deploy Live
  // //           </button>
  // //         </div>

  // //         <div className="bg-gray-50 border-b">
  // //           <div className="max-w-7xl mx-auto px-6 py-4">
  // //             <div className="flex items-center justify-between text-sm font-medium">
  // //               {["template", "persona", "avatar", "knowledge", "style", "greeting", "deploy"].map((s, i) => (
  // //                 <div key={s} className={`flex items-center gap-3 ${step === s ? "text-purple-600" : "text-gray-400"}`}>
  // //                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? "bg-purple-600 text-white scale-110 shadow-lg" : "bg-gray-200"}`}>
  // //                     {i + 1}
  // //                   </div>
  // //                   <span className="hidden sm:block capitalize">{s === "deploy" ? "Share & Embed" : s}</span>
  // //                   {i < 6 && <ChevronRight className="w-5 h-5 text-gray-300" />}
  // //                 </div>
  // //               ))}
  // //             </div>
  // //           </div>
  // //         </div>
  // //       </header>

  // //       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
  // //         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6 py-10">
  // //           <div className="space-y-8">
  // //             {/* {step === "template" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10">
  // //                 <h2 className="text-3xl font-bold mb-8">Choose a Template</h2>
  // //                 <div className="grid grid-cols-2 gap-6">
  // //                   {templates.map(t => (
  // //                     <button
  // //                       key={t.id}
  // //                       onClick={() => {
  // //                         setSelectedTemplate(t.id);
  // //                         setHeaderColor(t.color);
  // //                         setBotBubbleColor(t.color);
  // //                         setStep("persona");
  // //                       }}
  // //                       className={`p-8 rounded-2xl border-4 transition-all ${selectedTemplate === t.id ? "border-purple-500 shadow-xl" : "border-gray-200 hover:border-gray-300"}`}
  // //                     >
  // //                       <div className="w-16 h-16 rounded-full mb-4" style={{ backgroundColor: t.color }} />
  // //                       <h3 className="font-bold text-xl">{t.name}</h3>
  // //                       <p className="text-sm text-gray-600 mt-2">{t.desc}</p>
  // //                     </button>
  // //                   ))}
  // //                 </div>
  // //               </div>
  // //             )} */}
  // //             {step === "template" && (
  // //   <div className="bg-white rounded-3xl shadow-2xl p-10">
  // //     <h2 className="text-3xl font-bold mb-8">Choose a Template</h2>
  // //     <div className="grid grid-cols-2 gap-6">
  // //       {templates.map(t => (
  // //         <button
  // //           key={t.id}
  // //           onClick={() => {
  // //             setSelectedTemplate(t.id);
  // //             setHeaderColor(t.color);
  // //             setBotBubbleColor(t.color);
  // //             setAgentName(t.agentName || "Assistant");
  // //             setAgentRole(t.agentRole || "AI Assistant");
  // //             setGreetingMessage(t.greeting || `Hello! I'm your ${t.name.toLowerCase()} assistant. How can I help you today?`);
  // //             setStep("persona");
  // //           }}
  // //           className={`p-8 rounded-2xl border-4 transition-all ${selectedTemplate === t.id ? "border-purple-500 shadow-xl" : "border-gray-200 hover:border-gray-300"}`}
  // //         >
  // //           <div className="w-16 h-16 rounded-full mb-4" style={{ backgroundColor: t.color }} />
  // //           <h3 className="font-bold text-xl">{t.name}</h3>
  // //           <p className="text-sm text-gray-600 mt-2">{t.desc}</p>
  // //         </button>
  // //       ))}
  // //     </div>
  // //   </div>
  // // )}

  // //             {step === "persona" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
  // //                 <h2 className="text-3xl font-bold">AI Persona</h2>
  // //                 <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="Agent Name" className="w-full px-6 py-5 text-2xl font-bold border-2 rounded-2xl" />
  // //                 <input value={agentRole} onChange={e => setAgentRole(e.target.value)} placeholder="Role / Title" className="w-full px-6 py-5 text-xl border-2 rounded-2xl" />
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("template")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("avatar")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "avatar" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10">
  // //                 <h2 className="text-3xl font-bold mb-8">Choose Avatar</h2>
  // //                 <div className="grid grid-cols-4 gap-6 mb-8">
  // //                   {defaultAvatars.map((src, i) => (
  // //                     <button key={i} onClick={() => setAgentAvatar(src)} className={`rounded-2xl overflow-hidden border-4 ${agentAvatar === src ? "border-purple-500" : "border-gray-200"}`}>
  // //                       <img src={src} alt="" className="w-full h-full object-cover" />
  // //                     </button>
  // //                   ))}
  // //                 </div>
  // //                 <button onClick={() => fileInputRef.current.click()} className="w-full py-5 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3">
  // //                   <ImageIcon className="w-8 h-8" /> Upload Custom Avatar
  // //                 </button>
  // //                 <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
  // //                 <div className="flex gap-4 mt-8">
  // //                   <button onClick={() => setStep("persona")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("knowledge")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "knowledge" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-10">
  // //                 <h2 className="text-3xl font-bold flex items-center gap-4">
  // //                   <FileText className="w-10 h-10 text-green-600" /> Train Your AI
  // //                 </h2>
  // //                 <textarea value={knowledgeText} onChange={e => setKnowledgeText(e.target.value)} placeholder="Paste FAQs, product info..." className="w-full h-40 p-6 rounded-2xl border-2" />
  // //                 <div>
  // //                   <button onClick={() => fileInputRef.current.click()} className="w-full py-12 border-4 border-dashed rounded-3xl flex flex-col items-center gap-4">
  // //                     <Upload className="w-16 h-16 text-purple-500" />
  // //                     <span className="text-xl font-bold">Upload Documents</span>
  // //                   </button>
  // //                   <input ref={fileInputRef} type="file" multiple onChange={handleKnowledgeUpload} className="hidden" />
  // //                   {uploadedFiles.map((f, i) => (
  // //                     <div key={i} className="mt-4 p-4 bg-purple-50 rounded-xl flex justify-between items-center">
  // //                       <span>{f.name} ({f.size})</span>
  // //                       <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}><Trash2 className="w-5 h-5" /></button>
  // //                     </div>
  // //                   ))}
  // //                 </div>
  // //                 <div className="flex gap-4">
  // //                   <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://yourwebsite.com" className="flex-1 px-6 py-5 rounded-2xl border-2" />
  // //                   <button className="px-8 py-5 bg-orange-600 text-white rounded-2xl font-bold flex items-center gap-2"><Link2 /> Add</button>
  // //                 </div>
  // //                 <div>
  // //                   <div className="flex justify-between mb-4">
  // //                     <h3 className="text-2xl font-bold">Q&A Training</h3>
  // //                     <button onClick={addQAPair} className="text-purple-600 flex items-center gap-2"><Plus /> Add</button>
  // //                   </div>
  // //                   {qaPairs.map((pair, i) => (
  // //                     <div key={i} className="mb-6 space-y-4 p-6 bg-gray-50 rounded-2xl">
  // //                       <input placeholder="Question" value={pair.question} onChange={e => updateQAPair(i, "question", e.target.value)} className="w-full px-5 py-4 rounded-xl border" />
  // //                       <textarea placeholder="Answer" value={pair.answer} onChange={e => updateQAPair(i, "answer", e.target.value)} className="w-full px-5 py-4 rounded-xl border h-28 resize-none" />
  // //                     </div>
  // //                   ))}
  // //                 </div>
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("avatar")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("style")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "style" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-10">
  // //                 <h2 className="text-3xl font-bold flex items-center gap-4"><Palette className="w-10 h-10" /> Style</h2>
  // //                 <div className="grid grid-cols-2 gap-8">
  // //                   <div>
  // //                     <label className="text-lg font-bold">Header & Bot Color</label>
  // //                     <input type="color" value={headerColor} onChange={e => { setHeaderColor(e.target.value); setBotBubbleColor(e.target.value); }} className="w-24 h-24 rounded-2xl cursor-pointer mt-4" />
  // //                   </div>
  // //                   <div>
  // //                     <label className="text-lg font-bold">Border Radius: {borderRadius}px</label>
  // //                     <input type="range" min="8" max="40" value={borderRadius} onChange={e => setBorderRadius(+e.target.value)} className="w-full mt-4" />
  // //                   </div>
  // //                 </div>
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("knowledge")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("greeting")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "greeting" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
  // //                 <h2 className="text-3xl font-bold">Greeting Message</h2>
  // //                 <textarea value={greetingMessage} onChange={e => setGreetingMessage(e.target.value)} className="w-full h-48 p-8 text-xl rounded-2xl border-2" />
  // //                 <div className="flex gap-4">
  // //                   <button onClick={() => setStep("style")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  // //                   <button onClick={() => setStep("deploy")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Finish & Deploy</button>
  // //                 </div>
  // //               </div>
  // //             )}

  // //             {step === "deploy" && (
  // //               <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
  // //                 <Bot className="w-24 h-24 text-purple-600 mx-auto mb-6" />
  // //                 <h2 className="text-4xl font-bold mb-4">Your AI Chatbot is LIVE!</h2>
  // //                 <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 my-10">
  // //                   <p className="text-lg mb-4">Direct Link</p>
  // //                   <div className="flex gap-4 bg-white/20 rounded-2xl p-5">
  // //                     <Globe className="w-8 h-8" />
  // //                     <input value={embedUrl} readOnly className="flex-1 bg-transparent text-white font-mono" />
  // //                     <button onClick={copyLink} className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold">
  // //                       {copiedLink ? <Check /> : "Copy"}
  // //                     </button>
  // //                   </div>
  // //                 </div>
  // //                 <pre className="bg-gray-900 text-green-400 p-8 rounded-2xl text-left font-mono text-sm overflow-x-auto mb-8">
  // //                   {embedCode}
  // //                 </pre>
  // //                 <button onClick={copyEmbed} className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4">
  // //                   {copiedEmbed ? <><Check className="w-8 h-8" /> Copied!</> : <><Copy className="w-6 h-6" /> Copy Embed Code</>}
  // //                 </button>
  // //               </div>
  // //             )}
  // //           </div>

  // //           <div className="sticky top-24">
  // //             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
  // //               <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
  // //                 <div className="flex items-center gap-4">
  // //                   <Eye className="w-6 h-6" />
  // //                   <span className="text-xl font-bold">Live Preview — REAL AI</span>
  // //                 </div>
  // //                 <div className="flex bg-white/20 rounded-xl p-2 gap-2">
  // //                   <button onClick={() => setPreviewMode("desktop")} className={`px-5 py-3 rounded-lg flex items-center gap-2 transition ${previewMode === "desktop" ? "bg-white text-purple-600" : "text-white/80"}`}>
  // //                     <Monitor className="w-5 h-5" /> Desktop
  // //                   </button>
  // //                   <button onClick={() => setPreviewMode("mobile")} className={`px-5 py-3 rounded-lg flex items-center gap-2 transition ${previewMode === "mobile" ? "bg-white text-purple-600" : "text-white/80"}`}>
  // //                     <Smartphone className="w-5 h-5" /> Mobile
  // //                   </button>
  // //                 </div>
  // //               </div>

  // //               <div className="p-10 bg-gray-50">
  // //                 {previewMode === "mobile" && (
  // //                   <div className="mx-auto w-80 relative">
  // //                     <div className="absolute inset-0 bg-black rounded-3xl shadow-2xl"></div>
  // //                     <div className="relative bg-white rounded-3xl overflow-hidden border-8 border-black">
  // //                       <div className="bg-gray-200 h-6 rounded-t-2xl relative">
  // //                         <div className="absolute top-1 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-full"></div>
  // //                       </div>
  // //                       <div className="h-96 overflow-hidden">
  // //                         <ChatbotPreview />
  // //                       </div>
  // //                     </div>
  // //                   </div>
  // //                 )}

  // //                 {previewMode === "desktop" && (
  // //                   <div className="mx-auto w-full max-w-4xl">
  // //                     <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-4 shadow-2xl">
  // //                       <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
  // //                         <div className="bg-gray-300 h-8 flex items-center px-4 gap-3">
  // //                           <div className="flex gap-2">
  // //                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
  // //                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
  // //                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
  // //                           </div>
  // //                         </div>
  // //                         <div className="bg-white p-8">
  // //                           <div className="max-w-2xl mx-auto">
  // //                             <ChatbotPreview />
  // //                           </div>
  // //                         </div>
  // //                       </div>
  // //                     </div>
  // //                   </div>
  // //                 )}
  // //               </div>
  // //             </div>
  // //           </div>
  // //         </div>
  // //       </div>
  // //     </>
  // //   );
  // // }


  // // src/pages/ChatbotBuilder.jsx — 100% COMPLETE & FINAL (Text Color = Bot Text Only)
  // import React, { useState, useRef } from "react";
  // import { useNavigate } from "react-router-dom";
  // import {
  //   ArrowLeft, Sparkles, Upload, Link2, FileText,
  //   Mic, Paperclip, Send, Eye, Palette, ChevronRight,
  //   Image as ImageIcon, Plus, Trash2, Monitor, Smartphone
  // } from "lucide-react";

  // const templates = [
  //   { id: "support", name: "Customer Support", desc: "FAQs, tickets, live help", color: "#3b82f6", agentName: "Emma", agentRole: "Customer Support Agent", greeting: "Hi there! I'm Emma, your support assistant. How can I help you today?" },
  //   { id: "ecommerce", name: "E-commerce", desc: "Shopping assistant, order tracking", color: "#8b5cf6", agentName: "Mila", agentRole: "Shopping Assistant", greeting: "Hey! I'm Mila, your personal shopping assistant. What are you looking for today?" },
  //   { id: "appointment", name: "Appointment", desc: "Book meetings & consultations", color: "#10b981", agentName: "Sarah", agentRole: "Scheduling Assistant", greeting: "Hello! I'm Sarah, here to help you book appointments. What time works for you?" },
  //   { id: "recruit", name: "Recruitment", desc: "Candidate screening & scheduling", color: "#f59e0b", agentName: "Alex", agentRole: "Recruitment Specialist", greeting: "Hi! I'm Alex from HR. I'd love to learn more about your experience. Shall we start?" },
  //   { id: "feedback", name: "Feedback", desc: "Collect reviews & NPS", color: "#ec4899", agentName: "Lily", agentRole: "Feedback Assistant", greeting: "Hi! I'm Lily. We’d love to hear your thoughts — it only takes 30 seconds!" },
  // ];

  // const defaultAvatars = [
  //   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  //   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  //   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  //   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  //   "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  //   "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
  //   "https://api.dicebear.com/8.x/open-peeps/svg?seed=Sarah&backgroundColor=f8f9fa",
  //   "https://api.dicebear.com/8.x/adventurer/svg?seed=Kaori&backgroundColor=ff9ff3",
  //   "https://api.dicebear.com/8.x/lorelei/svg?seed=Mika&hairColor=ff6b6b&backgroundColor=ffffff",
  //   "https://api.dicebear.com/8.x/fun-emoji/svg?seed=robotcat&size=120",
  // ];

  // export default function ChatbotBuilder() {
  //   const navigate = useNavigate();
  //   const fileInputRef = useRef(null);

  //   const [step, setStep] = useState("template");
  //   const [selectedTemplate, setSelectedTemplate] = useState(null);

  //   const [agentName, setAgentName] = useState("Mila");
  //   const [agentRole, setAgentRole] = useState("Recruitment Assistant");
  //   const [conversationalTone, setConversationalTone] = useState("Friendly");
  //   const [responseStyle, setResponseStyle] = useState("Concise");
  //   const [personality, setPersonality] = useState("Helpful");

  //   const [agentAvatar, setAgentAvatar] = useState(defaultAvatars[1]);

  //   const [knowledgeText, setKnowledgeText] = useState("");
  //   const [websiteUrl, setWebsiteUrl] = useState("");
  //   const [uploadedFiles, setUploadedFiles] = useState([]);
  //   const [qaPairs, setQaPairs] = useState([{ question: "", answer: "" }]);

  //   // STYLE — FINAL & PERFECT
  //   const [headerColor, setHeaderColor] = useState("#8b5cf6");
  //   const [headerTextColor, setHeaderTextColor] = useState("#ffffff");
  //   const [botBubbleColor, setBotBubbleColor] = useState("#8b5cf6");
  //   const [botTextColor, setBotTextColor] = useState("#ffffff");   // THIS IS "Text Color" in UI
  //   const [buttonColor, setButtonColor] = useState("#8b5cf6");
  //   const [chatBackground, setChatBackground] = useState("#fafafa");
  //   const [shadowIntensity, setShadowIntensity] = useState(0.1);
  //   const [avatarRadius, setAvatarRadius] = useState(50);
  //   const [bubbleRadius, setBubbleRadius] = useState(16);
  //   const [buttonRadius, setButtonRadius] = useState(14);
  //   const [inputRadius, setInputRadius] = useState(8);

  //   const [greetingMessage, setGreetingMessage] = useState("Welcome! I'm here to assist with your job application and interview scheduling.");
  //   const [previewMode, setPreviewMode] = useState("desktop");
  //   const [messages, setMessages] = useState([]);
  //   const [input, setInput] = useState("");
  //   const [isTyping, setIsTyping] = useState(false);

  //   // LLM-assisted template prompt ("describe your bot")
  // const [templatePrompt, setTemplatePrompt] = useState("");
  // const [templateGenerating, setTemplateGenerating] = useState(false);
  // const [templateGenError, setTemplateGenError] = useState("");


  //   const handleAvatarUpload = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (ev) => setAgentAvatar(ev.target.result);
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleKnowledgeUpload = (e) => {
  //     const files = Array.from(e.target.files);
  //     setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }))]);
  //   };

  //   const addQAPair = () => setQaPairs(prev => [...prev, { question: "", answer: "" }]);
  //   const updateQAPair = (i, field, val) => setQaPairs(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  //   const removeQAPair = (i) => setQaPairs(prev => prev.filter((_, idx) => idx !== i));

  //   const generateFromPrompt = async () => {
  //   const prompt = templatePrompt.trim();
  //   if (!prompt) {
  //     setTemplateGenError("Please describe your chatbot first.");
  //     return;
  //   }

  //   setTemplateGenerating(true);
  //   setTemplateGenError("");

  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/llm/template-preview`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         prompt,
  //         template_id: selectedTemplate,
  //         // provider/model optional; backend defaults are fine
  //       }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data?.detail || "Template generation failed");

  //     // Apply generated configuration to builder state
  //     if (data.agent_name) setAgentName(data.agent_name);
  //     if (data.agent_role) setAgentRole(data.agent_role);
  //     if (data.greeting) setGreetingMessage(data.greeting);
  //     if (data?.theme?.header_color) setHeaderColor(data.theme.header_color);
  //     if (data?.theme?.bot_bubble_color) setBotBubbleColor(data.theme.bot_bubble_color);

  //     // Pre-fill preview conversation
  //     const starter = Array.isArray(data.starter_messages) ? data.starter_messages : [];
  //     setMessages(
  //       starter
  //         .filter((m) => m && typeof m.text === "string")
  //         .map((m) => ({
  //           text: m.text,
  //           sender: m.sender === "bot" ? "bot" : "user",
  //         }))
  //     );
  //   } catch (e) {
  //     console.error(e);
  //     setTemplateGenError(typeof e?.message === "string" ? e.message : "Could not generate template preview.");
  //   } finally {
  //     setTemplateGenerating(false);
  //   }
  // };


  //   const sendMessage = () => {
  //     if (!input.trim()) return;
  //     setMessages(prev => [...prev, { text: input, sender: "user" }]);
  //     setInput("");
  //     setIsTyping(true);
  //     setTimeout(() => {
  //       setMessages(prev => [...prev, { text: "Thanks! This is a live preview.", sender: "bot" }]);
  //       setIsTyping(false);
  //     }, 1000);
  //   };

  //   const ChatbotPreview = () => (
  //     <div 
  //       className="rounded-3xl overflow-hidden border-2 border-gray-200"
  //       style={{
  //         backgroundColor: chatBackground,
  //         boxShadow: `0 25px 60px rgba(0,0,0,${shadowIntensity})`
  //       }}
  //     >
  //       {/* Header */}
  //       <div className="p-6 text-center" style={{ backgroundColor: headerColor }}>
  //         <div className="mx-auto w-20 h-20">
  //           <img 
  //             src={agentAvatar} 
  //             alt={agentName} 
  //             className="w-full h-full object-cover border-4 border-white shadow-xl"
  //             style={{ borderRadius: `${avatarRadius}px` }}
  //           />
  //         </div>
  //         <h3 className="text-xl font-bold mt-4" style={{ color: headerTextColor }}>{agentName}</h3>
  //         <p className="text-sm opacity-90" style={{ color: headerTextColor }}>{agentRole}</p>
  //       </div>

  //       {/* Messages */}
  //       <div className="p-6 space-y-5 min-h-80 max-h-96 overflow-y-auto">
  //         <div className="max-w-xs">
  //           <div className="p-4 shadow-md" style={{ backgroundColor: botBubbleColor, borderRadius: `${bubbleRadius}px` }}>
  //             <p className="text-sm" style={{ color: botTextColor }}>{greetingMessage}</p>
  //           </div>
  //         </div>

  //         {messages.map((m, i) => (
  //           <div key={i} className={m.sender === "user" ? "ml-auto max-w-xs" : "max-w-xs"}>
  //             <div
  //               className="p-4 shadow-md text-sm"
  //               style={{
  //                 backgroundColor: m.sender === "user" ? "#f3f4f6" : botBubbleColor,
  //                 color: m.sender === "user" ? "#333" : botTextColor,
  //                 borderRadius: `${bubbleRadius}px`
  //               }}
  //             >
  //               {m.text}
  //             </div>
  //           </div>
  //         ))}

  //         {isTyping && (
  //           <div className="max-w-xs">
  //             <div className="p-4 bg-gray-300 rounded-3xl flex gap-2">
  //               <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
  //               <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></div>
  //               <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></div>
  //             </div>
  //           </div>
  //         )}
  //       </div>

  //       {/* Input */}
  //       <div className="p-4 border-t" style={{ backgroundColor: chatBackground }}>
  //         <div className="flex items-center gap-3">
  //           <button className="p-2 hover:bg-gray-100 rounded-full"><Paperclip className="w-5 h-5 text-gray-600" /></button>
  //           <input
  //             type="text"
  //             value={input}
  //             onChange={(e) => setInput(e.target.value)}
  //             onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
  //             placeholder="Type your message..."
  //             className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-purple-500 transition rounded-full"
  //             style={{
  //               borderRadius: `${inputRadius}px`,
  //               backgroundColor: "white"
  //             }}
  //           />
  //           <button
  //             onClick={sendMessage}
  //             className="p-3 text-white shadow-lg transition transform hover:scale-105"
  //             style={{
  //               backgroundColor: buttonColor,
  //               borderRadius: `${buttonRadius}px`
  //             }}
  //           >
  //             <Send className="w-5 h-5" />
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );

  //   return (
  //     <>
  //       <header className="bg-white border-b sticky top-0 z-50 shadow-lg">
  //         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
  //           <div className="flex items-center gap-6">
  //             <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-100 rounded-xl transition">
  //               <ArrowLeft className="w-6 h-6" />
  //             </button>
  //             <div>
  //               <h1 className="text-2xl font-bold flex items-center gap-3">
  //                 <Sparkles className="w-8 h-8 text-purple-600" />
  //                 AI Chatbot Builder
  //               </h1>
  //               <p className="text-sm text-gray-500">Professional Real AI</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-gray-50 border-t">
  //           <div className="max-w-7xl mx-auto px-6 py-5">
  //             <div className="flex items-center gap-8 text-sm font-medium">
  //               {["Template", "Persona", "Avatar", "Knowledge", "Style", "Greeting"].map((label, i) => {
  //                 const steps = ["template", "persona", "avatar", "knowledge", "style", "greeting"];
  //                 return (
  //                   <div key={i} className={`flex items-center gap-3 ${step === steps[i] ? "text-purple-600" : "text-gray-400"}`}>
  //                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === steps[i] ? "bg-purple-600 text-white scale-110 shadow-lg" : "bg-gray-200"}`}>
  //                       {i + 1}
  //                     </div>
  //                     <span className="hidden sm:block">{label}</span>
  //                     {i < 5 && <ChevronRight className="w-5 h-5 text-gray-300" />}
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           </div>
  //         </div>
  //       </header>

  //       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
  //         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6 py-10">
  //           <div className="space-y-8">

  //             {step === "template" && (
  //               <div className="bg-white rounded-3xl shadow-2xl p-10">
  //                 <h2 className="text-3xl font-bold mb-8">Choose a Template</h2>
  //                 <div className="grid grid-cols-2 gap-6">
  //                   {templates.map(t => (
  //                     <button
  //                       key={t.id}
  //                       onClick={() => {
  //                         setSelectedTemplate(t.id);
  //                         setHeaderColor(t.color);
  //                         setBotBubbleColor(t.color);
  //                         setButtonColor(t.color);
  //                         setAgentName(t.agentName);
  //                         setAgentRole(t.agentRole);
  //                         setGreetingMessage(t.greeting);
  //                       }}
  //                       className={`p-8 rounded-2xl border-4 transition-all ${selectedTemplate === t.id ? "border-purple-500 shadow-2xl scale-105" : "border-gray-200 hover:border-gray-300"}`}
  //                     >
  //                       <div className="w-16 h-16 rounded-full mb-4 mx-auto" style={{ backgroundColor: t.color }} />
  //                       <h3 className="font-bold text-xl">{t.name}</h3>
  //                       <p className="text-sm text-gray-600 mt-2">{t.desc}</p>
  //                     </button>
  //                   ))}
  //                 </div>
  //                 <div className="flex justify-end mt-10">
  //                   <button
  //                     onClick={() => setStep("persona")}
  //                     disabled={!selectedTemplate}
  //                     className="px-12 py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
  //                   >
  //                     Next
  //                   </button>
  //                 </div>
  //               </div>
  //             )}

  //             {step === "persona" && (
  //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
  //                 <h2 className="text-3xl font-bold">AI Persona</h2>
  //                 <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="Name" className="w-full px-6 py-5 text-2xl font-bold border-2 rounded-2xl focus:border-purple-500 outline-none" />
  //                 <input value={agentRole} onChange={e => setAgentRole(e.target.value)} placeholder="Description" className="w-full px-6 py-5 text-xl border-2 rounded-2xl focus:border-purple-500 outline-none" />

  //                 <div>
  //                   <label className="block text-lg font-semibold mb-3">Conversational Tone</label>
  //                   <select value={conversationalTone} onChange={e => setConversationalTone(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 text-lg focus:border-purple-500 outline-none">
  //                     <option>Friendly</option>
  //                     <option>Professional</option>
  //                     <option>Casual</option>
  //                     <option>Helpful</option>
  //                   </select>
  //                 </div>

  //                 <div>
  //                   <label className="block text-lg font-semibold mb-3">Response Style</label>
  //                   <select value={responseStyle} onChange={e => setResponseStyle(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 text-lg focus:border-purple-500 outline-none">
  //                     <option>Concise</option>
  //                     <option>Detailed</option>
  //                   </select>
  //                 </div>

  //                 <div>
  //                   <label className="block text-lg font-semibold mb-3">Personality</label>
  //                   <select value={personality} onChange={e => setPersonality(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 text-lg focus:border-purple-500 outline-none">
  //                     <option>Helpful</option>
  //                     <option>Informative</option>
  //                     <option>Enthusiastic</option>
  //                   </select>
  //                 </div>

  //                 <div className="flex gap-4">
  //                   <button onClick={() => setStep("template")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  //                   <button onClick={() => setStep("avatar")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  //                 </div>
  //               </div>
  //             )}

  //             {step === "avatar" && (
  //               <div className="bg-white rounded-3xl shadow-2xl p-10">
  //                 <h2 className="text-3xl font-bold mb-8">Choose Avatar</h2>
  //                 <div className="grid grid-cols-4 gap-6 mb-8">
  //                   {defaultAvatars.map((src, i) => (
  //                     <button key={i} onClick={() => setAgentAvatar(src)} className={`rounded-2xl overflow-hidden border-4 transition-all ${agentAvatar === src ? "border-purple-500 shadow-xl" : "border-gray-200"}`}>
  //                       <img src={src} alt="" className="w-full h-full object-cover" />
  //                     </button>
  //                   ))}
  //                 </div>
  //                 <button onClick={() => fileInputRef.current.click()} className="w-full py-5 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3 text-lg font-medium hover:bg-gray-50">
  //                   <ImageIcon className="w-8 h-8" /> Upload Custom Avatar
  //                 </button>
  //                 <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
  //                 <div className="flex gap-4 mt-8">
  //                   <button onClick={() => setStep("persona")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  //                   <button onClick={() => setStep("knowledge")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  //                 </div>
  //               </div>
  //             )}

  //             {step === "knowledge" && (
  //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-10">
  //                 <h2 className="text-3xl font-bold flex items-center gap-4">
  //                   <FileText className="w-10 h-10 text-green-600" /> Train Your AI
  //                 </h2>
  //                 <textarea value={knowledgeText} onChange={e => setKnowledgeText(e.target.value)} placeholder="Input FAQs, product info..." className="w-full h-40 p-6 rounded-2xl border-2 focus:border-purple-500 outline-none" />

  //                 <div>
  //                   <button onClick={() => fileInputRef.current.click()} className="w-full py-12 border-4 border-dashed rounded-3xl flex flex-col items-center gap-4 hover:bg-gray-50 transition">
  //                     <Upload className="w-16 h-16 text-purple-500" />
  //                     <span className="text-xl font-bold">Upload Documents</span>
  //                   </button>
  //                   <input ref={fileInputRef} type="file" multiple onChange={handleKnowledgeUpload} className="hidden" />
  //                 </div>

  //                 <div className="flex gap-4">
  //                   <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://yourwebsite.com" className="flex-1 px-6 py-5 rounded-2xl border-2 focus:border-purple-500 outline-none" />
  //                   <button className="px-8 py-5 bg-orange-600 text-white rounded-2xl font-bold flex items-center gap-2"><Link2 className="w-5 h-5" /> Add</button>
  //                 </div>

  //                 <div>
  //                   <div className="flex justify-between items-center mb-6">
  //                     <h3 className="text-2xl font-bold">Q&A Training</h3>
  //                     <button onClick={addQAPair} className="flex items-center gap-2 text-purple-600 font-semibold hover:bg-purple-50 px-4 py-2 rounded-xl transition">
  //                       <Plus className="w-5 h-5" /> Add
  //                     </button>
  //                   </div>
  //                   {qaPairs.map((pair, i) => (
  //                     <div key={i} className="mb-6 p-6 bg-gray-50 rounded-2xl space-y-4">
  //                       <div className="flex items-center gap-3">
  //                         <input placeholder="Question" value={pair.question} onChange={e => updateQAPair(i, "question", e.target.value)} className="flex-1 px-5 py-4 rounded-xl border focus:border-purple-500 outline-none" />
  //                         {qaPairs.length > 1 && (
  //                           <button onClick={() => removeQAPair(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
  //                             <Trash2 className="w-5 h-5" />
  //                           </button>
  //                         )}
  //                       </div>
  //                       <textarea placeholder="Answer" value={pair.answer} onChange={e => updateQAPair(i, "answer", e.target.value)} className="w-full px-5 py-4 rounded-xl border focus:border-purple-500 outline-none h-28 resize-none" />
  //                     </div>
  //                   ))}
  //                 </div>

  //                 <div className="flex gap-4">
  //                   <button onClick={() => setStep("avatar")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  //                   <button onClick={() => setStep("style")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  //                 </div>
  //               </div>
  //             )}

  //             {step === "style" && (
  //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-10">
  //                 <h2 className="text-3xl font-bold flex items-center gap-4">
  //                   <Palette className="w-10 h-10" /> Style
  //                 </h2>

  //                 <div className="grid grid-cols-2 gap-8">
  //                   <div>
  //                     <label className="text-lg font-bold block mb-3">Header Color</label>
  //                     <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-gray-300" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold block mb-3">Header Text Color</label>
  //                     <input type="color" value={headerTextColor} onChange={(e) => setHeaderTextColor(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-gray-300" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold block mb-3">Bot Bubble Color</label>
  //                     <input type="color" value={botBubbleColor} onChange={(e) => setBotBubbleColor(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-gray-300" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold block mb-3">Send Button Color</label>
  //                     <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-gray-300" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold block mb-3">Text Color</label>
  //                     <input type="color" value={botTextColor} onChange={(e) => setBotTextColor(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-gray-300" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold block mb-3">Chat Background</label>
  //                     <input type="color" value={chatBackground} onChange={(e) => setChatBackground(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-gray-300" />
  //                   </div>
  //                 </div>

  //                 <div className="space-y-6">
  //                   <div>
  //                     <label className="text-lg font-bold">Shadow Intensity: {Math.round(shadowIntensity * 100)}%</label>
  //                     <input type="range" min="0" max="50" value={shadowIntensity * 100} onChange={(e) => setShadowIntensity(e.target.value / 100)} className="w-full h-3 rounded-lg bg-gray-200" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold">Avatar Radius: {avatarRadius}px</label>
  //                     <input type="range" min="0" max="60" value={avatarRadius} onChange={(e) => setAvatarRadius(+e.target.value)} className="w-full h-3 rounded-lg bg-gray-200" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold">Bubble Radius: {bubbleRadius}px</label>
  //                     <input type="range" min="0" max="32" value={bubbleRadius} onChange={(e) => setBubbleRadius(+e.target.value)} className="w-full h-3 rounded-lg bg-gray-200" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold">Button Radius: {buttonRadius}px</label>
  //                     <input type="range" min="0" max="32" value={buttonRadius} onChange={(e) => setButtonRadius(+e.target.value)} className="w-full h-3 rounded-lg bg-gray-200" />
  //                   </div>
  //                   <div>
  //                     <label className="text-lg font-bold">Input Radius: {inputRadius}px</label>
  //                     <input type="range" min="0" max="32" value={inputRadius} onChange={(e) => setInputRadius(+e.target.value)} className="w-full h-3 rounded-lg bg-gray-200" />
  //                   </div>
  //                 </div>

  //                 <div className="flex gap-4">
  //                   <button onClick={() => setStep("knowledge")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  //                   <button onClick={() => setStep("greeting")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Next</button>
  //                 </div>
  //               </div>
  //             )}

  //             {step === "greeting" && (
  //               <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
  //                 <h2 className="text-3xl font-bold">Greeting Message</h2>
  //                 <textarea
  //                   value={greetingMessage}
  //                   onChange={e => setGreetingMessage(e.target.value)}
  //                   className="w-full h-48 p-8 text-xl rounded-2xl border-2 focus:border-purple-500 outline-none resize-none"
  //                 />
  //                 <div className="flex gap-4">
  //                   <button onClick={() => setStep("style")} className="px-8 py-4 border-2 rounded-xl">Back</button>
  //                   <button onClick={() => alert("Your chatbot is ready!")} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold">Finish</button>
  //                 </div>
  //               </div>
  //             )}
  //           </div>

  //           <div className="sticky top-24">
  //             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
  //               <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
  //                 <div className="flex items-center gap-4">
  //                   <Eye className="w-6 h-6" />
  //                   <span className="text-xl font-bold">Live Preview — REAL AI</span>
  //                 </div>
  //                 <div className="flex bg-white/20 rounded-xl p-1">
  //                   <button onClick={() => setPreviewMode("desktop")} className={`px-5 py-3 rounded-lg ${previewMode === "desktop" ? "bg-white text-purple-600" : "text-white/80"}`}>Desktop</button>
  //                   <button onClick={() => setPreviewMode("mobile")} className={`px-5 py-3 rounded-lg ${previewMode === "mobile" ? "bg-white text-purple-600" : "text-white/80"}`}>Mobile</button>
  //                 </div>
  //               </div>
  //               <div className="p-10 bg-gray-50">
  //                 {previewMode === "desktop" ? (
  //                   <div className="max-w-lg mx-auto"><ChatbotPreview /></div>
  //                 ) : (
  //                   <div className="mx-auto w-80">
  //                     <div className="bg-black rounded-3xl p-4 shadow-2xl">
  //                       <div className="bg-white rounded-3xl overflow-hidden border-8 border-black">
  //                         <div className="bg-gray-200 h-8 rounded-t-3xl"></div>
  //                         <ChatbotPreview />
  //                       </div>
  //                     </div>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
    
  // }

  // src/pages/ChatbotBuilder.jsx — UPDATED (Templates Prompt → Generate Preview + Clean Preview Reset)
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Link2,
  FileText,
  Mic,
  Paperclip,
  Send,
  Eye,
  Palette,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Trash2,
  Monitor,
  Smartphone,
} from "lucide-react";

const templates = [
  {
    id: "support",
    name: "Customer Support",
    desc: "FAQs, tickets, live help",
    color: "#3b82f6",
    agentName: "Emma",
    agentRole: "Customer Support Agent",
    greeting: "Hi there! I'm Emma, your support assistant. How can I help you today?",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    desc: "Shopping assistant, order tracking",
    color: "#8b5cf6",
    agentName: "Mila",
    agentRole: "Shopping Assistant",
    greeting: "Hey! I'm Mila, your personal shopping assistant. What are you looking for today?",
  },
  {
    id: "appointment",
    name: "Appointment",
    desc: "Book meetings & consultations",
    color: "#10b981",
    agentName: "Sarah",
    agentRole: "Scheduling Assistant",
    greeting: "Hello! I'm Sarah, here to help you book appointments. What time works for you?",
  },
  {
    id: "recruit",
    name: "Recruitment",
    desc: "Candidate screening & scheduling",
    color: "#f59e0b",
    agentName: "Alex",
    agentRole: "Recruitment Specialist",
    greeting: "Hi! I'm Alex from HR. I'd love to learn more about your experience. Shall we start?",
  },
  {
    id: "feedback",
    name: "Feedback",
    desc: "Collect reviews & NPS",
    color: "#ec4899",
    agentName: "Lily",
    agentRole: "Feedback Assistant",
    greeting: "Hi! I'm Lily. We’d love to hear your thoughts — it only takes 30 seconds!",
  },
];

const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
  "https://api.dicebear.com/8.x/open-peeps/svg?seed=Sarah&backgroundColor=f8f9fa",
  "https://api.dicebear.com/8.x/adventurer/svg?seed=Kaori&backgroundColor=ff9ff3",
  "https://api.dicebear.com/8.x/lorelei/svg?seed=Mika&hairColor=ff6b6b&backgroundColor=ffffff",
  "https://api.dicebear.com/8.x/fun-emoji/svg?seed=robotcat&size=120",
];

export default function ChatbotBuilder() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [agentName, setAgentName] = useState("Mila");
  const [agentRole, setAgentRole] = useState("Recruitment Assistant");
  const [conversationalTone, setConversationalTone] = useState("Friendly");
  const [responseStyle, setResponseStyle] = useState("Concise");
  const [personality, setPersonality] = useState("Helpful");

  const [agentAvatar, setAgentAvatar] = useState(defaultAvatars[1]);

  const [knowledgeText, setKnowledgeText] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [qaPairs, setQaPairs] = useState([{ question: "", answer: "" }]);

  // STYLE
  const [headerColor, setHeaderColor] = useState("#8b5cf6");
  const [headerTextColor, setHeaderTextColor] = useState("#ffffff");
  const [botBubbleColor, setBotBubbleColor] = useState("#8b5cf6");
  const [botTextColor, setBotTextColor] = useState("#ffffff");
  const [buttonColor, setButtonColor] = useState("#8b5cf6");
  const [chatBackground, setChatBackground] = useState("#fafafa");
  const [shadowIntensity, setShadowIntensity] = useState(0.1);
  const [avatarRadius, setAvatarRadius] = useState(50);
  const [bubbleRadius, setBubbleRadius] = useState(16);
  const [buttonRadius, setButtonRadius] = useState(14);
  const [inputRadius, setInputRadius] = useState(8);

  const [greetingMessage, setGreetingMessage] = useState(
    "Welcome! I'm here to assist with your job application and interview scheduling."
  );
  const [previewMode, setPreviewMode] = useState("desktop");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ✅ LLM prompt states
  const [templatePrompt, setTemplatePrompt] = useState("");
  const [templateGenerating, setTemplateGenerating] = useState(false);
  const [templateGenError, setTemplateGenError] = useState("");

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAgentAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleKnowledgeUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [
      ...prev,
      ...files.map((f) => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" })),
    ]);
  };

  const addQAPair = () => setQaPairs((prev) => [...prev, { question: "", answer: "" }]);
  const updateQAPair = (i, field, val) =>
    setQaPairs((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  const removeQAPair = (i) => setQaPairs((prev) => prev.filter((_, idx) => idx !== i));

  // ✅ Generate preview from prompt (cleans messages + safe template_id)
  const generateFromPrompt = async () => {
    const prompt = templatePrompt.trim();
    if (!prompt) {
      setTemplateGenError("Please describe your chatbot first.");
      return;
    }

    setMessages([]); // ✅ reset preview convo
    setTemplateGenerating(true);
    setTemplateGenError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/llm/template-preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          template_id: selectedTemplate || "custom",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Template generation failed");

      // Apply generated configuration
      if (data.agent_name) setAgentName(data.agent_name);
      if (data.agent_role) setAgentRole(data.agent_role);
      if (data.greeting) setGreetingMessage(data.greeting);
      if (data?.theme?.header_color) setHeaderColor(data.theme.header_color);
      if (data?.theme?.bot_bubble_color) setBotBubbleColor(data.theme.bot_bubble_color);

      // Starter conversation
      const starter = Array.isArray(data.starter_messages) ? data.starter_messages : [];
      setMessages(
        starter
          .filter((m) => m && typeof m.text === "string")
          .map((m) => ({
            text: m.text,
            sender: m.sender === "bot" ? "bot" : "user",
          }))
      );
    } catch (e) {
      console.error(e);
      setTemplateGenError(typeof e?.message === "string" ? e.message : "Could not generate template preview.");
    } finally {
      setTemplateGenerating(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Thanks! This is a live preview.", sender: "bot" }]);
      setIsTyping(false);
    }, 1000);
  };

  const ChatbotPreview = () => (
    <div
      className="rounded-3xl overflow-hidden border-2 border-gray-200"
      style={{
        backgroundColor: chatBackground,
        boxShadow: `0 25px 60px rgba(0,0,0,${shadowIntensity})`,
      }}
    >
      <div className="p-6 text-center" style={{ backgroundColor: headerColor }}>
        <div className="mx-auto w-20 h-20">
          <img
            src={agentAvatar}
            alt={agentName}
            className="w-full h-full object-cover border-4 border-white shadow-xl"
            style={{ borderRadius: `${avatarRadius}px` }}
          />
        </div>
        <h3 className="text-xl font-bold mt-4" style={{ color: headerTextColor }}>
          {agentName}
        </h3>
        <p className="text-sm opacity-90" style={{ color: headerTextColor }}>
          {agentRole}
        </p>
      </div>

      <div className="p-6 space-y-5 min-h-80 max-h-96 overflow-y-auto">
        <div className="max-w-xs">
          <div className="p-4 shadow-md" style={{ backgroundColor: botBubbleColor, borderRadius: `${bubbleRadius}px` }}>
            <p className="text-sm" style={{ color: botTextColor }}>
              {greetingMessage}
            </p>
          </div>
        </div>

        {messages.map((m, i) => (
          <div key={i} className={m.sender === "user" ? "ml-auto max-w-xs" : "max-w-xs"}>
            <div
              className="p-4 shadow-md text-sm"
              style={{
                backgroundColor: m.sender === "user" ? "#f3f4f6" : botBubbleColor,
                color: m.sender === "user" ? "#333" : botTextColor,
                borderRadius: `${bubbleRadius}px`,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="max-w-xs">
            <div className="p-4 bg-gray-300 rounded-3xl flex gap-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t" style={{ backgroundColor: chatBackground }}>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-purple-500 transition rounded-full"
            style={{
              borderRadius: `${inputRadius}px`,
              backgroundColor: "white",
            }}
          />
          <button
            onClick={sendMessage}
            className="p-3 text-white shadow-lg transition transform hover:scale-105"
            style={{
              backgroundColor: buttonColor,
              borderRadius: `${buttonRadius}px`,
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-100 rounded-xl transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-600" />
                AI Chatbot Builder
              </h1>
              <p className="text-sm text-gray-500">Professional Real AI</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center gap-8 text-sm font-medium">
              {["Template", "Persona", "Avatar", "Knowledge", "Style", "Greeting"].map((label, i) => {
                const steps = ["template", "persona", "avatar", "knowledge", "style", "greeting"];
                return (
                  <div key={i} className={`flex items-center gap-3 ${step === steps[i] ? "text-purple-600" : "text-gray-400"}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        step === steps[i] ? "bg-purple-600 text-white scale-110 shadow-lg" : "bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="hidden sm:block">{label}</span>
                    {i < 5 && <ChevronRight className="w-5 h-5 text-gray-300" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6 py-10">
          <div className="space-y-8">
            {step === "template" && (
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <h2 className="text-3xl font-bold mb-6">Choose a Template</h2>

                {/* ✅ NEW: Prompt → Generate Preview */}
                <div className="mb-8 p-6 rounded-2xl border-2 border-gray-200 bg-gray-50">
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Describe your chatbot (LLM generates persona + preview chat)
                  </label>

                  <textarea
                    value={templatePrompt}
                    onChange={(e) => setTemplatePrompt(e.target.value)}
                    rows={4}
                    placeholder={`Example:
I run a sneaker ecommerce store. The chatbot should help with order tracking, returns, and size recommendations.
Tone: friendly, concise. Ask for order number when needed.`}
                    className="w-full p-5 rounded-2xl border-2 border-gray-200 focus:border-purple-500 outline-none resize-none bg-white"
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={generateFromPrompt}
                      disabled={templateGenerating}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {templateGenerating ? "Generating..." : "Generate Preview"}
                    </button>

                    <button
                      onClick={() => {
                        setTemplatePrompt("");
                        setTemplateGenError("");
                      }}
                      disabled={templateGenerating}
                      className="px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Clear
                    </button>

                    {templateGenError && <p className="text-sm text-red-600 font-semibold">{templateGenError}</p>}

                    {!selectedTemplate && (
                      <p className="text-sm text-gray-500">
                        Pick a template below (optional) — it helps the LLM style the bot.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplate(t.id);
                        setHeaderColor(t.color);
                        setBotBubbleColor(t.color);
                        setButtonColor(t.color);
                        setAgentName(t.agentName);
                        setAgentRole(t.agentRole);
                        setGreetingMessage(t.greeting);
                      }}
                      className={`p-8 rounded-2xl border-4 transition-all ${
                        selectedTemplate === t.id ? "border-purple-500 shadow-2xl scale-105" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full mb-4 mx-auto" style={{ backgroundColor: t.color }} />
                      <h3 className="font-bold text-xl">{t.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">{t.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end mt-10">
                  <button
                    onClick={() => setStep("persona")}
                    disabled={!selectedTemplate}
                    className="px-12 py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* باقي الخطوات unchanged — keep your persona/avatar/knowledge/style/greeting sections as-is */}
            {/* ... (your existing code continues) */}
          </div>

          {/* RIGHT: Preview */}
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Eye className="w-6 h-6" />
                  <span className="text-xl font-bold">Live Preview — REAL AI</span>
                </div>
                <div className="flex bg-white/20 rounded-xl p-1">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`px-5 py-3 rounded-lg ${previewMode === "desktop" ? "bg-white text-purple-600" : "text-white/80"}`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`px-5 py-3 rounded-lg ${previewMode === "mobile" ? "bg-white text-purple-600" : "text-white/80"}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="p-10 bg-gray-50">
                {previewMode === "desktop" ? (
                  <div className="max-w-lg mx-auto">
                    <ChatbotPreview />
                  </div>
                ) : (
                  <div className="mx-auto w-80">
                    <div className="bg-black rounded-3xl p-4 shadow-2xl">
                      <div className="bg-white rounded-3xl overflow-hidden border-8 border-black">
                        <div className="bg-gray-200 h-8 rounded-t-3xl"></div>
                        <ChatbotPreview />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NOTE: keep all your other step sections (persona/avatar/knowledge/style/greeting) exactly as in your file */}
        </div>
      </div>
    </>
  );
}
