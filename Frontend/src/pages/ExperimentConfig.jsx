
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  Users,
  FileText,
  Settings,
  ListOrdered,
  ArrowRight,
  Pencil,
  X,
  GripVertical,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const API = import.meta.env.VITE_API_URL;

const TABS = ["General", "Participants", "Surveys", "Flow"];

//Sortable Flow Item
function SortableFlowItem({ step, index, onEdit, onDeleteSurvey }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const isSurvey = step.type === "survey";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 rounded-2xl border shadow-sm transition ${
        isSurvey ? "border-[#E9D5FF] bg-[#FAF5FF]" : "border-gray-200 bg-white"
      } ${isDragging ? "opacity-80" : "opacity-100"}`}
    >
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical size={20} />
      </button>

      <div className="w-10 h-10 rounded-full bg-[#6D28D9] text-white font-semibold flex items-center justify-center">
        {index}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate">{step.title}</div>
        <div className="text-sm text-gray-500 truncate">{step.subtitle || ""}</div>
      </div>

      <button
        type="button"
        className="w-10 h-10 rounded-xl border border-[#E9D5FF] bg-white hover:bg-[#F3E8FF] flex items-center justify-center"
        onClick={() => onEdit(step)}
        aria-label="Edit step"
      >
        <Pencil size={16} className="text-[#6D28D9]" />
      </button>

      {isSurvey && (
        <button
          type="button"
          className="w-10 h-10 rounded-xl border border-red-200 bg-white hover:bg-red-50 flex items-center justify-center"
          onClick={() => onDeleteSurvey(step)}
          aria-label="Remove survey"
        >
          <X size={16} className="text-red-500" />
        </button>
      )}
    </div>
  );
}

//Side Panel Editor
function StepConfigPanel({ step, draft, setDraft, onClose, onSave, onGoSurveys }) {
  const isSurvey = step?.type === "survey";
  const isWelcome = step?.id === "welcome";

  if (!step) return null;

  const questionsCount =
  step?.config?.questions?.length ??
  step?.config?.question_count ??
  step?.config?.questionCount ??
  step?.question_count ??
  step?.questionCount ??
  0; //Fixed issues 20/01


  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
      <div className="p-6 border-b flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xl font-bold text-gray-900 truncate">Configure {step.title}</div>
          <div className="text-sm text-gray-500 mt-1">Configure Messages/Instructions to the participants here</div>
        </div>
        <button
          className="w-10 h-10 rounded-xl border bg-white hover:bg-gray-50 flex items-center justify-center"
          onClick={onClose}
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-5">
        {isSurvey ? (
          <>
            <div className="p-4 rounded-2xl border border-[#E9D5FF] bg-[#FAF5FF]">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Survey:</span> {step.title}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {questionsCount != null ? `This survey contains ${questionsCount} questions` : "Survey questions loaded from configuration"}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">Survey Introduction</label>
              <textarea
                rows={4}
                value={draft.intro || ""}
                onChange={(e) => setDraft((d) => ({ ...d, intro: e.target.value }))}
                placeholder="Please answer the following questions about your experience..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none bg-white"
              />
            </div>
          </>
        ) : isWelcome ? (
          <>
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Welcome Title</label>
              <input
                value={draft.welcomeTitle || ""}
                onChange={(e) => setDraft((d) => ({ ...d, welcomeTitle: e.target.value }))}
                placeholder="Welcome to our research study"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">Welcome Message</label>
              <textarea
                rows={6}
                value={draft.welcomeMessage || ""}
                onChange={(e) => setDraft((d) => ({ ...d, welcomeMessage: e.target.value }))}
                placeholder="Thank you for participating in this study..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none bg-white"
              />
            </div>
          </>
        ) : (
         <>
          <div>
              <label className="block font-semibold text-gray-800 mb-2">Title</label>
              <input
                value={draft.Title || ""}
                onChange={(e) => setDraft((d) => ({ ...d, Title: e.target.value }))}
                placeholder="Edit title"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none bg-white"
              />
            </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">Message</label>
            <textarea
              rows={8}
              value={draft.message || ""}
              onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
              placeholder="Enter the message or Instructions to participants..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none bg-white"
            />
          </div>
        </>
        )}
      </div>

      <div className="p-6 border-t flex items-center justify-end gap-3">
        <button className="px-6 py-3 rounded-xl border bg-white hover:bg-gray-50 font-semibold" onClick={onClose}>
          Cancel
        </button>
        <button className="px-6 py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold" onClick={onSave}>
          Save Changes
        </button>
      </div>

      {isSurvey && (
        <div className="px-6 pb-6">
          <button
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold text-gray-800"
            onClick={onGoSurveys}
          >
            Go to Surveys tab
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExperimentConfig() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const experimentId = searchParams.get("experimentId");
  const experimentId =
  searchParams.get("experimentId") ||
  searchParams.get("edit") ||
  "new";

  const initialTab = searchParams.get("tab") || "General";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatbots, setChatbots] = useState([]);
  const [error, setError] = useState("");

  const [useExternal, setUseExternal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/auth");
    return null;
  }

  const [experiment, setExperiment] = useState({
    id: null,
    title: "",
    description: "",
    chatbot_id_a: null,
    chatbot_id_b: null,
    external_chatbot_url: null,
    budget: 1000,
    participant_limit: 100,
    randomization: true,
    anonymization: true,
    steps: [
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
    ],
  });

  const buildPrototypeFlow = (stepsFromState) => {
    const steps = Array.isArray(stepsFromState) ? stepsFromState : [];
    const hasAllBase = ["welcome", "consent", "chatbot", "thankyou"].every((id) => steps.some((s) => s.id === id));

    if (hasAllBase) return steps;

    const surveys = steps.filter((s) => s.type === "survey");

    const base = [
      { id: "welcome", title: "Welcome Message", subtitle: "Greet participants", type: "info", config: { welcomeTitle: "", welcomeMessage: "" } },
      { id: "consent", title: "Informed Consent", subtitle: "Get participant agreement", type: "consent", config: { message: "" } },
      { id: "chatbot", title: "Chatbot Interaction", subtitle: "Main experiment task", type: "task", config: { message: "" } },
      { id: "thankyou", title: "Thank You", subtitle: "Completion message", type: "info", config: { message: "" } },
    ];

    const out = [];
    for (const b of base) {
      out.push(b);
      if (b.id === "chatbot") out.push(...surveys);
    }
    return out;
  };

  const [orderedFlow, setOrderedFlow] = useState([]);
  useEffect(() => {
    setOrderedFlow(buildPrototypeFlow(experiment.steps));
  }, [experiment.steps]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onFlowDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedFlow((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const [editingStepId, setEditingStepId] = useState(null);
  const editingStep = useMemo(() => orderedFlow.find((s) => s.id === editingStepId) || null, [orderedFlow, editingStepId]);

  const [draft, setDraft] = useState({
    welcomeTitle: "",
    welcomeMessage: "",
    message: "",
    intro: "",
    randomize: false,
    requireAll: true,
  });

  const openEditor = (step) => {
    setEditingStepId(step.id);
    if (step.type === "survey") {
      setDraft({
        intro: step.config?.intro || "",
        randomize: !!step.config?.randomize_questions,
        requireAll: step.config?.require_all_questions ?? true,
      });
    } else if (step.id === "welcome") {
      setDraft({
        welcomeTitle: step.config?.welcomeTitle || "",
        welcomeMessage: step.config?.welcomeMessage || "",
      });
    } else {
      setDraft({ message: step.config?.message || "" });
    }
  };

  const closeEditor = () => setEditingStepId(null);

  const saveEditor = () => {
    if (!editingStep) return;

    const updated = (prev) =>
      prev.map((s) => {
        if (s.id !== editingStep.id) return s;
        if (s.type === "survey") {
          return {
            ...s,
            config: {
              ...s.config,
              intro: draft.intro || "",
              randomize_questions: !!draft.randomize,
              require_all_questions: !!draft.requireAll,
            },
          };
        }
        if (s.id === "welcome") {
          return {
            ...s,
            config: {
              ...s.config,
              welcomeTitle: draft.welcomeTitle || "",
              welcomeMessage: draft.welcomeMessage || "",
            },
          };
        }
        return {
          ...s,
          config: { ...s.config, message: draft.message || "" },
        };
      });

    setOrderedFlow(updated);
    setExperiment((prev) => ({ ...prev, steps: updated(prev.steps) }));
    closeEditor();
  };

  const goSurveys = () => {
    closeEditor();
    const id = experiment.id || experimentId || "new";
    navigate(`/add-survey?experimentId=${id}`);
  };

  const normalizeStepsFromBackend = (stepsRaw) => {
  const steps = Array.isArray(stepsRaw) ? stepsRaw : [];

  return steps.map((s) => {
    if (s?.type !== "survey") return s;

    const questions = s.questions || s.config?.questions || [];
    const title =
      s.title ||
      (s.survey_type ? `${String(s.survey_type).toUpperCase()} Questionnaire` : "Survey");

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


  //Load chatbots + experiment data
  useEffect(() => {
    const load = async () => {
      try {
        const botRes = await fetch(`${API}/chatbots`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (botRes.ok) {
          setChatbots(await botRes.json());
        }

        if (experimentId && experimentId !== "new") {
          const expRes = await fetch(`${API}/experiments/${experimentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (expRes.ok) {
            const data = await expRes.json();
            setExperiment({
              id: data.id,
              title: data.title || "",
              description: data.description || "",
              chatbot_id_a: data.chatbot_id_a || null,
              chatbot_id_b: data.chatbot_id_b || null,
              external_chatbot_url: data.external_chatbot_url || null,
              budget: data.budget || 1000,
              participant_limit: data.participant_limit || 100,
              randomization: data.randomization ?? true,
              anonymization: data.anonymization ?? true,
              // steps: buildPrototypeFlow(Array.isArray(data.steps) ? data.steps : []),
              steps: buildPrototypeFlow(normalizeStepsFromBackend(data.steps)),
            });
            setUseExternal(!!data.external_chatbot_url);
          }
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [experimentId, token]);

  //Save experiment
  const saveExperiment = async () => {
    if (!experiment.title.trim()) {
      console.error("Title is required");
      return null;
    }

    if (!useExternal) {
      if (!experiment.chatbot_id_a || !experiment.chatbot_id_b) {
        console.error("Both Chatbot A and Chatbot B are required");
        return null;
      }
      if (experiment.chatbot_id_a === experiment.chatbot_id_b) {
        console.error("Chatbot A and Chatbot B must be different");
        return null;
      }
     } //else if (!experiment.external_chatbot_url?.trim()) {
    //   console.error("External chatbot URL is required");
    //   return null;
    // }

    setSaving(true);

    const payload = {
      title: experiment.title.trim(),
      description: experiment.description || "",
      chatbot_id_a: useExternal ? null : experiment.chatbot_id_a,
      chatbot_id_b: useExternal ? null : experiment.chatbot_id_b,
      external_chatbot_url: useExternal ? experiment.external_chatbot_url.trim() : null,
      steps: Array.isArray(orderedFlow) && orderedFlow.length ? orderedFlow : experiment.steps,
      budget: Number(experiment.budget),
      participant_limit: experiment.participant_limit ? Number(experiment.participant_limit) : null,
      randomization: experiment.randomization,
      anonymization: experiment.anonymization,
    };

    try {
      const method = experiment.id ? "PUT" : "POST";
      const url = experiment.id ? `${API}/experiments/${experiment.id}` : `${API}/experiments`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save failed");
      }

      const data = await res.json();
      const id = experiment.id || data.experiment_id || data.id;

      setExperiment((prev) => ({ ...prev, id, steps: payload.steps }));
      return id;
    } catch (err) {
      console.error(err);
      console.error("Save failed: " + (err.message || "Unknown error"));
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    const id = await saveExperiment();
    if (!id) return;

    setActiveTab((prev) => {
      if (prev === "General") return "Participants";
      if (prev === "Participants") return "Surveys";
      if (prev === "Surveys") return "Flow";
      return prev;
    });
  };

 const handleCreateExperiment = async () => {
  setExperiment((prev) => ({ ...prev, steps: orderedFlow }));
  setSaving(true);

  try {
    const id = await saveExperiment();
    if (!id) throw new Error("Draft save failed");

    const res = await fetch(`${API}/experiments/${id}/finalize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ steps: orderedFlow }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Finalize failed");
    }

    console.log("Experiment finalized successfully");
   // show UI notification
   setShowSuccess(true);

  } catch (err) {
    console.error("Create failed:", err);
  } finally {
    setSaving(false);
  }
};

  const deleteSurveyStep = (surveyStepId) => {
    if (!confirm("Remove this survey from the flow?")) return;

    setExperiment((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== surveyStepId),
    }));

    setOrderedFlow((prev) => prev.filter((s) => s.id !== surveyStepId));

    if (editingStepId === surveyStepId) closeEditor();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[14px]">
      {showSuccess && (
  <div className="fixed top-6 right-6 z-50 flex items-start gap-4 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl min-w-[320px]">
    
    <div className="flex-1">
      <div className="font-bold text-lg">Experiment Created</div>
      <div className="text-sm opacity-90 mt-1">
        Your experiment has been created successfully.
      </div>
    </div>

    <button
      onClick={() => setShowSuccess(false)}
      className="text-white hover:text-gray-200 text-xl leading-none"
      aria-label="Close notification"
    >
      ✕
    </button>
  </div>
)}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* // change for top bar */}
    <div className="bg-white rounded-2xl shadow-lg p-3 mb-6">
    <div className="flex items-center gap-2 w-fit">
    
    {/* Back button - change for top bar */}
    <button onClick={() => navigate(-1)} 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-700 font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                </button>

    {/* Divider */}
    <div className="h-6 w-px bg-gray-200 mx-2" />

    {/* Tabs */}
            <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-5 py-3 rounded-xl font-bold flex items-center gap-5 transition-all ${
                  activeTab === tab
                    ? "py-3 bg-purple-600 text-white rounded-xl "
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {activeTab === tab && <CheckCircle className="w-4 h-4" />}
                {tab === "General" && <Settings className="w-4 h-4" />}
                {tab === "Participants" && <Users className="w-4 h-4" />}
                {tab === "Surveys" && <FileText className="w-4 h-4" />}
                {tab === "Flow" && <ListOrdered className="w-4 h-4" />}
                {tab}
              </button>
            ))}
            </div>
          </div>
        </div>
        {/* // change for top bar */}

        {/* // change for top bar */}
        <main className="space-y-8">
        {/* // change for top bar */}
          {/* GENERAL */}
          {activeTab === "General" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">General Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={experiment.title}
                    onChange={(e) => setExperiment({ ...experiment, title: e.target.value })}
                    placeholder="e.g. A/B Tone Comparison Study"
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-3">Chatbot Source *</label>

                  {/* <label className="flex items-center gap-3 mb-4 cursor-pointer">
                    <input
                      type="radio"
                      name="src"
                      checked={!useExternal}
                      onChange={() => setUseExternal(false)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <span className="font-medium">My saved chatbots (A/B Test)</span>
                  </label> */}

                  {!useExternal && (
                    <div className="space-y-6">
                      <div>
                        <label className="block font-semibold mb-2">Chatbot A *</label>
                        <select
                          value={experiment.chatbot_id_a || ""}
                          onChange={(e) => setExperiment({ ...experiment, chatbot_id_a: e.target.value ? Number(e.target.value) : null })}
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none bg-white"
                        >
                          <option value="">Select Chatbot A</option>
                          {chatbots.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Chatbot B *</label>
                        <select
                          value={experiment.chatbot_id_b || ""}
                          onChange={(e) => setExperiment({ ...experiment, chatbot_id_b: e.target.value ? Number(e.target.value) : null })}
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none bg-white"
                        >
                          <option value="">Select Chatbot B</option>
                          {chatbots
                            .filter((b) => b.id !== experiment.chatbot_id_a)
                            .map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="src"
                        checked={useExternal}
                        onChange={() => setUseExternal(true)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="text-lg font-bold text-purple-800">External chatbot (single)</span>
                    </label>

                    {useExternal && (
                      <div className="mt-5">
                        <label className="block font-semibold mb-2">External Chatbot URL *</label>
                        <input
                          type="url"
                          value={experiment.external_chatbot_url || ""}
                          onChange={(e) => setExperiment({ ...experiment, external_chatbot_url: e.target.value })}
                          placeholder="https://example.com/chatbot"
                          className="w-full px-5 py-3 border border-purple-300 rounded-xl focus:border-purple-600 outline-none bg-white"
                        />
                      </div>
                    )}
                  </div> */}
                </div>

                <div>
                  <label className="block font-semibold mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={experiment.description}
                    onChange={(e) => setExperiment({ ...experiment, description: e.target.value })}
                    placeholder="Testing real customer service bots..."
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PARTICIPANTS TAB */}
          {activeTab === "Participants" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Participant Settings</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block font-semibold mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={experiment.participant_limit || ""}
                    onChange={(e) =>
                      setExperiment({
                        ...experiment,
                        participant_limit: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Unlimited"
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="space-y-6">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">Randomize Order</span>
                      <span
                        className="relative group ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 cursor-pointer text-gray-500 text-[10px] font-bold"
                      >
                        i
                        <span className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-52 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100">
                          Randomizes the participants assigned to the experiment.
                        </span>
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={experiment.randomization}
                      onChange={(e) => setExperiment({ ...experiment, randomization: e.target.checked })}
                      className="w-6 h-6 text-purple-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SURVEYS TAB */}
          {activeTab === "Surveys" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Standardized Surveys</h2>
                <button
                  onClick={() => {
                    const id = experiment.id || experimentId || "new";
                    navigate(`/add-survey?experimentId=${id}`);
                  }}
                  className="px-6 py-3  bg-purple-600 text-white rounded-xl hover:shadow-md flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add Survey
                </button>
              </div>

              {experiment.steps.filter((s) => s.type === "survey").length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                  <p className="text-xl text-gray-600 mb-2">No surveys added</p>
                  <p className="text-gray-500">Click "Add Survey" to include SUS, CUQ, etc.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {experiment.steps
                    .filter((s) => s.type === "survey")
                    .map((s, i) => (
                      <div
                        key={s.id}
                        className="group relative p-6 bg-gradient-to-r from-purple-50 to-purple-50 rounded-2xl border border-purple-200 hover:border-purple-400 transition-all"
                      >
                        <button
                          onClick={() => deleteSurveyStep(s.id)}
                          className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-purple-900">{s.title}</h3>
                            <p className="text-purple-700 mt-1">
                              
                            </p>{/* //Fixed issues 20/01 */}
                            {(s.questions?.length ?? s.config?.questions?.length ?? 0)} question
{(s.questions?.length ?? s.config?.questions?.length ?? 0) !== 1 && "s"}

                          </div>
                          <div className="text-4xl font-bold text-purple-200">{i + 1}</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* FLOW TAB */}
          {activeTab === "Flow" && (
            <div className="flex gap-6">
              <div className={editingStep ? "flex-1 transition-all duration-300" : "w-full transition-all duration-300"}>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                  <h2 className="text-3xl font-bold mb-8">Experiment Flow</h2>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onFlowDragEnd}>
                    <SortableContext items={orderedFlow.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {orderedFlow.map((step, idx) => (
                          <SortableFlowItem
                            key={step.id}
                            step={step}
                            index={idx + 1}
                            onEdit={openEditor}
                            onDeleteSurvey={deleteSurveyStep}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div className="mt-12 flex justify-end gap-4">
                    <button
                      className="px-10 py-4 rounded-2xl border bg-white hover:bg-gray-50 font-semibold disabled:opacity-70"
                      disabled={saving}
                      onClick={async () => {
                        setExperiment((prev) => ({ ...prev, steps: orderedFlow }));
                        const id = await saveExperiment();
                        if (id) console.error("Saved as draft!");
                      }}
                    >
                      {saving ? "Saving..." : "Save Draft"}
                    </button>

                    <button
                      className="px-10 py-4 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold flex items-center gap-3 disabled:opacity-70"
                      disabled={saving}
                      onClick={handleCreateExperiment}
                    >
                      Create Experiment <span className="text-xl">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {editingStep && (
                <div className="w-[420px] shrink-0">
                  <StepConfigPanel
                    step={editingStep}
                    draft={draft}
                    setDraft={setDraft}
                    onClose={closeEditor}
                    onSave={saveEditor}
                    onGoSurveys={goSurveys}
                  />
                </div>
              )}
            </div>
          )}

          {/* Bottom actions (not in Flow tab) */}
          {activeTab !== "Flow" && (
            <div className="flex items-center justify-end gap-3 pb-2">
              <button
                onClick={saveExperiment}
                disabled={saving}
                className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleNext}
                disabled={saving}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:shadow-md flex items-center gap-2 disabled:opacity-70"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {error && <div className="text-red-600 mt-4">{error}</div>}
        {/* // change for top bar */}
        </main>
        {/* // change for top bar */}
      </div>
    </div>
  );
}
