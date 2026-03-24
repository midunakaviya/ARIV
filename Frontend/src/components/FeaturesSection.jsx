
// src/components/FeaturesSection.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function FeaturesSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [stats, setStats] = useState({
    experiments: "—",
    chatbots: "—",
    datapoints: "—",
  });

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [experimentsRes, chatbotsRes, dashboardRes] = await Promise.all([
          fetch(`${API}/experiments`, { headers }).then((r) => r.json()),
          fetch(`${API}/chatbots`, { headers }).then((r) => r.json()),
          fetch(`${API}/dashboard`, { headers }).then((r) => r.json()),
        ]);

        setStats({
          experiments: `${experimentsRes.length}+`,
          chatbots: `${chatbotsRes.length}+`,
          datapoints: `${dashboardRes.total_data_points || 0}+`,
        });
      } catch (err) {
        console.error("Failed to load feature stats", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-to-b from-[#F8F6FF] to-white py-24"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* HEADER */}
        <div
          className="text-center max-w-3xl mx-auto mb-16 transition-all duration-700"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            opacity: isVisible ? 1 : 0,
          }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Built for{" "}
            <span className="bg-purple-600 text-purple-600 rounded-xl bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>
          <p className="text-slate-600 text-lg">
            Three integrated modules designed for research-grade chatbot experimentation
          </p>
        </div>

        {/* MODULE CARDS */}
        <div className="space-y-10">
          {/* MODULE 1 */}
          <div
            className="transition-all duration-700 delay-100"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              opacity: isVisible ? 1 : 0,
            }}
          >
            <div
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative"
              onClick={() => navigate("/experiment-config")}
            >
              <div className="p-10 lg:p-12">
                <ModuleBody
                  title="Chatbot Experimentation"
                  description="Run sophisticated A/B tests with multiple chatbot variants simultaneously"
                  features={[
                    "Multi-variant testing",
                    "Real-time feedback",
                    "Multiple Standardized Surveys",
                  ]}
                />
              </div>
            </div>
          </div>

          {/* MODULE 2 */}
          <div
            className="transition-all duration-700 delay-200"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              opacity: isVisible ? 1 : 0,
            }}
          >
            <div
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative"
              onClick={() => navigate("/chatbot-builder")}
            >
              <div className="p-10 lg:p-12">
                <ModuleBody
                  title="Chatbot Editor"
                  description="Design, customize, and iterate chatbot interfaces using a structured visual editor."
                  features={[
                    "Design your own versions",
                    "LLM Supported",
                    "Custom personalities",
                  ]}
                />
              </div>
            </div>
          </div>

          {/* MODULE 3 */}
          <div
            className="transition-all duration-700 delay-300"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              opacity: isVisible ? 1 : 0,
            }}
          >
            <div
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative"
              onClick={() => navigate("/dashboard")}
            >
              <div className="p-10 lg:p-12">
                <ModuleBody
                  title="Analytics Dashboard"
                  description="Analyze user behavior and chatbot performance through structured metrics and reports."
                  features={[
                    "Live performance metrics",
                    "Survey feedback analysis",
                    "Download results",
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModuleBody({ title, description, features }) {
  return (
    <div className="relative">
      {/* Explore button – top right, visually prominent, but click goes through to card */}
      <button
        type="button"
        className="
          absolute top-0 right-0
          px-6 py-2.5
          bg-purple-600 text-white rounded-xl
          text-white rounded-xl
          text-sm font-semibold
          shadow-lg hover:shadow-xl
          transition-all duration-200
          flex items-center gap-1.5
          z-10
          active:scale-95
        "
        aria-label={`Explore ${title}`}
      >
        Explore →
      </button>

      <h3 className="text-3xl font-bold text-slate-900 mb-4 pr-40 md:pr-48">
        {title}
      </h3>

      <p className="text-slate-600 mb-8 pr-4 md:pr-12">{description}</p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-10">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
            <span className="text-violet-600 font-semibold">✓</span>
            {f}
          </div>
        ))}
      </div>

      {/* If you want to bring back stats at the bottom later, add them here */}
    </div>
  );
}