

// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

// ─── Pages ───────────────────────────────────────────────────────────────
import AuthScreen from "./pages/AuthScreen";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";               // Company dashboard
import ExperimentConfig from "./pages/ExperimentConfig";
import AddSurvey from "./pages/AddSurvey";
import ChatbotBuilder from "./pages/ChatbotBuilder";
import ParticipantView from "./pages/ParticipantView";   // Handles BOTH: active session + portal view
import YourExperiments from "./pages/YourExperiments";
import ExperimentDetail from "./pages/ExperimentDetail";
import ParticipantPortal from "./pages/ParticipantPortal"; // Participant overview
import Welcome from "./pages/Welcome";
import ChatbotComparison from "./pages/ChatbotComparison";

// ─── Public chat (no auth required) ──────────────────────────────────────
import ChatWindow from "./pages/ChatWindow";

// ─── Layouts ──────────────────────────────────────────────────────────────
import AppLayout from "./layouts/AppLayout";         // Company sidebar + layout
import PublicLayout from "./layouts/PublicLayout";

// ─── Protected Route Component ───────────────────────────────────────────
const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const location = useLocation();

  // No token → redirect to welcome/login
  if (!token) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // If role is known and doesn't match required → redirect to correct area
  if (requiredRole && storedRole && storedRole !== requiredRole) {
    if (storedRole === "participant") {
      return <Navigate to="/participant/dashboard" replace />;
    } else if (storedRole === "company") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

// ─── Public-Only Route (prevent logged-in users from seeing login/signup) ─
const PublicOnlyRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Outlet />;

  // Redirect logged-in users away from public auth pages
  if (role === "participant") {
    return <Navigate to="/participant/dashboard" replace />;
  }
  if (role === "company") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Verify token and get current user info
    fetch("http://localhost:8000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Invalid token");
        return r.json();
      })
      .then((me) => {
        setUser(me);
        // Persist role for fast redirect decisions
        if (me?.role) {
          localStorage.setItem("role", me.role);
        }
      })
      .catch((err) => {
        console.warn("Auth check failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-2xl font-light text-indigo-600">Loading Ariv...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />

        {/* Welcome / Landing */}
        <Route path="/welcome" element={<Welcome />} />

        {/* Public-only auth pages */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/auth" element={<AuthScreen setUser={setUser} />} />
        </Route>

        {/* Public pages (no login required) */}
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home user={user} />} />
        </Route>

        {/* Protected routes — must be logged in */}
        <Route element={<ProtectedRoute />}>
          {/* Participant-only area */}
          <Route element={<ProtectedRoute requiredRole="participant" />}>
            <Route
              path="/participant/dashboard"
              element={<ParticipantPortal user={user} />}
            />
          </Route>

          {/* Company-only area */}
          <Route element={<ProtectedRoute requiredRole="company" />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/experiment-config" element={<ExperimentConfig />} />
              <Route path="/add-survey" element={<AddSurvey />} />
              <Route path="/chatbot-builder" element={<ChatbotBuilder />} />
              <Route path="/chatbot-builder/:chatbotId" element={<ChatbotBuilder />} />
              <Route path="/your-experiments" element={<YourExperiments user={user} />} />
              <Route path="/experiment-detail/:id" element={<ExperimentDetail />} />
              <Route path="/chatbot-comparison/:experimentId" element={<ChatbotComparison />} />
            </Route>
          </Route>
        </Route>

        {/* Special public routes */}
        <Route path="/chat/:id" element={<ChatWindow />} />                     {/* Public chatbot preview */}
        <Route path="/participant/:sessionId" element={<ParticipantView />} />  {/* Active experiment session */}
        <Route path="/participant/experiment/:experimentId/view" element={<ParticipantView />} />  {/* Portal "View" button */}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}