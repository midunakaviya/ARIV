import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:8000";

/* -------------------------------
   Helpers
-------------------------------- */
const uid = (prefix = "q") =>
  `${prefix}_${crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

const LIKERT7_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Somewhat disagree",
  "Neutral",
  "Somewhat agree",
  "Agree",
  "Strongly agree",
];

const DEFAULT_DEMOGRAPHICS = [
  {
    id: "age_range",
    text: "What is your age range?",
    type: "select",
    options: [
      "Under 18",
      "18–24",
      "25–34",
      "35–44",
      "45–54",
      "55–64",
      "65+",
      "Prefer not to say",
    ],
    required: true,
  },
  {
    id: "gender",
    text: "What is your gender?",
    type: "radio",
    options: ["Female", "Male", "Non-binary", "Prefer not to say", "Other"],
    required: true,
  },
  {
    id: "region",
    text: "Which region do you currently live in?",
    type: "select",
    options: [
      "Europe",
      "Asia",
      "North America",
      "South America",
      "Africa",
      "Oceania",
      "Prefer not to say",
    ],
    required: true,
  },
  {
    id: "education",
    text: "What is your highest level of education?",
    type: "select",
    options: [
      "High school or equivalent",
      "Some college / vocational training",
      "Bachelor's degree",
      "Master's degree",
      "PhD or higher",
      "Prefer not to say",
    ],
    required: true,
  },
  {
    id: "chatbot_use",
    text: "How often do you use chatbots or AI assistants?",
    type: "radio",
    options: ["Never", "Rarely", "Sometimes", "Often", "Every day"],
    required: true,
  },
  {
    id: "language_used",
    text: "Which language did you mainly use to interact with the chatbot?",
    type: "select",
    options: [
      "English",
      "German",
      "Tamil",
      "Hindi",
      "French",
      "Spanish",
      "Other",
      "Prefer not to say",
    ],
    required: true,
  },
];

const UEQ_26_ITEMS = [
  "annoying — enjoyable",
  "not understandable — understandable",
  "creative — dull",
  "easy to learn — difficult to learn",
  "valuable — inferior",
  "boring — exciting",
  "not interesting — interesting",
  "unpredictable — predictable",
  "fast — slow",
  "inventive — conventional",
  "obstructive — supportive",
  "good — bad",
  "complicated — easy",
  "unlikable — pleasing",
  "usual — leading edge",
  "unpleasant — pleasant",
  "secure — not secure",
  "motivating — demotivating",
  "meets expectations — does not meet expectations",
  "inefficient — efficient",
  "clear — confusing",
  "impractical — practical",
  "organized — cluttered",
  "attractive — unattractive",
  "friendly — unfriendly",
  "conservative — innovative",
];

const SURVEYS = {

  demographics: {
    name: "Demographics Questionnaire",
    subtitle: "Customizable – anonymization-friendly background info",
    type: "demographics",
    questions: DEFAULT_DEMOGRAPHICS,
  },

  sus: {
    name: "System Usability Scale (SUS)",
    subtitle: "10 questions – Gold standard for usability",
    type: "sus",
    questions: [
      "I think that I would like to use this chatbot frequently",
      "I found the chatbot unnecessarily complex",
      "I thought the chatbot was easy to use",
      "I think that I would need the support of a technical person to use this chatbot",
      "I found the various functions in this chatbot were well integrated",
      "I thought there was too much inconsistency in this chatbot",
      "I would imagine that most people would learn to use this chatbot very quickly",
      "I found the chatbot very cumbersome to use",
      "I felt very confident using the chatbot",
      "I needed to learn a lot of things before I could get going with this chatbot",
    ].map((text, i) => ({
      id: `sus_${i + 1}`,
      text,
      type: "likert5",
      options: [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
      ],
      required: true,
    })),
  },

  cuq: {
    name: "Chatbot Usability Questionnaire (CUQ)",
    subtitle: "16 questions – Specifically designed for chatbots",
    type: "cuq",
    questions: [
      "The chatbot understood my queries well",
      "The responses were relevant to my questions",
      "The conversation felt natural",
      "I knew what to say next at each step",
      "The chatbot was helpful",
      "I would use this chatbot again",
      "The chatbot responded too slowly",
      "The responses were too long or too short",
      "I felt in control of the conversation",
      "The chatbot recovered well when I made a mistake",
      "The tone of the chatbot was appropriate",
      "I trusted the information provided by the chatbot",
      "The chatbot asked too many unnecessary questions",
      "It was easy to correct mistakes during the conversation",
      "The chatbot remembered what we talked about earlier",
      "Overall, I am satisfied with this chatbot",
    ].map((text, i) => ({
      id: `cuq_${i + 1}`,
      text,
      type: "likert5",
      options: [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
      ],
      required: true,
    })),
  },

  attrakdiff: {
    name: "AttrakDiff (Short)",
    subtitle: "12 semantic differential items – Hedonic + Pragmatic quality",
    type: "attrakdiff",
    questions: [
      "Complicated — Simple",
      "Impractical — Practical",
      "Unpredictable — Predictable",
      "Confusing — Clearly structured",
      "Boring — Exciting",
      "Not interesting — Interesting",
      "Conventional — Inventive",
      "Usual — Leading edge",
      "Unpleasant — Pleasant",
      "Ugly — Attractive",
      "Unfriendly — Friendly",
      "Repelling — Inviting",
    ].map((text, i) => ({
      id: `ad_${i + 1}`,
      text,
      type: "semantic7",
      options: [1, 2, 3, 4, 5, 6, 7],
      labels: text.split(" — "),
      required: true,
    })),
  },

  ueq: {
    name: "UEQ (User Experience Questionnaire)",
    subtitle: "26 semantic differential items – Pragmatic + Hedonic qualities",
    type: "ueq",
    questions: UEQ_26_ITEMS.map((pair, i) => ({
      id: `ueq_${i + 1}`,
      text: pair,
      type: "semantic7",
      options: [1, 2, 3, 4, 5, 6, 7],
      labels: pair.split(" — "),
      required: true,
    })),
  },

  nasa_tlx: {
    name: "NASA-TLX (Modified Workload)",
    subtitle: "6 ratings (0–100) – Mental workload & frustration",
    type: "nasa_tlx",
    questions: [
      {
        id: "tlx_mental",
        text: "Mental Demand: How mentally demanding was the interaction?",
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        leftLabel: "Very low",
        rightLabel: "Very high",
        required: true,
      },
      {
        id: "tlx_physical",
        text: "Physical Demand: How physically demanding was the interaction?",
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        leftLabel: "Very low",
        rightLabel: "Very high",
        required: true,
      },
      {
        id: "tlx_temporal",
        text: "Temporal Demand: How hurried or rushed was the interaction?",
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        leftLabel: "Very low",
        rightLabel: "Very high",
        required: true,
      },
      {
        id: "tlx_performance",
        text: "Performance: How successful were you in accomplishing what you wanted?",
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        leftLabel: "Not successful",
        rightLabel: "Very successful",
        required: true,
      },
      {
        id: "tlx_effort",
        text: "Effort: How hard did you have to work to accomplish your level of performance?",
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        leftLabel: "Very low",
        rightLabel: "Very high",
        required: true,
      },
      {
        id: "tlx_frustration",
        text: "Frustration: How insecure, discouraged, irritated, stressed, or annoyed were you?",
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        leftLabel: "Very low",
        rightLabel: "Very high",
        required: true,
      },
    ],
  },

  trust_chatbot: {
    name: "Trust in Chatbot Scale",
    subtitle: "10 questions – Trust, reliability, predictability (Likert 7)",
    type: "trust_chatbot",
    questions: [
      "I trust the chatbot’s responses.",
      "The chatbot provides reliable information.",
      "The chatbot behaves consistently.",
      "I can depend on the chatbot to help me complete my task.",
      "The chatbot’s responses are credible.",
      "I feel confident following the chatbot’s suggestions.",
      "The chatbot is transparent enough for me to understand its responses.",
      "The chatbot makes too many mistakes. (reverse)",
      "The chatbot’s advice is appropriate for my needs.",
      "Overall, I feel I can rely on this chatbot.",
    ].map((text, i) => ({
      id: `trust_${i + 1}`,
      text,
      type: "likert7",
      options: [1, 2, 3, 4, 5, 6, 7],
      labels: LIKERT7_LABELS,
      required: true,
    })),
  },

  bus15: {
    name: "BUS-15 (Brand/User Satisfaction – 15 items)",
    subtitle:
      "15 questions – Perceived brand experience & satisfaction (Likert 7)",
    type: "bus15",
    questions: [
      "The chatbot experience was pleasant.",
      "The chatbot matched the brand’s tone and style.",
      "The chatbot made the brand feel more trustworthy.",
      "The chatbot made the brand feel more professional.",
      "The chatbot made the brand feel more helpful.",
      "The chatbot interaction improved my overall impression of the brand.",
      "The chatbot made it easier to get support from the brand.",
      "The chatbot responses felt consistent with the brand.",
      "The chatbot communication felt clear and understandable.",
      "The chatbot handled my requests effectively.",
      "The chatbot made me feel valued as a customer.",
      "I would use this brand’s chatbot again.",
      "I would recommend this brand’s chatbot to others.",
      "I am satisfied with the service provided by this chatbot.",
      "Overall, the chatbot improved my experience with the brand.",
    ].map((text, i) => ({
      id: `bus15_${i + 1}`,
      text,
      type: "likert7",
      options: [1, 2, 3, 4, 5, 6, 7],
      labels: LIKERT7_LABELS,
      required: true,
    })),
  },

  tam: {
    name: "TAM (Technology Acceptance Model)",
    subtitle: "12 questions – Usefulness, Ease of Use, Intention (Likert 7)",
    type: "tam",
    questions: [
      "Using this chatbot improves my performance in completing the task.",
      "Using this chatbot increases my productivity for this task.",
      "Using this chatbot enhances my effectiveness in getting what I need.",
      "Overall, I find this chatbot useful for this task.",
      "Learning to use this chatbot was easy for me.",
      "I find the chatbot easy to use.",
      "It is easy for me to become skillful at using this chatbot.",
      "Interacting with this chatbot is clear and understandable.",
      "Assuming I have access, I intend to use this chatbot in the future.",
      "I would use this chatbot frequently if it were available.",
      "I would choose to use this chatbot over other support channels.",
      "I would recommend using this chatbot to others.",
    ].map((text, i) => ({
      id: `tam_${i + 1}`,
      text,
      type: "likert7",
      options: [1, 2, 3, 4, 5, 6, 7],
      labels: LIKERT7_LABELS,
      required: true,
    })),
  },

  seq: {
    name: "SEQ (Single Ease Question)",
    subtitle: "1 question – Quick measure of task ease (Likert 7)",
    type: "seq",
    questions: [
      {
        id: "seq_1",
        text: "Overall, how easy was it to complete your task using the chatbot?",
        type: "likert7",
        options: [1, 2, 3, 4, 5, 6, 7],
        labels: [
          "Very difficult",
          "Difficult",
          "Somewhat difficult",
          "Neutral",
          "Somewhat easy",
          "Easy",
          "Very easy",
        ],
        required: true,
      },
    ],
  },
};

export default function AddSurvey() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const experimentId = searchParams.get("experimentId");

  const [selectedSurveys, setSelectedSurveys] = useState(new Set());
  const [selectionOrder, setSelectionOrder] = useState([]);
  const [alreadyAdded, setAlreadyAdded] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [demographicQuestions, setDemographicQuestions] =
    useState(DEFAULT_DEMOGRAPHICS);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!experimentId || experimentId === "new") return;

    fetch(`${API_BASE}/experiments/${experimentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const added = new Set();
        (data.steps || []).forEach((step) => {
          if (step.type === "survey" && step.survey_type)
            added.add(step.survey_type);
        });
        setAlreadyAdded(added);
      })
      .catch(() => {});
  }, [experimentId, token]);

  const toggleSurvey = (key) => {
    const surveyType = SURVEYS[key]?.type;
    if (alreadyAdded.has(surveyType)) return;

    setSelectedSurveys((prev) => {
      const next = new Set(prev);
      const willSelect = !prev.has(key);

      if (willSelect) next.add(key);
      else next.delete(key);

      setSelectionOrder((orderPrev) => {
        const order = [...orderPrev];
        const idx = order.indexOf(key);
        if (idx !== -1) order.splice(idx, 1);
        if (willSelect) order.push(key);
        return order;
      });

      return next;
    });
  };

  const getSurveyQuestionsForKey = (key) => {
    if (key === "demographics") return demographicQuestions;
    return SURVEYS[key]?.questions ?? [];
  };

  const saveToExperiment = async () => {
    if (selectedSurveys.size === 0) {
      setError("Please select at least one survey");
      return;
    }

    setSaving(true);
    setError("");

    try {
      for (const key of selectedSurveys) {
        const survey = SURVEYS[key];
        const questionsToSend =
          key === "demographics" ? demographicQuestions : survey.questions;

        const response = await fetch(
          `${API_BASE}/experiments/${experimentId}/add-survey`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              survey_type: survey.type,
              title: survey.name,
              questions: questionsToSend,
            }),
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(`${survey.name}: ${err.detail || "Failed to add"}`);
        }
      }

      const count = selectedSurveys.size;
      alert(`${count} survey${count > 1 ? "s" : ""} added successfully!`);
      navigate(`/experiment-config?experimentId=${experimentId}&tab=Surveys`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const lastSelectedKey =
    selectionOrder.length > 0 ? selectionOrder[selectionOrder.length - 1] : null;

  const previewSurvey = useMemo(() => {
    if (!lastSelectedKey) return null;
    const base = SURVEYS[lastSelectedKey];
    if (!base) return null;
    if (lastSelectedKey === "demographics")
      return { ...base, questions: demographicQuestions };
    return base;
  }, [lastSelectedKey, demographicQuestions]);

  /* -------------------------------
     Demographics editor actions
  -------------------------------- */
  const addDemographicQuestion = () => {
    setDemographicQuestions((prev) => [
      ...prev,
      { id: uid("demo"), text: "New question", type: "text", required: false },
    ]);
  };

  const deleteDemographicQuestion = (id) => {
    setDemographicQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateDemographicQuestion = (id, patch) => {
    setDemographicQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );
  };

  const parseOptionsLines = (s) =>
    s
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 text-sm">
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate(`/experiment-config?experimentId=${experimentId}&tab=Surveys`)
              }
              className="flex items-center gap-2 text-gray-600 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Add Survey to Experiment</h1>
          </div>

          <button
            onClick={saveToExperiment}
            disabled={saving || selectedSurveys.size === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : `Save (${selectedSurveys.size})`}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-300 text-red-700 px-5 py-3 rounded-xl">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {Object.entries(SURVEYS).map(([key, survey]) => {
            const isSelected = selectedSurveys.has(key);
            const isAdded = alreadyAdded.has(survey.type);
            const count = getSurveyQuestionsForKey(key).length;

            return (
              <button
                key={key}
                onClick={() => toggleSurvey(key)}
                disabled={isAdded}
                className={`relative p-5 rounded-2xl border-2 transition-all text-left h-full ${
                  isAdded
                    ? "border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "border-indigo-600 bg-indigo-50 shadow-lg"
                    : "border-gray-200 hover:border-indigo-400 hover:shadow"
                }`}
              >
                {isSelected && !isAdded && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-6 h-6 text-indigo-600" />
                  </div>
                )}
                {isAdded && (
                  <div className="absolute top-3 right-3 text-green-600 font-bold text-xs">
                    Added
                  </div>
                )}

                <h3 className="text-lg font-bold mb-2">{survey.name}</h3>
                <p className="text-gray-600 mb-4 text-xs">{survey.subtitle}</p>

                <div className="text-3xl font-bold text-indigo-600">
                  {count}
                  <span className="text-sm text-gray-600 ml-2">q</span>
                </div>
              </button>
            );
          })}
        </div>

        {previewSurvey && (
          <div className="bg-white rounded-2xl shadow p-7">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Preview: {previewSurvey.name}
            </h2>

            {selectedSurveys.size > 1 && (
              <p className="text-center text-gray-500 mb-5 text-xs">
                Showing last selected • All {selectedSurveys.size} will be added
              </p>
            )}

            {/* ✅ Demographics editor */}
            {lastSelectedKey === "demographics" && (
              <div className="max-w-4xl mx-auto mb-6">
                <div className="flex items-center justify-between gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                  <div>
                    <p className="font-bold text-sm">
                      Customize Demographics
                    </p>
                    <p className="text-xs text-gray-600">
                      Add / edit / delete questions [Avoid names, emails, phone, address]
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {demographicQuestions.map((q) => {
                    const optionsText = (q.options || []).join("\n");
                    const isOptionsType = q.type === "select" || q.type === "radio";

                    return (
                      <div
                        key={q.id}
                        className="border border-gray-200 rounded-2xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">
                              Question
                            </label>
                            <input
                              value={q.text}
                              onChange={(e) =>
                                updateDemographicQuestion(q.id, {
                                  text: e.target.value,
                                })
                              }
                              className="w-full mt-1 p-3 border rounded-xl text-sm"
                            />
                          </div>

                          <button
                            onClick={() => deleteDemographicQuestion(q.id)}
                            className="mt-6 px-3 py-2 rounded-xl border hover:bg-red-50 hover:border-red-200 flex items-center gap-2"
                            type="button"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                          <div>
                            <label className="text-xs text-gray-500">Type</label>
                            <select
                              value={q.type}
                              onChange={(e) => {
                                const newType = e.target.value;

                                if (newType === "select" || newType === "radio") {
                                  updateDemographicQuestion(q.id, {
                                    type: newType,
                                    options: q.options ?? ["Option 1"],
                                  });
                                } else {
                                  updateDemographicQuestion(q.id, {
                                    type: newType,
                                    options: undefined,
                                  });
                                }
                              }}
                              className="w-full mt-1 p-3 border rounded-xl text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="select">Dropdown (Select)</option>
                              <option value="radio">Radio buttons</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 mt-6">
                            <input
                              id={`req_${q.id}`}
                              type="checkbox"
                              checked={!!q.required}
                              onChange={(e) =>
                                updateDemographicQuestion(q.id, {
                                  required: e.target.checked,
                                })
                              }
                              className="w-4 h-4"
                            />
                            <label htmlFor={`req_${q.id}`} className="text-sm">
                              Required
                            </label>
                          </div>

                          {q.type === "number" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500">Min</label>
                                <input
                                  type="number"
                                  value={q.min ?? ""}
                                  onChange={(e) =>
                                    updateDemographicQuestion(q.id, {
                                      min:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    })
                                  }
                                  className="w-full mt-1 p-3 border rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Max</label>
                                <input
                                  type="number"
                                  value={q.max ?? ""}
                                  onChange={(e) =>
                                    updateDemographicQuestion(q.id, {
                                      max:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    })
                                  }
                                  className="w-full mt-1 p-3 border rounded-xl text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {isOptionsType && (
                          <div className="mt-3">
                            <label className="text-xs text-gray-500">
                              Options (one per line)
                            </label>
                            <textarea
                              value={optionsText}
                              onChange={(e) =>
                                updateDemographicQuestion(q.id, {
                                  options: parseOptionsLines(e.target.value),
                                })
                              }
                              className="w-full mt-1 p-3 border rounded-xl text-sm min-h-[90px]"
                            />
                            <p className="text-[11px] text-gray-500 mt-2">
                              Preview will render as{" "}
                              {q.type === "radio" ? "radio buttons" : "a dropdown"}.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
               <div className="mt-6 flex justify-center">
               <button
                 onClick={addDemographicQuestion}
                 type="button"
                 className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center gap-2"
                    >
                 <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
              </div>
            )}

            {/* Preview */}
            <div className="space-y-6 max-w-4xl mx-auto">
              {previewSurvey.questions.map((q, i) => (
                <div key={q.id} className="border border-gray-200 rounded-xl p-5">
                  <p className="font-medium text-base mb-3">
                    <span className="text-indigo-600 font-bold mr-2">
                      {i + 1}.
                    </span>
                    {q.text}
                    {q.required ? <span className="text-red-500 ml-2">*</span> : null}
                  </p>

                  {q.type === "likert5" && (
                    <div className="grid grid-cols-5 gap-2 text-center text-[11px]">
                      {q.options.map((opt) => (
                        <div key={opt}>
                          <div className="w-8 h-8 mx-auto mb-2 border-2 border-gray-400 rounded-full" />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === "likert7" && (
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
                      {(q.labels || []).map((lab, idx) => (
                        <div key={lab || idx}>
                          <div className="w-7 h-7 mx-auto mb-2 border-2 border-gray-400 rounded-full" />
                          <span className="block leading-tight">{lab}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === "semantic7" && (
                    <div className="flex justify-between items-center text-xs gap-3">
                      <span className="font-medium w-24">{q.labels?.[0]}</span>
                      <div className="flex gap-2 flex-1 justify-center">
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                          <div key={n} className="w-7 h-7 border-2 border-gray-400 rounded-full" />
                        ))}
                      </div>
                      <span className="font-medium w-24 text-right">{q.labels?.[1]}</span>
                    </div>
                  )}

                  {q.type === "slider" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>{q.leftLabel || "Low"}</span>
                        <span>{q.rightLabel || "High"}</span>
                      </div>
                      <input
                        type="range"
                        min={q.min ?? 0}
                        max={q.max ?? 100}
                        step={q.step ?? 1}
                        defaultValue={Math.round(((q.min ?? 0) + (q.max ?? 100)) / 2)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>{q.min ?? 0}</span>
                        <span>{q.max ?? 100}</span>
                      </div>
                    </div>
                  )}

                  {q.type === "select" && (
                    <select className="w-full p-3 border rounded-lg mt-2 text-sm">
                      <option>Select...</option>
                      {(q.options || []).map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  )}

                  {q.type === "radio" && (
                    <div className="mt-2 space-y-2">
                      {(q.options || []).map((opt) => (
                        <label key={opt} className="flex items-center gap-3 text-sm">
                          <input type="radio" name={`preview_${q.id}`} className="w-4 h-4" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {(q.type === "text" || q.type === "number") && (
                    <input
                      type={q.type}
                      placeholder={q.type === "number" ? "e.g. 28" : "Your answer..."}
                      className="w-full p-3 border rounded-lg mt-2 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
