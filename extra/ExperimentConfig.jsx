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

const API_BASE = "http://localhost:8000";
const TABS = ["General", "Participants", "Surveys", "Flow"];

/* ---------------- Flow Row ---------------- */
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
      className={[
        "flex items-center gap-4 p-4 rounded-2xl border shadow-sm transition",
        isSurvey ? "border-[#E9D5FF] bg-[#FAF5FF]" : "border-gray-200 bg-white",
        isDragging ? "opacity-80" : "opacity-100",
      ].join(" ")}
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
        <div className="text-sm text-gray-500 truncate">
          {step.subtitle || ""}
        </div>
      </div>

      <button
        type="button"
        className="w-10 h-10 rounded-xl border border-[#E9D5FF] bg-white hover:bg-[#F3E8FF] flex items-center justify-center"
        onClick={() => onEdit(step)}
        aria-label="Edit step"
        title="Edit"
      >
        <Pencil size={16} className="text-[#6D28D9]" />
      </button>

      {isSurvey && (
        <button
          type="button"
          className="w-10 h-10 rounded-xl border border-red-200 bg-white hover:bg-red-50 flex items-center justify-center"
          onClick={() => onDeleteSurvey(step)}
          aria-label="Remove survey"
          title="Remove survey"
        >
          <X size={16} className="text-red-500" />
        </button>
      )}
    </div>
  );
}

/* ---------------- Side panel editor (no overlay; pushes layout) ---------------- */
function StepConfigPanel({
  step,
  draft,
  setDraft,
  onClose,
  onSave,
  onGoSurveys,
}) {
  const isSurvey = step?.type === "survey";
  const isWelcome = step?.id === "welcome";

  if (!step) return null;

  const questionsCount =
    step.config?.questions?.length ?? step.config?.question_count ?? null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xl font-bold text-gray-900 truncate">
            Configure {step.title}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Configure Messages/Instructions to the participants here
          </div>
        </div>
        <button
          className="w-10 h-10 rounded-xl border bg-white hover:bg-gray-50 flex items-center justify-center"
          onClick={onClose}
          aria-label="Close panel"
          title="Close"
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {isSurvey ? (
          <>
            <div className="p-4 rounded-2xl border border-[#E9D5FF] bg-[#FAF5FF]">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Survey:</span> {step.title}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {questionsCount != null
                  ? `This survey contains ${questionsCount} questions`
                  : "Survey questions loaded from configuration"}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Survey Introduction
              </label>
              <textarea
                rows={4}
                value={draft.intro || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, intro: e.target.value }))
                }
                placeholder="Please answer the following questions about your experience..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none bg-white"
              />
            </div>
          </>
        ) : isWelcome ? (
          <>
            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Welcome Title
              </label>
              <input
                value={draft.welcomeTitle || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, welcomeTitle: e.target.value }))
                }
                placeholder="Welcome to our research study"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Welcome Message
              </label>
              <textarea
                rows={6}
                value={draft.welcomeMessage || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, welcomeMessage: e.target.value }))
                }
                placeholder="Thank you for participating in this study..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none bg-white"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block font-semibold text-gray-800 mb-2">
              Message
            </label>
            <textarea
              rows={8}
              value={draft.message || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, message: e.target.value }))
              }
              placeholder="Enter the text shown to participants..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none bg-white"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex items-center justify-end gap-3">
        <button
          className="px-6 py-3 rounded-xl border bg-white hover:bg-gray-50 font-semibold"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-6 py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold"
          onClick={onSave}
        >
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
  const experimentId = searchParams.get("experimentId");

  const initialTab = searchParams.get("tab") || "General";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatbots, setChatbots] = useState([]);
  const [error, setError] = useState("");

  const [useExternal, setUseExternal] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/auth");
    return null;
  }

  const [comparisonCount, setComparisonCount] = useState(2);

  const [experiment, setExperiment] = useState({
    id: null,
    title: "",
    description: "",
    chatbot_ids: [],
    external_chatbot_urls: [],
    chatbot_id: null,
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

  const ensureLength = (arr, n, fill = null) => {
    const next = Array.isArray(arr) ? [...arr] : [];
    while (next.length < n) next.push(fill);
    return next.slice(0, n);
  };

  const buildPrototypeFlow = (stepsFromState) => {
    const steps = Array.isArray(stepsFromState) ? stepsFromState : [];

    const hasAllBase =
      steps.some((s) => s.id === "welcome") &&
      steps.some((s) => s.id === "consent") &&
      steps.some((s) => s.id === "chatbot") &&
      steps.some((s) => s.id === "thankyou");

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

  const [orderedFlow, setOrderedFlow] = useState([]);
  useEffect(() => {
    setOrderedFlow(buildPrototypeFlow(experiment.steps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /* --------- Editor state (opens right panel; pushes page) --------- */
  const [editingStepId, setEditingStepId] = useState(null);

  const editingStep = useMemo(
    () => (orderedFlow || []).find((s) => s.id === editingStepId) || null,
    [orderedFlow, editingStepId]
  );

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
      return;
    }

    if (step.id === "welcome") {
      setDraft({
        welcomeTitle: step.config?.welcomeTitle || "",
        welcomeMessage: step.config?.welcomeMessage || "",
      });
      return;
    }

    setDraft({ message: step.config?.message || "" });
  };

  const closeEditor = () => setEditingStepId(null);

  const saveEditor = () => {
    if (!editingStep) return;

    const updated = (prevList) =>
      (prevList || []).map((s) => {
        if (s.id !== editingStep.id) return s;

        if (s.type === "survey") {
          return {
            ...s,
            config: {
              ...(s.config || {}),
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
              ...(s.config || {}),
              welcomeTitle: draft.welcomeTitle || "",
              welcomeMessage: draft.welcomeMessage || "",
            },
          };
        }

        return {
          ...s,
          config: {
            ...(s.config || {}),
            message: draft.message || "",
          },
        };
      });

    setOrderedFlow((prev) => updated(prev));
    setExperiment((prev) => ({ ...prev, steps: updated(prev.steps) }));
    closeEditor();
  };

  const goSurveys = () => {
    closeEditor();
    setActiveTab("Surveys");
  };

  /* ---------------- Load data ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const [botRes, expRes] = await Promise.all([
          fetch(`${API_BASE}/chatbots`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          experimentId && experimentId !== "new"
            ? fetch(`${API_BASE}/experiments/${experimentId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : null,
        ]);

        if (botRes.ok) setChatbots(await botRes.json());

        if (expRes && expRes.ok) {
          const data = await expRes.json();

          const loadedChatbotIds = Array.isArray(data.chatbot_ids)
            ? data.chatbot_ids
            : data.chatbot_id
            ? [data.chatbot_id]
            : [];

          const loadedExternalUrls = Array.isArray(data.external_chatbot_urls)
            ? data.external_chatbot_urls
            : data.external_chatbot_url
            ? [data.external_chatbot_url]
            : [];

          const isExternal = loadedExternalUrls.length > 0;

          const inferredCount = Math.max(
            1,
            (isExternal
              ? loadedExternalUrls.length
              : loadedChatbotIds.length) || 2
          );
          setComparisonCount(inferredCount);

          const loadedSteps = Array.isArray(data.steps) ? data.steps : [];

          setExperiment((prev) => ({
            ...prev,
            id: data.id,
            title: data.title || "",
            description: data.description || "",
            chatbot_ids: ensureLength(loadedChatbotIds, inferredCount, null),
            external_chatbot_urls: ensureLength(
              loadedExternalUrls,
              inferredCount,
              ""
            ),
            chatbot_id: data.chatbot_id || null,
            external_chatbot_url: data.external_chatbot_url || null,
            budget: data.budget || 1000,
            participant_limit: data.participant_limit || 100,
            randomization: data.randomization ?? true,
            anonymization: data.anonymization ?? true,
            steps: buildPrototypeFlow(
              loadedSteps.length ? loadedSteps : prev.steps
            ),
          }));

          setUseExternal(isExternal);
        } else {
          setComparisonCount(2);
          setExperiment((prev) => ({
            ...prev,
            chatbot_ids: ensureLength(prev.chatbot_ids, 2, null),
            external_chatbot_urls: ensureLength(
              prev.external_chatbot_urls,
              2,
              ""
            ),
            steps: buildPrototypeFlow(prev.steps),
          }));
        }
      } catch (err) {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId, token]);

  useEffect(() => {
    setExperiment((prev) => ({
      ...prev,
      chatbot_ids: ensureLength(prev.chatbot_ids, comparisonCount, null),
      external_chatbot_urls: ensureLength(
        prev.external_chatbot_urls,
        comparisonCount,
        ""
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonCount]);

  /* ---------------- Save ---------------- */
  const saveExperiment = async () => {
    if (!experiment.title.trim()) return alert("Title required");

    if (!useExternal) {
      const ids = (experiment.chatbot_ids || []).filter(Boolean);
      if (ids.length < 1) return alert("Please select at least 1 chatbot.");
      if (new Set(ids).size !== ids.length)
        return alert("Please choose different chatbots for each slot.");
    } else {
      const urls = (experiment.external_chatbot_urls || [])
        .map((u) => (u || "").trim())
        .filter(Boolean);
      if (urls.length < 1)
        return alert("Please enter at least 1 external chatbot URL.");
      if (new Set(urls).size !== urls.length)
        return alert("Please enter different URLs for each slot.");
    }

    setSaving(true);

    const cleanChatbotIds = (experiment.chatbot_ids || []).filter(Boolean);
    const cleanExternalUrls = (experiment.external_chatbot_urls || [])
      .map((u) => (u || "").trim())
      .filter(Boolean);

    const stepsToSave =
      Array.isArray(orderedFlow) && orderedFlow.length
        ? orderedFlow
        : experiment.steps;

    const payload = {
      title: experiment.title.trim(),
      description: experiment.description,
      chatbot_ids: useExternal ? [] : cleanChatbotIds,
      external_chatbot_urls: useExternal ? cleanExternalUrls : [],
      chatbot_id: useExternal ? null : cleanChatbotIds[0] ?? null,
      external_chatbot_url: useExternal ? cleanExternalUrls[0] ?? null : null,
      steps: stepsToSave,
      budget: Number(experiment.budget),
      participant_limit: experiment.participant_limit
        ? Number(experiment.participant_limit)
        : null,
      randomization: experiment.randomization,
      anonymization: experiment.anonymization,
      status: "active",
    };

    try {
      const method = experiment.id ? "PUT" : "POST";
      const url = experiment.id
        ? `${API_BASE}/experiments/${experiment.id}`
        : `${API_BASE}/experiments`;

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

      setExperiment((prev) => ({ ...prev, id, steps: stepsToSave }));
      return id;
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err.message || "Unknown error"));
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
      return prev; // Flow: no next
    });
  };

  const handleCreateExperiment = async () => {
    // Save and go back to experiments list
    setExperiment((prev) => ({ ...prev, steps: orderedFlow }));
    const id = await saveExperiment();
    if (!id) return;

    // experiments list page
    navigate("/home");
  };

  const deleteSurveyStep = (surveyStepId) => {
    if (!confirm("Remove this survey from the flow?")) return;
    setExperiment((prev) => ({
      ...prev,
      steps: (prev.steps || []).filter((s) => s.id !== surveyStepId),
    }));
    setOrderedFlow((prev) => (prev || []).filter((s) => s.id !== surveyStepId));
    if (editingStepId === surveyStepId) closeEditor();
  };

  const setChatbotSlot = (idx, value) => {
    setExperiment((prev) => {
      const next = ensureLength(prev.chatbot_ids, comparisonCount, null);
      next[idx] = value ? Number(value) : null;
      return {
        ...prev,
        chatbot_ids: next,
        chatbot_id: next.filter(Boolean)[0] ?? null,
      };
    });
  };

  const setExternalSlot = (idx, value) => {
    setExperiment((prev) => {
      const next = ensureLength(prev.external_chatbot_urls, comparisonCount, "");
      next[idx] = value;
      const cleanedFirst =
        next.map((u) => (u || "").trim()).filter(Boolean)[0] ?? null;
      return {
        ...prev,
        external_chatbot_urls: next,
        external_chatbot_url: cleanedFirst,
      };
    });
  };

  const slotLabel = (i) => {
    const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (i < base.length) return `Chatbot ${base[i]}`;
    return `Chatbot ${i + 1}`;
  };

  const usedIds = useMemo(
    () => new Set((experiment.chatbot_ids || []).filter(Boolean)),
    [experiment.chatbot_ids]
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-[14px]">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-5 py-3 rounded-xl mb-2 font-bold flex items-center gap-3 transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {activeTab === tab && <CheckCircle className="w-4 h-4" />}
                  {tab === "General" && <FileText className="w-4 h-4" />}
                  {tab === "Participants" && <Users className="w-4 h-4" />}
                  {tab === "Surveys" && <FileText className="w-4 h-4" />}
                  {tab === "Flow" && <ListOrdered className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="col-span-9 space-y-8">
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
                      onChange={(e) =>
                        setExperiment({ ...experiment, title: e.target.value })
                      }
                      placeholder="e.g. X Chatbot Study"
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">
                      Chatbot Source *
                    </label>

                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                      <input
                        type="radio"
                        name="src"
                        checked={!useExternal}
                        onChange={() => setUseExternal(false)}
                        className="w-5 h-5 text-indigo-600"
                      />
                      <span className="font-medium">My saved chatbots</span>
                    </label>

                    {!useExternal && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                          <div>
                            <div className="font-semibold">
                              Comparison setup
                            </div>
                            <div className="text-sm text-gray-600">
                              Choose 1 or more chatbots (A/B/C...).
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Count</span>
                            <select
                              value={comparisonCount}
                              onChange={(e) =>
                                setComparisonCount(Number(e.target.value))
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                          </div>
                        </div>

                        {Array.from({ length: comparisonCount }).map((_, i) => {
                          const current = experiment.chatbot_ids?.[i] ?? null;
                          return (
                            <div key={i}>
                              <label className="block font-semibold mb-2">
                                {slotLabel(i)} *
                              </label>
                              <select
                                value={current || ""}
                                onChange={(e) =>
                                  setChatbotSlot(i, e.target.value)
                                }
                                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none bg-white"
                              >
                                <option value="">Select chatbot</option>
                                {chatbots.map((b) => {
                                  const isSelectedSomewhereElse =
                                    usedIds.has(b.id) && b.id !== current;
                                  return (
                                    <option
                                      key={b.id}
                                      value={b.id}
                                      disabled={isSelectedSomewhereElse}
                                    >
                                      {b.name}
                                      {isSelectedSomewhereElse
                                        ? " (already selected)"
                                        : ""}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="src"
                          checked={useExternal}
                          onChange={() => setUseExternal(true)}
                          className="w-5 h-5 text-purple-600"
                        />
                        <span className="text-lg font-bold text-purple-800">
                          External chatbot (Test you own chatbot)
                        </span>
                      </label>

                      {useExternal && (
                        <div className="mt-5 space-y-4">
                          <div className="flex items-center justify-between bg-white/60 border border-purple-200 rounded-xl px-4 py-3">
                            <div>
                              <div className="font-semibold text-purple-900">
                                Comparison setup
                              </div>
                              <div className="text-sm text-purple-800/80">
                                Enter 1 or more URLs (A/B/C...).
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-purple-900/80">
                                Count
                              </span>
                              <select
                                value={comparisonCount}
                                onChange={(e) =>
                                  setComparisonCount(Number(e.target.value))
                                }
                                className="px-3 py-2 border border-purple-300 rounded-lg bg-white"
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                              </select>
                            </div>
                          </div>

                          {Array.from({ length: comparisonCount }).map(
                            (_, i) => (
                              <div key={i}>
                                <label className="block font-semibold mb-2 text-purple-900">
                                  {slotLabel(i)} URL *
                                </label>
                                <input
                                  type="url"
                                  placeholder="https://www.lego.com/en-us/service/chat"
                                  value={
                                    experiment.external_chatbot_urls?.[i] ?? ""
                                  }
                                  onChange={(e) =>
                                    setExternalSlot(i, e.target.value)
                                  }
                                  className="w-full px-5 py-3 border border-purple-300 rounded-xl focus:border-purple-600 outline-none bg-white"
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={experiment.description}
                      onChange={(e) =>
                        setExperiment({
                          ...experiment,
                          description: e.target.value,
                        })
                      }
                      placeholder="Testing real customer service bots..."
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PARTICIPANTS */}
            {activeTab === "Participants" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Participant Settings
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block font-semibold mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={experiment.participant_limit || ""}
                      onChange={(e) =>
                        setExperiment({
                          ...experiment,
                          participant_limit: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      placeholder="Unlimited"
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div className="space-y-6 m-8">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">Randomize Order</span>
                        &nbsp;
                        <span
                          className="relative group ml-[1px] inline-flex items-center justify-center
                   w-4 h-4 rounded-full border border-gray-400
                   cursor-pointer text-gray-500 text-[10px] font-bold"
                        >
                          i
                          <span
                            className="pointer-events-none + absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-52 
                     bg-gray-800 text-white text-xs rounded p-2 
                     opacity-0 group-hover:opacity-100"
                          >
                            Randomizes the order of chatbots shown to users.
                          </span>
                        </span>
                      </div>

                      <input
                        type="checkbox"
                        checked={experiment.randomization}
                        onChange={(e) =>
                          setExperiment({
                            ...experiment,
                            randomization: e.target.checked,
                          })
                        }
                        className="w-6 h-6 text-indigo-600"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SURVEYS */}
            {activeTab === "Surveys" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Standardized Surveys</h2>
                  <button
                    onClick={() => {
                      const id = experiment.id || experimentId || "new";
                      navigate(`/add-survey?experimentId=${id}`);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow hover:shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Survey
                  </button>
                </div>

                {experiment.steps.filter((s) => s.type === "survey").length ===
                0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-xl text-gray-600 mb-2">
                      No surveys added
                    </p>
                    <p className="text-gray-500">
                      Click "Add Survey" to include SUS, CUQ, etc.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {experiment.steps
                      .filter((s) => s.type === "survey")
                      .map((s, i) => (
                        <div
                          key={s.id}
                          className="group relative p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 hover:border-indigo-400 transition-all"
                        >
                          <button
                            onClick={() => deleteSurveyStep(s.id)}
                            className="absolute top-3 right-3 p-2 bg-red-100 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-indigo-900">
                                {s.title}
                              </h3>
                              <p className="text-indigo-700 mt-1">
                                {s.config?.questions?.length || 0} question
                                {(s.config?.questions?.length || 0) !== 1 &&
                                  "s"}
                              </p>
                            </div>
                            <div className="text-4xl font-bold text-indigo-200">
                              {i + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* FLOW */}
            {activeTab === "Flow" && (
              <div className="flex gap-6">
                <div
                  className={
                    editingStep
                      ? "flex-1 transition-all duration-300"
                      : "w-full transition-all duration-300"
                  }
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
                    <h2 className="text-3xl font-bold mb-8">Experiment Flow</h2>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={onFlowDragEnd}
                    >
                      <SortableContext
                        items={(orderedFlow || []).map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {(orderedFlow || []).map((step, idx) => (
                            <SortableFlowItem
                              key={step.id}
                              step={step}
                              index={idx + 1}
                              onEdit={openEditor}
                              onDeleteSurvey={(st) => deleteSurveyStep(st.id)}
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
                          setExperiment((prev) => ({
                            ...prev,
                            steps: orderedFlow,
                          }));
                          await saveExperiment();
                        }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>

                      {/* CHANGED: Remove Next, add Create Experiment */}
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

            {/* Bottom actions (not shown in Flow) */}
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
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow hover:shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {error ? <div className="text-red-600">{error}</div> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
