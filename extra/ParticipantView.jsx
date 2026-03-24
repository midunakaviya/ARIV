// src/pages/ParticipantView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function ParticipantView() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [experiment, setExperiment] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/experiments/by-session/${sessionId}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => {
        let steps = data.steps;

        // Apply randomization if enabled
        if (data.randomization) {
          steps = [...steps];
          // Keep welcome & consent first, randomize the rest
          const fixed = steps.slice(0, 2);
          const randomizable = steps.slice(2);
          for (let i = randomizable.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomizable[i], randomizable[j]] = [randomizable[j], randomizable[i]];
          }
          steps = [...fixed, ...randomizable];
        }

        setExperiment({ ...data, steps });
        setLoading(false);
      })
      .catch(() => {
        alert("Invalid or expired link");
        navigate("/");
      });
  }, [sessionId, navigate]);

  const currentStep = experiment?.steps?.[currentStepIndex];

  const next = () => {
    if (currentStepIndex < experiment.steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    } else {
      completeExperiment();
    }
  };

  const submitSurvey = async () => {
    if (!currentStep.survey_type) return;

    const payload = {
      experiment_id: experiment.id,
      participant_id: experiment.participant_id,
      survey_type: currentStep.survey_type.toUpperCase(),
      answers: answers[currentStep.id] || {},
    };

    await fetch(`${API_BASE}/survey_results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  const completeExperiment = async () => {
    await submitSurvey();
    await fetch(`${API_BASE}/participants/complete/${experiment.participant_id}`, { method: "POST" });
    setCurrentStepIndex("complete");
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    const newMsg = { role: "user", content: userInput };
    setChatMessages(prev => [...prev, newMsg]);
    setUserInput("");
    setIsSending(true);

    const res = await fetch(`${API_BASE}/llm/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "openai", // or detect from chatbot
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful chatbot in a research study." },
          ...chatMessages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: userInput }
        ],
      }),
    });

    const data = await res.json();
    setChatMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    setIsSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-2xl text-gray-700">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (currentStepIndex === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center max-w-2xl">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600">You have completed the study.</p>
          <p className="text-lg text-gray-500 mt-4">You may now close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-8 pt-20">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {experiment.steps.map((_, i) => (
              <div
                key={i}
                className={`h-3 flex-1 ${i < currentStepIndex ? "bg-indigo-600" : "bg-gray-300"} ${i === 0 ? "rounded-l-full" : ""} ${i === experiment.steps.length - 1 ? "rounded-r-full" : ""}`}
                style={{ marginLeft: i === 0 ? 0 : -1 }}
              />
            ))}
          </div>
          <p className="text-center text-gray-600">Step {currentStepIndex + 1} of {experiment.steps.length}</p>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {currentStep.type === "info" && (
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{currentStep.title}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{currentStep.subtitle}</p>
              <button onClick={next} className="mt-12 px-12 py-5 bg-indigo-600 text-white text-xl font-bold rounded-2xl hover:bg-indigo-700">
                Start Experiment →
              </button>
            </div>
          )}

          {currentStep.type === "consent" && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Informed Consent</h2>
              <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-gray-700 leading-relaxed">
                <p>You are invited to participate in a research study about chatbot user experience...</p>
              </div>
              <label className="flex items-center gap-4 text-xl cursor-pointer">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="w-8 h-8" />
                <span>I have read and agree to participate</span>
              </label>
              <button
                onClick={next}
                disabled={!consent}
                className="mt-8 px-12 py-5 bg-indigo-600 text-white text-xl font-bold rounded-2xl disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {currentStep.type === "chatbot" && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">Chat with the Assistant</h2>
              <div className="bg-gray-50 rounded-2xl p-6 h-96 overflow-y-auto mb-6 space-y-4">
                {chatMessages.length === 0 && (
                  <p className="text-center text-gray-500 py-20">Say hello to start the conversation!</p>
                )}
                {chatMessages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <div className={`inline-block max-w-md px-6 py-4 rounded-2xl ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-white border"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isSending && <div className="text-center text-gray-500">Thinking...</div>}
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-6 py-4 border-2 rounded-2xl text-lg"
                />
                <button onClick={sendMessage} disabled={isSending} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700">
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-8 text-center">
                <button onClick={() => { submitSurvey(); next(); }} className="px-12 py-5 bg-green-600 text-white text-xl font-bold rounded-2xl">
                  Continue to Survey →
                </button>
              </div>
            </div>
          )}

          {currentStep.type === "survey" && (
            <div>
              <h2 className="text-3xl font-bold mb-8">{currentStep.title}</h2>
              <div className="space-y-10">
                {currentStep.questions?.map((q, i) => (
                  <div key={q.id} className="bg-gray-50 rounded-2xl p-8">
                    <p className="text-xl font-medium mb-6">{i + 1}. {q.text}</p>

                    {q.type === "likert5" && (
                      <div className="grid grid-cols-5 gap-4 text-center">
                        {q.options.map((opt, idx) => (
                          <label key={idx} className="cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              value={idx + 1}
                              onChange={e => setAnswers(prev => ({
                                ...prev,
                                [currentStep.id]: { ...prev[currentStep.id], [q.id]: Number(e.target.value) }
                              }))}
                              className="sr-only"
                            />
                            <div className={`p-4 rounded-xl border-2 transition ${answers[currentStep.id]?.[q.id] === idx + 1 ? "border-indigo-600 bg-indigo-50" : "border-gray-300"}`}>
                              {opt}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === "select" && (
                      <select
                        onChange={e => setAnswers(prev => ({
                          ...prev,
                          [currentStep.id]: { ...prev[currentStep.id], [q.id]: e.target.value }
                        }))}
                        className="w-full p-4 border-2 rounded-xl text-lg"
                      >
                        <option>Select...</option>
                        {q.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    )}

                    {q.type === "text" && (
                      <input
                        type="text"
                        onChange={e => setAnswers(prev => ({
                          ...prev,
                          [currentStep.id]: { ...prev[currentStep.id], [q.id]: e.target.value }
                        }))}
                        className="w-full p-4 border-2 rounded-xl text-lg"
                        placeholder="Your answer..."
                      />
                    )}

                    {q.type === "number" && (
                      <input
                        type="number"
                        min={q.min}
                        max={q.max}
                        onChange={e => setAnswers(prev => ({
                          ...prev,
                          [currentStep.id]: { ...prev[currentStep.id], [q.id]: Number(e.target.value) }
                        }))}
                        className="w-full p-4 border-2 rounded-xl text-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <button
                  onClick={() => { submitSurvey(); next(); }}
                  className="px-16 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-bold rounded-2xl"
                >
                  {currentStepIndex === experiment.steps.length - 1 ? "Finish Study" : "Next →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}