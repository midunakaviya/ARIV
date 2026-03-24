// Backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.error("Missing GROQ_API_KEY in .env");
  process.exit(1);
}

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "message required" });
  }

  try {
    console.log("→ Sending to Groq:", message);

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast & free tier friendly
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Groq error:", errData);
      return res
        .status(response.status)
        .json({ error: errData.error?.message || "Groq failed" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "(no reply)";

    console.log("← Groq reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("Server crashed:", err.message);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.listen(PORT, () => {
  console.log(`Groq proxy running → http://localhost:${PORT}`);
});
