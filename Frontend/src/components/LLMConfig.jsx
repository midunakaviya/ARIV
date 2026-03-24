import React, { useState } from "react";

const PROVIDERS = {
  openai: { name: "OpenAI", models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"] },
  anthropic: { name: "Anthropic", models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"] },
  groq: { name: "Groq (fastest)", models: ["llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"] },
  gemini: { name: "Google Gemini", models: ["gemini-1.5-pro", "gemini-1.5-flash"] },
};

export default function LLMConfig({ chatbot, onSave }) {
  const [provider, setProvider] = useState(chatbot.llm_config?.provider || "openai");
  const [model, setModel] = useState(chatbot.llm_config?.model || PROVIDERS[provider].models[0]);
  const [systemPrompt, setSystemPrompt] = useState(chatbot.llm_config?.system_prompt || "You are a helpful assistant.");

  const save = () => {
    onSave({
      provider,
      model,
      system_prompt: systemPrompt,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium mb-3">LLM Provider</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(PROVIDERS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => {
                setProvider(key);
                setModel(p.models[0]);
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                provider === key ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-400"
              }`}
            >
              <div className="font-bold text-lg">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-4 border rounded-xl"
        >
          {PROVIDERS[provider].models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={6}
          className="w-full p-4 border rounded-xl font-mono text-sm"
          placeholder="You are a friendly customer support agent for Acme Corp..."
        />
      </div>

      <button
        onClick={save}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl"
      >
        Save & Use This LLM
      </button>
    </div>
  );
}