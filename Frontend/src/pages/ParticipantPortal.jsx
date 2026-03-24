// src/pages/ParticipantPortal.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, AlertCircle, Trophy } from "lucide-react";

export default function ParticipantPortal({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("experiments");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "participant") {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first.");
          navigate("/auth?role=participant&mode=signin");
          return;
        }

        setLoading(true);
        setError(null);

        const res = await axios.get("http://localhost:8000/participants/me/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        setDashboard(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        let message = "Could not load dashboard. Please try again.";

        if (err.code === "ECONNABORTED") {
          message = "Request timed out. Is the backend running?";
        } else if (err.response) {
          const { status, data } = err.response;
          if (status === 401) {
            message = "Session expired. Please log in again.";
            localStorage.removeItem("token");
            navigate("/auth?role=participant&mode=signin");
          } else if (status === 403) {
            message = "This account is not a participant account.";
          } else if (status === 404) {
            message = "Dashboard endpoint not found. Check your backend!";
          } else {
            message = data?.detail || `Server error (${status})`;
          }
        } else if (err.request) {
          message = "No response from server. Is backend running on port 8000?";
        } else {
          message = err.message || "Unknown error";
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-xl text-purple-700">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    totalStars: 0,
    completedExperiments: 0,
    earnedBadges: 0,
    totalBadges: 6,
    leaderboardRank: "-",
  };

  const experiments = dashboard?.experiments || [];
  const badges = dashboard?.badges || [];

  // ─── Next Milestone Logic (restored) ─────────────────────────────────
  const thresholds = [1, 10, 20, 30, 40, 50];
  const badgeTitles = {
    1: "First Steps",
    10: "Dedicated Explorer",
    20: "Research Veteran",
    30: "Core Contributor",
    40: "Elite Participant",
    50: "Legend of Ariv",
  };

  const nextThreshold = thresholds.find((t) => t > stats.completedExperiments) || null;
  const progressPercent = nextThreshold
    ? Math.min(((stats.completedExperiments / nextThreshold) * 100).toFixed(0), 100)
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.first_name?.[0]?.toUpperCase() || "P"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Participant Dashboard</h1>
              <p className="text-gray-700">
                Welcome back, {user?.first_name || user?.email?.split("@")[0] || "Explorer"}!
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Next Milestone Progress (restored) */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-12">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" /> Next Milestone
          </h3>

          {stats.completedExperiments >= 50 ? (
            <p className="text-lg text-green-700 font-medium">
              Legend status achieved! You're in the top tier 🎉
            </p>
          ) : nextThreshold ? (
            <>
              <p className="text-gray-700 mb-3">
                You've completed <strong>{stats.completedExperiments}</strong> experiments
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {nextThreshold - stats.completedExperiments} more to unlock{" "}
                <span className="font-semibold text-purple-700">{badgeTitles[nextThreshold]}</span>
              </p>
            </>
          ) : null}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon="⭐" color="yellow" value={stats.totalStars} label="Total Stars Earned" />
          <StatCard icon="✅" color="purple" value={stats.completedExperiments} label="Experiments Completed" />
          <StatCard icon="🏅" color="blue" value={`${stats.earnedBadges} / ${stats.totalBadges}`} label="Badges Earned" />
          <StatCard icon="#" color="emerald" value={`${stats.leaderboardRank}`} label="Leaderboard Rank" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <TabButton active={activeTab === "experiments"} onClick={() => setActiveTab("experiments")}>
            My Experiments
          </TabButton>
          <TabButton active={activeTab === "badges"} onClick={() => setActiveTab("badges")}>
            Badges & Achievements
          </TabButton>
        </div>

        {activeTab === "experiments" && (
          <div className="space-y-6">
            {experiments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <p className="text-2xl text-gray-600 mb-4">No experiments yet</p>
                <p className="text-gray-500">Join and complete studies to start earning stars and badges!</p>
              </div>
            ) : (
              experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">
                        {exp.title || "Untitled Experiment"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {exp.org || "Unknown Organization"} • {exp.status}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exp.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Points Earned</p>
                      <p className="font-semibold">{exp.points || 0} stars</p>
                    </div>
                    {/* <div>
                      <p className="text-gray-500">Time Spent</p>
                      <p className="font-semibold">{exp.minutes || 0} min</p>
                    </div> */}
                  </div>

                  {/* {exp.completedOn && (
                    <p className="text-sm text-gray-500 mb-4">Completed on: {exp.completedOn}</p>
                  )} */}

                  <button
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition"
                    onClick={() => navigate(`/participant/experiment/${exp.id}/view`)}
                  >
                    {exp.action || (exp.status === "Completed" ? "View Results" : "Continue")}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "badges" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h2>
            <p className="text-gray-600 mb-8">
              Earn badges by completing experiments and reaching milestones
            </p>

            {badges.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <p className="text-2xl text-gray-600 mb-4">No badges yet</p>
                <p className="text-gray-500">Complete more experiments to unlock achievements!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {badges.map((badge, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl p-6 text-center border transition-all ${
                        badge.earned
                          ? "bg-gradient-to-b from-purple-50 to-white border-purple-200 shadow-sm scale-100"
                          : "bg-white border-gray-200 opacity-70 scale-95"
                      }`}
                    >
                      <div className="text-5xl mb-4">{getBadgeIcon(badge.icon_name)}</div>
                      <h3 className="font-bold text-gray-900">{badge.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{badge.description || badge.desc}</p>

                      <div className="mt-5">
                        {badge.earned ? (
                          <span className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
                            <span>✓</span> Earned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                            <span>🔒</span> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 text-center shadow-lg">
                  <p className="text-lg font-medium">Achievement Progress</p>
                  <p className="mt-1">Keep participating — you're doing great!</p>

                  <div className="mt-6">
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-700"
                        style={{ width: `${(stats.earnedBadges / stats.totalBadges) * 100 || 0}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-white/90">
                      {stats.earnedBadges} of {stats.totalBadges} badges earned
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, color, value, label }) {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center text-2xl font-bold`}>
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 font-medium transition rounded-t-xl ${
        active
          ? "bg-white text-purple-700 border-b-4 border-purple-600 shadow-sm"
          : "text-gray-600 hover:text-purple-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

// Updated icon mapping – matches your database icon_name values
function getBadgeIcon(iconName) {
  if (!iconName) return "🏅";

  const name = iconName.toLowerCase().trim();

  const iconMap = {
    trophy: "🥇",           // First Steps
    star: "🚀",             // Dedicated Explorer
    award: "🏆",            // Research Veteran
    zap: "🎯",              // Core Contributor
    "message-circle": "💎", // Elite Participant
    crown: "👑",            // Legend of Ariv

    // Optional safety fallbacks
    target: "🎯",
    flame: "🔥",
    diamond: "💎",
    "message-square": "💭",
  };

  return iconMap[name] || "🏅";
}