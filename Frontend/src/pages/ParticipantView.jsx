
// src/pages/ParticipantView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Trophy,
  User,
  ShieldCheck,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

// Maask brand colors
const BRAND = {
  primary: "#6D28D9",
  primaryDark: "#5B21B6",
  primaryLight: "#A78BFA",
  gradient: "from-[#7C3AED] to-[#A78BFA]",
  success: "#10B981",
  gray: "#6B7280",
};

export default function ParticipantView() {
  const { sessionId, experimentId } = useParams();
  const navigate = useNavigate();

  const isActiveSession = !!sessionId && !experimentId;
  const isPortalView = !!experimentId && !sessionId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [experiment, setExperiment] = useState(null);
  const [participantData, setParticipantData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    const loadExperiment = async () => {
      const token = localStorage.getItem("token");
      try {
        let expData = null;
        let partData = null;

        if (isActiveSession) {
          const res = await fetch(`${API_BASE}/experiments/by-session/${sessionId}`);
          if (!res.ok) throw new Error(await res.text() || "Invalid session");
          expData = await res.json();
          setVariant(Math.random() < 0.5 ? "A" : "B");
        } else if (isPortalView) {
          if (!token) throw new Error("Please log in");
          const partRes = await fetch(
            `${API_BASE}/participants/me/experiment/${experimentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!partRes.ok) throw new Error(await partRes.text() || "Not participating");
          const data = await partRes.json();
          partData = data;
          expData = data;
          setParticipantData(partData);
          setCurrentStepIndex(partData.last_step_index || 0);
          setVariant(partData.variant || (Math.random() < 0.5 ? "A" : "B"));
        } else {
          throw new Error("Invalid URL");
        }

        setExperiment(expData);
      } catch (err) {
        setError(err.message || "Failed to load experiment");
      } finally {
        setLoading(false);
      }
    };

    loadExperiment();
  }, [sessionId, experimentId, isActiveSession, isPortalView, navigate]);

  const steps = experiment?.steps || [];
  const currentStep = steps[currentStepIndex] || {};

  const isCompleted = participantData?.status === "complete" || currentStepIndex === "complete";

  // ─── Stepper Titles + Icons ───────────────────────────────────────────
  const getStepInfo = (step, idx) => {
    if (idx === 0) return { title: "Welcome", icon: <User className="w-6 h-6" /> };
    if (step.type === "consent") return { title: "Consent", icon: <ShieldCheck className="w-6 h-6" /> };
    if (step.type === "task" || step.type === "chatbot") {
      return { title: `Chatbot ${variant || "?"}`, icon: <MessageSquare className="w-6 h-6" /> };
    }
    if (step.type === "survey") {
      return { title: step.survey_type ? `${step.survey_type.toUpperCase()} Survey` : "Survey", icon: <FileText className="w-6 h-6" /> };
    }
    return { title: "Thank You", icon: <CheckCircle className="w-6 h-6" /> };
  };

  // ─── Survey helpers ───────────────────────────────────────────────────
  const isSurveyComplete = () => {
    if (currentStep.type !== "survey" || !currentStep.questions) return true;
    const stepAnswers = answers[currentStep.id] || {};
    return currentStep.questions.every((q) => {
      if (q.type === "multiple") return Array.isArray(stepAnswers[q.id]) && stepAnswers[q.id].length > 0;
      return stepAnswers[q.id] !== undefined && stepAnswers[q.id] !== "";
    });
  };

  const handleAnswer = (questionId, value, isMulti = false) => {
    setAnswers((prev) => {
      const stepAnswers = prev[currentStep.id] || {};
      let newValue = value;
      if (isMulti) {
        const current = stepAnswers[questionId] || [];
        newValue = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      }
      return {
        ...prev,
        [currentStep.id]: { ...stepAnswers, [questionId]: newValue },
      };
    });
  };

  const submitSurveyIfNeeded = async () => {
    if (currentStep.type !== "survey" || !currentStep.survey_type) return;
    const stepAnswers = answers[currentStep.id] || {};
    if (Object.keys(stepAnswers).length === 0) return;

    const participantId = participantData?.participant_id;
    if (!participantId) return alert("Error: Missing participant info");

    const payload = {
      experiment_id: experiment.id,
      participant_id: participantId,
      survey_type: currentStep.survey_type.toUpperCase(),
      answers: stepAnswers,
      step_index: currentStepIndex,
    };

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/survey_results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      alert(`Could not save survey: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep.type === "survey") await submitSurveyIfNeeded();

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else if (!isCompleted) {
      try {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        const expId = experiment?.id;
        if (!expId) throw new Error("Missing experiment ID");

        const res = await fetch(`${API_BASE}/participants/complete/${expId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setCurrentStepIndex("complete");
        setNewBadges(data.badges_earned || []);

        if (data.stars_earned) {
          setParticipantData((prev) => ({
            ...prev,
            stars_earned: (prev?.stars_earned || 0) + data.stars_earned,
          }));
        }
      } catch (err) {
        alert(`Completion failed: ${err.message}`);
      } finally {
        setSubmitting(false);
      }
    }
  };

  function getBadgeIcon(key) {
    const map = {
      first_steps: "🥇",
      dedicated_explorer: "🚀",
      research_veteran: "🏆",
      core_contributor: "🎯",
      elite_participant: "💎",
      legend_of_ariv: "👑",
    };
    return map[key?.toLowerCase()] || "🏅";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: BRAND.primary }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#EF4444" }} />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/participant/dashboard")}
            className="px-8 py-4 text-white font-bold rounded-xl shadow-lg transition"
            style={{ background: BRAND.primary }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Thank You / Completion Screen ────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center max-w-2xl w-full">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-8 animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Experiment Completed!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Thank you for your participation!
          </p>

          {(participantData?.stars_earned || 0) > 0 && (
            <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-2xl px-10 py-6 mb-10">
              <div className="text-5xl font-bold text-yellow-600 mb-2">
                +{participantData.stars_earned} Stars
              </div>
              <p className="text-lg text-yellow-800">Added to your account</p>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="mb-10">
              <p className="text-lg font-medium text-gray-700 mb-4">New badges earned:</p>
              <div className="flex flex-wrap justify-center gap-6">
                {newBadges.map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-6xl mb-2">{getBadgeIcon(badge)}</span>
                    <span className="text-sm font-medium text-purple-800 text-center">
                      {badge.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/participant/dashboard")}
            className="px-12 py-5 bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold rounded-2xl shadow-lg transition"
          >
            Back to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Flow ────────────────────────────────────────────────────────
  const isLastStep = currentStepIndex === steps.length - 1;
  const showBottomButton = currentStep.type === "survey" || isLastStep;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: BRAND.primary }}>
              Step {currentStepIndex + 1} of {steps.length}
            </h2>
            <span className="text-lg font-medium" style={{ color: BRAND.gray }}>
              {getStepInfo(currentStep, currentStepIndex).title}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const { title, icon } = getStepInfo(step, idx);
              const isActive = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;

              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 border-4 shadow-md ${
                        isActive
                          ? "border-purple-600 bg-purple-600 scale-110"
                          : isCompleted
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 bg-gray-200"
                      }`}
                    >
                      {icon}
                    </div>
                    <span
                      className={`mt-3 text-xs md:text-sm font-medium text-center leading-tight ${
                        isActive ? "text-purple-700 font-bold" : isCompleted ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-2 mx-2 md:mx-4 mt-7">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-green-500" : isActive ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-200"
                        }`}
                        style={{ width: isCompleted || isActive ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ─── Last step preview (Thank You message) ──────────────────────── */}
        {isLastStep && !isCompleted && (
          <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <Trophy className="w-20 h-20 text-yellow-500 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Thank you for participating in the experiment
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
              Your input helps to improve chatbot for everyone.
            </p>
            <p className="text-gray-600 mb-8">
              Please click the button below to finish and submit your participation.
            </p>
          </div>
        )}

        {/* Normal step content (only when NOT on last step) */}
        {!isLastStep && (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 border border-gray-100 min-h-[60vh]">
            {/* Welcome */}
            {(currentStep.type === "info" || currentStep.id === "welcome") && (
              <div className="text-center py-12 md:py-16">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 md:mb-8" style={{ background: `linear-gradient(to right, ${BRAND.primary}, ${BRAND.primaryLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Welcome to Ariv
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 md:mb-10">
                  Thank you for joining an experiment on <strong>Ariv</strong>- MAASK’s advanced platform for testing and improving chatbots.  
                  Your input helps to build smarter chatbots for everyone.
                </p>
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="px-12 md:px-16 py-5 md:py-6 text-lg md:text-2xl font-bold text-white rounded-2xl shadow-2xl transition transform hover:scale-105 flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
                  style={{ background: `linear-gradient(to right, ${BRAND.primary}, ${BRAND.primaryDark})` }}
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                  Start Now
                </button>
              </div>
            )}

            {/* Consent */}
            {currentStep.type === "consent" && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-10" style={{ color: BRAND.primary }}>
                  Informed Consent
                </h2>
                <div className="prose prose-base md:prose-lg text-gray-700 md:text-gray-800 mb-8 md:mb-10 leading-relaxed max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2">
                  <p className="font-semibold text-lg md:text-xl mb-4 md:mb-6" style={{ color: BRAND.primaryDark }}>
                    Study Title: Chatbot Interaction & Surveys.
                  </p>
                  <p>
                    You are invited to participate in a research study conducted through <strong>Ariv</strong>.
                  </p>
                  <p><strong>Purpose:</strong> To evaluate user experience, trust, usability, and performance of chatbots.</p>
                  <p><strong>Duration:</strong> Approximately 10–30 minutes.</p>
                  <p><strong>Procedures:</strong> You will interact with chatbot and complete short questionnaires after interaction.</p>
                  <p><strong>Voluntary & Withdrawal:</strong> Participation is completely voluntary. You may stop at any time by closing your browser.No explanation needed, no penalty.</p>
                  <p><strong>Anonymity & Confidentiality:</strong> No personally identifiable information is collected or stored in a way that links back to you. All responses are anonymous and used only in aggregate form for research.</p>
                  <p><strong>Risks:</strong> Minimal,similar to everyday online conversations. No physical, emotional, or social risks are anticipated.</p>
                  <p><strong>Benefits:</strong> Contribute to the advancement of chatbot technology. You will earn participation stars credited to your Ariv account upon completion.</p>
                  <p><strong>Contact:</strong> For questions, contact <strong>maaskstartup@gmail.com</strong>.</p>
                  <p className="font-semibold mt-6 md:mt-8 text-base md:text-lg" style={{ color: BRAND.primaryDark }}>
                    By proceeding, you confirm that:
                  </p>
                  <ul className="list-disc pl-6 md:pl-8 space-y-2 md:space-y-3 mt-3 md:mt-4 text-base md:text-lg">
                    <li>You have read and understood this consent form</li>
                    <li>You voluntarily agree to participate</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                  <button
                    onClick={() => setConsentGiven(true)}
                    disabled={consentGiven}
                    className={`px-10 md:px-12 py-4 md:py-5 text-lg md:text-xl font-bold rounded-2xl transition-all duration-300 border-2 shadow-sm ${
                      consentGiven
                        ? "bg-green-100 text-green-800 border-green-300 cursor-default"
                        : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400 cursor-pointer"
                    }`}
                  >
                    {consentGiven ? "Agreed ✓" : "I Agree"}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!consentGiven || submitting}
                    className={`px-12 md:px-16 py-5 md:py-6 text-lg md:text-2xl font-bold text-white rounded-2xl shadow-xl transition transform flex items-center gap-3 ${
                      !consentGiven ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                    }`}
                    style={{ background: `linear-gradient(to right, ${BRAND.primary}, ${BRAND.primaryDark})` }}
                  >
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                    {!consentGiven ? "Agree First" : "Continue"}
                  </button>
                </div>
              </div>
            )}

            {/* Chatbot */}
            {(currentStep.type === "task" || currentStep.type === "chatbot") && (
              <div className="space-y-10 md:space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6" style={{ color: BRAND.primary }}>
                    Chatbot– Version {variant || "?"}
                  </h2>
                </div>

                {experiment?.chatbot?.url ? (
                  <div className="border-4 border-purple-200 rounded-3xl overflow-hidden shadow-2xl bg-white h-[500px] md:h-[720px]">
                    <iframe
                      src={experiment.chatbot.url}
                      className="w-full h-full"
                      title={`Ariv Chatbot - Version ${variant}`}
                      allow="microphone; camera; fullscreen; clipboard-write"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                  </div>
                ) : (
                  <div className="text-center py-16 md:py-20 bg-amber-50 rounded-3xl border-2 border-amber-300">
                    <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-amber-600 mx-auto mb-6" />
                    <h3 className="text-2xl md:text-3xl font-bold text-amber-800 mb-4">
                      Chatbot Not Configured
                    </h3>
                    <p className="text-base md:text-xl text-amber-700 max-w-xl mx-auto">
                      Please contact the researcher.
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={handleNext}
                    disabled={submitting}
                    className="px-12 md:px-16 py-5 md:py-6 text-lg md:text-2xl font-bold text-white rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
                    style={{ background: `linear-gradient(to right, ${BRAND.primary}, ${BRAND.primaryDark})` }}
                  >
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                     Continue
                  </button>
                </div>
              </div>
            )}

            {/* Survey */}
            {currentStep.type === "survey" && (
              <div className="space-y-10 md:space-y-12">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-8" style={{ color: BRAND.primary }}>
                  {currentStep.title || `${currentStep.survey_type?.toUpperCase() || "Feedback"} Survey`}
                </h2>
                <p className="text-center text-lg md:text-xl text-gray-700 mb-8 md:mb-10">
                  Your honest answers helps MAASK to improve Ariv and the future of chatbots.
                </p>

                {currentStep.questions?.map((q) => {
                  const isMulti = q.type === "multiple";
                  const selected = answers[currentStep.id]?.[q.id] || (isMulti ? [] : null);

                  return (
                    <div key={q.id} className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-gray-800">
                        {q.text}
                        {q.required && <span className="text-red-500 ml-2">*</span>}
                      </p>
                      <div className={`grid gap-4 md:gap-5 ${q.layout === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                        {q.options?.map((opt) => {
                          const isSelected = isMulti
                            ? Array.isArray(selected) && selected.includes(opt)
                            : selected === opt;

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleAnswer(q.id, opt, isMulti)}
                              className={`
                                py-5 md:py-6 px-6 md:px-8 rounded-2xl text-base md:text-lg font-medium transition-all duration-300 border-2
                                ${isSelected
                                  ? "border-purple-600 bg-purple-50 text-purple-900 shadow-md scale-105"
                                  : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 text-gray-700 hover:scale-102"
                                }
                              `}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Fixed Bottom CTA */}
        {showBottomButton && !isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5 md:p-6 shadow-2xl z-50">
            <div className="max-w-5xl mx-auto flex justify-end">
              <button
                onClick={handleNext}
                disabled={submitting || (currentStep.type === "consent" && !consentGiven) || (currentStep.type === "survey" && !isSurveyComplete())}
                className="px-12 md:px-16 py-5 md:py-6 text-lg md:text-2xl font-bold text-white rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(to right, ${BRAND.primary}, ${BRAND.primaryDark})` }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : currentStepIndex === steps.length - 1 ? (
                  "Finish & Submit"
                ) : (
                  "Continue →"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}