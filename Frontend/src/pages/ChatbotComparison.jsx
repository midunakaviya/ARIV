import React, { useState } from "react";
import { Download, ChevronDown } from "lucide-react";

export default function ChatbotComparison() {
  // 🔹 Static UI-only data (later comes from backend)
  const chatbots = [
    { id: 1, name: "GPT-4", score: 82 },
    { id: 2, name: "Claude 3", score: 91 },
    { id: 3, name: "Gemini", score: 76 },
    { id: 4, name: "Custom Bot", score: 68 },
  ];
  const metrics = [
    {
      key: "sus",
      label: "SUS Score",
      unit: "%",
      data: [
        { name: "GPT-4", value: 88 },
        { name: "Claude 3", value: 92 },
        { name: "Gemini", value: 81 },
      ],
    },
    {
      key: "cuq",
      label: "CUQ Score",
      unit: "%",
      data: [
        { name: "GPT-4", value: 90 },
        { name: "Claude 3", value: 87 },
        { name: "Gemini", value: 78 },
      ],
    },
    {
      key: "attrakdiff",
      label: "AttrakDiff",
      unit: "",
      data: [
        { name: "GPT-4", value: 4.6 },
        { name: "Claude 3", value: 4.7 },
        { name: "Gemini", value: 4.8 },
      ],
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Chatbot Comparison
          </h1>
          <p className="text-base text-gray-600 mt-1">
            Compare performance metrics across selected chatbots
          </p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* 🔽 SELECTED CHATBOTS DROPDOWN */}
      <div className="mb-8">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
        >
          <span className="text-lg font-semibold text-gray-800">
            Selected Chatbots ({chatbots.length})
          </span>
          <ChevronDown
            className={`text-gray-600 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            size={22}
          />
        </button>

        {open && (
          <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
            {chatbots.map((bot) => (
              <div
                key={bot.id}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-800 font-medium">{bot.name}</span>
                <span className="text-sm text-gray-500">
                  Score: {bot.score}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPARISON CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">
          Overall Performance Score (%)
        </h2>

        <div className="space-y-8">
          {chatbots.map((bot) => (
            <div key={bot.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-medium text-gray-700">
                  {bot.name}
                </span>
                <span className="text-base font-semibold text-gray-800">
                  {bot.score}%
                </span>
              </div>

              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-4 rounded-full transition-all duration-700"
                  style={{
                    width: `${bot.score}%`,
                    background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10 mt-10">
        {metrics.map((metric) => {
          const best = [...metric.data].sort((a, b) => b.value - a.value)[0];

          return (
            <div
              key={metric.key}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
            >
              {/* METRIC HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {metric.label}
                </h2>

                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Best: {best.name} ({best.value}
                  {metric.unit})
                </span>
              </div>

              {/* METRIC BARS */}
              <div className="space-y-6">
                {metric.data.map((bot) => (
                  <div key={bot.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">
                        {bot.name}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {bot.value}
                        {metric.unit}
                      </span>
                    </div>

                    <div className="w-full h-4 bg-gray-200 rounded-full">
                      <div
                        className="h-4 rounded-full transition-all duration-700"
                        style={{
                          width:
                            metric.unit === "%"
                              ? `${bot.value}%`
                              : `${bot.value * 20}%`,
                          background:
                            "linear-gradient(90deg, #6366F1, #8B5CF6)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTNOTE */}
      <p className="mt-8 text-sm text-gray-500 italic">
        Scores represent aggregated user feedback and interaction success rates.
      </p>
    </div>
  );
}
