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
      "65-74",
      "75+",
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
  "Annoying — Enjoyable",
      "Good — Bad",
      "Unlikable — Pleasing",
      "Unpleasant — Pleasant",
      "Attractive — Unattractive",
      "Friendly — Unfriendly",
      "Not understandable — Understandable",
      "Easy to learn — Difficult to learn ",
      "Complicated — Easy",
      "Clear  — Confusing",
      "Fast  — Slow",
      "Inefficient  — Efficient",
      "Impractical  — Practical",
      "Organized  — Cluttered",
      "Unpredictable  — Predictable",
      "Obstructive  — Supportive",
      "Secure  — Not secure",
      "Meets expectations  — Does not meet expectations.",
      "Valuable  — Inferior",
      "Boring — Exciting",
      "Not interesting — Interesting",
      "Motivating  — Demotivating",
      "Creative  — Dull",
      "Inventive  — Conventional",
      "Usual  —  Leading-edge",
      "Conservative  — Innovative",
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
    subtitle: "Gold standard for usability", //Fixed issues 20/01
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
    subtitle: "Specifically designed for chatbots", //Fixed issues 20/01
    type: "cuq",
    questions: [
      "The chatbot’s personality was realistic and engaging", 
      "The chatbot seemed too robotic",
      "The chatbot was welcoming during initial setup",
      "The chatbot seemed very unfriendly",
      "The chatbot explained its scope and purpose well",
      "The chatbot gave no indication as to its purpose",
      "The chatbot was easy to navigate",
      "It would be easy to get confused when using the chatbot",
      "The chatbot understood me well",
      "The chatbot failed to recognise a lot of my inputs",
      "Chatbot responses were useful, appropriate and informative",
      "Chatbot responses were not relevant",
      "The chatbot coped well with any errors or mistakes",
      "The chatbot seemed unable to handle any errors",
      "The chatbot was very easy to use",
      "The chatbot was very complex",
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
    subtitle: "Hedonic + Pragmatic quality", //Fixed issues 20/01
    type: "attrakdiff",
    questions: [
      "Human — Technical",
      "Isolating — Connective",
      "Pleasant — Unpleasant",
      "Inventive — Conventional",
      "Simple — Complicated",
      "Professional — Unprofessional",
      "Ugly — Attractive",
      "Practical — Impractical",
      "Likeable  — Disagreeable",
      "Cumbersome  — Straightforward",
      "Stylish — Tacky",
      "Predictable — Unpredictable",
      "Cheap — Premium",
      "Alienating — Integrating",
      "Brings me closer to people — Separates me from people",
      "Unpresentable — Presentable",
      "Rejecting — Inviting",
      "Unimaginative — Creative",
      "Good — Bad",
      "Confusing — Clearly structured",
      "Repelling — Appealing",
      "Bold — Cautious",
      "Innovative — Conservative",
      "Dull — Captivating",
      "Undemanding — Challenging",
      "Motivating — Discouraging",
      "Novel — Ordinary",
      "Unruly — Manageable",
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
    subtitle: "Pragmatic + Hedonic qualities", //Fixed issues 20/01
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
    subtitle: "Mental workload & frustration (NASA-TLX)", //Fixed issues 20/01
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
        text: "Performance: How successful were you in accomplishing what you were asked to do?",
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
    subtitle: "Trust, reliability, predictability (Likert 7)", //Fixed issues 20/01
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
    subtitle: "Perceived brand experience & satisfaction (Likert 7)", //Fixed issues 20/01
    type: "bus15",
    questions: [
      "The chatbot function was easily detectable.",
      "It was easy to find the chatbot.",
      "Communicating with the chatbot was clear.",
      "I was immediately made aware of what information the chatbot can give me.",
      "The interaction with the chatbot felt like an ongoing conversation.",
      "The chatbot was able to keep track of context.",
      "The chatbot was able to make references to the website or service when appropriate.",
      "The chatbot could handle situations in which the line of conversation was not clear.",
      "The chatbot’s responses were easy to understand.",
      "I find that the chatbot understands what I want and helps me achieve my goal.",
      "The chatbot gives me the appropriate amount of information.",
      "The chatbot only gives me the information I need.",
      "I feel like the chatbot’s responses were accurate.",
      "I believe the chatbot informs me of any possible privacy issues.",
      "My waiting time for a response from the chatbot was short.",
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
    subtitle: "Usefulness, Ease of Use, Intention (Likert 7)", //Fixed issues 20/01
    type: "tam",
    questions: [
      "Using this chatbot would enable me to accomplish tasks more quickly.",
      "Using this chatbot would improve my performance in completing tasks.",
      "Using this chatbot would increase my productivity.",
      "Using this chatbot would enhance my effectiveness in getting what I need.",
      "Using this chatbot would make it easier to do my tasks.",
      "I would find this chatbot useful for my tasks.",
      "Learning to use this chatbot would be easy for me.",
      "I would find it easy to get chatbot to do what I want it to do.",
      "My interaction with this chatbot would be clear and understandable.",
      "I would find this chatbot would be clear and understandable.",
      "It would be easy for me to become skillful at using this chatbot.",
      "I would find this chatbot easy to use.",
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
    subtitle: "Quick measure of task ease (Likert 7)", //Fixed issues 20/01
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
    // Draft text for options editor (so Enter/newlines work naturally)
  const [optionsDraftById, setOptionsDraftById] = useState({});
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [previewOtherText, setPreviewOtherText] = useState({});

  const isOtherValue = (v) =>
    typeof v === "string" && v.trim().toLowerCase() === "other";

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
              question_count: Array.isArray(questionsToSend)
                ? questionsToSend.length
                : 0, //Fixed issues 20/01
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
                navigate(
                  `/experiment-config?experimentId=${experimentId}&tab=Surveys`
                )
              }
              className="flex items-center gap-2 text-gray-600 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold">Add Survey to Experiment</h1>
          </div>

          <button
            onClick={saveToExperiment}
            disabled={saving || selectedSurveys.size === 0}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
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

            const count =
              key === "demographics"
                ? demographicQuestions.length
                : Array.isArray(survey.questions)
                ? survey.questions.length
                : 0;

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
                {/* Removed q count on cards //Fixed issues 20/01 */}
              </button>
            );
          })}
        </div>

        {previewSurvey && (
          <div className="bg-white rounded-2xl shadow p-7">
            <h2 className="text-2xl font-bold mb-2 text-center">
             {previewSurvey.name}
            </h2>

            {selectedSurveys.size > 1 && (
              <p className="text-center text-gray-500 mb-5 text-xs">
                Showing last selected • All {selectedSurveys.size} will be added
              </p>
            )}

            {/* ✅ Demographics editor */}
            {lastSelectedKey === "demographics" ? (
              <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {" "}
                {/* //Fixed issues 20/01 */}
                <div>
                  <div className="max-w-4xl mx-auto mb-6">
                    <div className="flex items-center justify-between gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                      <div>
                        <p className="font-bold text-sm">Customize Demographics</p>
                        <p className="text-xs text-gray-600">
                          Add / edit / delete questions [Avoid names, emails,
                          phone, address]
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 max-h-[calc(100vh-260px)] overflow-auto pr-2">
                      {demographicQuestions.map((q) => {
                        const optionsText = (q.options || []).join("\n");
                        const isOptionsType =
                          q.type === "select" || q.type === "radio";

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
                                <label className="text-xs text-gray-500">
                                  Type
                                </label>
                                <select
                                  value={q.type}
                                  onChange={(e) => {
  const newType = e.target.value;

  // clear any draft when switching types
  setOptionsDraftById((prev) => {
    if (!prev[q.id]) return prev;
    const next = { ...prev };
    delete next[q.id];
    return next;
  });

  if (newType === "select" || newType === "radio") {
    updateDemographicQuestion(q.id, {
      type: newType,
      options: q.options ?? ["Option 1"],
    });
  } else {
    updateDemographicQuestion(q.id, {
      type: newType,
      options: undefined,
      min: undefined,
      max: undefined,
    });
  }
}}

                                  className="w-full mt-1 p-3 border rounded-xl text-sm"
                                >
                                  <option value="text">Text</option>
                                  <option value="number">Number</option>
                                  <option value="select">
                                    Dropdown (Select)
                                  </option>
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
                                <label
                                  htmlFor={`req_${q.id}`}
                                  className="text-sm"
                                >
                                  Required
                                </label>
                              </div>

                              {q.type === "number" && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Min
                                    </label>
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
                                    <label className="text-xs text-gray-500">
                                      Max
                                    </label>
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
    <label className="text-xs text-gray-500">Options (one per line)</label>

    <textarea
      value={optionsDraftById[q.id] ?? optionsText}
      onChange={(e) => {
        const v = e.target.value;
        setOptionsDraftById((prev) => ({ ...prev, [q.id]: v }));
      }}
      onBlur={() => {
        const raw = optionsDraftById[q.id];
        const parsed = parseOptionsLines(raw ?? optionsText);

        updateDemographicQuestion(q.id, { options: parsed });

        // normalize draft after commit (keeps textarea in sync)
        setOptionsDraftById((prev) => {
          const next = { ...prev };
          delete next[q.id];
          return next;
        });
      }}
      className="w-full mt-1 p-3 border rounded-xl text-sm min-h-[120px] resize-y"
      placeholder={"Option 1\nOption 2\nOption 3"}
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
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
                    {" "}
                    {/* //Fixed issues 20/01 */}
                    <p className="font-bold text-sm">Preview</p>
                    <p className="text-xs text-gray-600">
                      This is how participants will see it
                    </p>
                  </div>

                  <div className="space-y-4 max-w-4xl mx-auto lg:sticky lg:top-28 max-h-[calc(100vh-180px)] overflow-auto pr-2">
                    {previewSurvey.questions.map((q, i) => (
                      <div
                        key={q.id}
                        className="border border-gray-200 rounded-xl p-4"
                      >
                        <p className="font-medium text-base mb-3">
                          <span className="text-indigo-600 font-bold mr-2">
                            {i + 1}.
                          </span>
                          {q.text}
                          {q.required ? (
                            <span className="text-red-500 ml-2">*</span>
                          ) : null}
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
                                <span className="block leading-tight">
                                  {lab}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === "semantic7" && (
                          <div className="flex justify-between items-center text-xs gap-3">
                            <span className="font-medium w-24">
                              {q.labels?.[0]}
                            </span>
                            <div className="flex gap-2 flex-1 justify-center">
                              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                <div
                                  key={n}
                                  className="w-7 h-7 border-2 border-gray-400 rounded-full"
                                />
                              ))}
                            </div>
                            <span className="font-medium w-24 text-right">
                              {q.labels?.[1]}
                            </span>
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
                              defaultValue={Math.round(
                                ((q.min ?? 0) + (q.max ?? 100)) / 2
                              )}
                              className="w-full"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                              <span>{q.min ?? 0}</span>
                              <span>{q.max ?? 100}</span>
                            </div>
                          </div>
                        )}

                        {q.type === "select" && (
  <div className="mt-2">
    <select
      className="w-full p-3 border rounded-lg text-sm"
      value={previewAnswers[q.id] ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        setPreviewAnswers((p) => ({ ...p, [q.id]: v }));

        if (!isOtherValue(v)) {
          setPreviewOtherText((p) => {
            const next = { ...p };
            delete next[q.id];
            return next;
          });
        }
      }}
    >
      <option value="">Select...</option>
      {(q.options || []).map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>

    {isOtherValue(previewAnswers[q.id]) && (
      <input
        className="w-full p-3 border rounded-lg mt-2 text-sm"
        placeholder="Please specify..."
        value={previewOtherText[q.id] ?? ""}
        onChange={(e) =>
          setPreviewOtherText((p) => ({ ...p, [q.id]: e.target.value }))
        }
      />
    )}
  </div>
)}


                       {q.type === "radio" && (
  <div className="mt-2 space-y-2">
    {(q.options || []).map((opt) => (
      <label key={opt} className="flex items-center gap-3 text-sm">
        <input
          type="radio"
          name={`preview_${q.id}`}
          className="w-4 h-4"
          checked={(previewAnswers[q.id] ?? "") === opt}
          onChange={() => {
            setPreviewAnswers((p) => ({ ...p, [q.id]: opt }));
            if (!isOtherValue(opt)) {
              setPreviewOtherText((p) => {
                const next = { ...p };
                delete next[q.id];
                return next;
              });
            }
          }}
        />
        <span>{opt}</span>
      </label>
    ))}

    {isOtherValue(previewAnswers[q.id]) && (
      <input
        className="w-full p-3 border rounded-lg mt-2 text-sm"
        placeholder="Please specify..."
        value={previewOtherText[q.id] ?? ""}
        onChange={(e) =>
          setPreviewOtherText((p) => ({ ...p, [q.id]: e.target.value }))
        }
      />
    )}
  </div>
)}


                        {(q.type === "text" || q.type === "number") && (
                          <input
                            type={q.type}
                            placeholder={
                              q.type === "number" ? "e.g. 28" : "Your answer..."
                            }
                            className="w-full p-3 border rounded-lg mt-2 text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
                            <div
                              key={n}
                              className="w-7 h-7 border-2 border-gray-400 rounded-full"
                            />
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
  <div className="mt-2">
    <select
      className="w-full p-3 border rounded-lg text-sm"
      value={previewAnswers[q.id] ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        setPreviewAnswers((p) => ({ ...p, [q.id]: v }));

        if (!isOtherValue(v)) {
          setPreviewOtherText((p) => {
            const next = { ...p };
            delete next[q.id];
            return next;
          });
        }
      }}
    >
      <option value="">Select...</option>
      {(q.options || []).map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>

    {isOtherValue(previewAnswers[q.id]) && (
      <input
        className="w-full p-3 border rounded-lg mt-2 text-sm"
        placeholder="Please specify..."
        value={previewOtherText[q.id] ?? ""}
        onChange={(e) =>
          setPreviewOtherText((p) => ({ ...p, [q.id]: e.target.value }))
        }
      />
    )}
  </div>
)}


                    {q.type === "radio" && (
  <div className="mt-2 space-y-2">
    {(q.options || []).map((opt) => (
      <label key={opt} className="flex items-center gap-3 text-sm">
        <input
          type="radio"
          name={`preview_${q.id}`}
          className="w-4 h-4"
          checked={(previewAnswers[q.id] ?? "") === opt}
          onChange={() => {
            setPreviewAnswers((p) => ({ ...p, [q.id]: opt }));
            if (!isOtherValue(opt)) {
              setPreviewOtherText((p) => {
                const next = { ...p };
                delete next[q.id];
                return next;
              });
            }
          }}
        />
        <span>{opt}</span>
      </label>
    ))}

    {isOtherValue(previewAnswers[q.id]) && (
      <input
        className="w-full p-3 border rounded-lg mt-2 text-sm"
        placeholder="Please specify..."
        value={previewOtherText[q.id] ?? ""}
        onChange={(e) =>
          setPreviewOtherText((p) => ({ ...p, [q.id]: e.target.value }))
        }
      />
    )}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
