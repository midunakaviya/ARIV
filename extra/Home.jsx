// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";

export default function Home({ user }) {
  const navigate = useNavigate();

  // Real user name from simulated backend
  const displayName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email.split("@")[0]
    : "User";

  const firstName = user?.first_name || displayName.split(" ")[0];

  const handleCTAClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Real Navbar with real user */}
      <Navbar user={user} />

      {/* Hero with smart button */}
      <HeroSection user={user} />

      {/* Stunning features */}
      <FeaturesSection />

      {/* Personalized Final CTA */}
      <section className="py-28 px-6 bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Ready to run world-class chatbot experiments?
          </h2>

          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {user ? (
              <>
                Hey <span className="font-bold text-indigo-600">{firstName}</span> — your experiments are waiting. 
                See real-time SUS scores, participant behavior, and export everything in one click.
              </>
            ) : (
              "Join 2,400+ researchers measuring chatbot UX with scientific precision."
            )}
          </p>

          {/* <button
            onClick={handleCTAClick}
            className="group relative inline-flex items-center gap-4 px-16 py-7 text-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">
              {user ? "Go to Dashboard" : "Get Started Free"}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            <svg className="w-8 h-8 relative z-10 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button> */}

          {user && (
            <p className="mt-8 text-lg text-gray-500">
              You’re logged in as <span className="font-semibold text-gray-700">{displayName}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}