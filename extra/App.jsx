import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, HelpCircle, Users, CheckCircle, PlayCircle, Star } from "lucide-react";

// Regex
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PASSWORD_RE = /^.{6,}$/;
const PHONE_RE = /^\d{10,}$/;

// Icons
const GoogleIcon = ({ className = "w-4 h-4 mr-2" }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.38 0 6.26 1.16 8.6 3.43l6.4-6.4C35.89 3.21 30.38 1 24 1 14.66 1 6.58 6.56 3.05 14.3l7.87 6.12C12.1 14.53 17.55 9.5 24 9.5z" />
    <path fill="#34A853" d="M46.5 24.5c0-1.65-.15-3.22-.43-4.75H24v9h12.7c-.56 2.95-2.22 5.45-4.7 7.1l7.4 5.76c4.34-4.01 7.1-9.9 7.1-17.11z" />
    <path fill="#4A90E2" d="M10.92 28.42A14.52 14.52 0 019.5 24c0-1.54.26-3.03.73-4.42l-7.87-6.12A22.93 22.93 0 001 24c0 3.77.9 7.33 2.48 10.53l7.44-6.11z" />
    <path fill="#FBBC05" d="M24 46.5c6.38 0 11.77-2.11 15.69-5.74l-7.4-5.76c-2.06 1.39-4.68 2.2-8.29 2.2-6.45 0-11.9-5.03-12.99-11.71l-7.87 6.12C6.58 41.44 14.66 46.5 24 46.5z" />
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4 mr-2" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 007.86 10.91c.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.39.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.19a11.03 11.03 0 012.9-.39c.98 0 1.97.13 2.9.39 2.21-1.5 3.18-1.19 3.18-1.19.63 1.57.23 2.73.11 3.02.74.81 1.19 1.84 1.19 3.1 0 4.43-2.71 5.4-5.29 5.69.42.36.79 1.07.79 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.5 11.5 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
  </svg>
);

// API Helper
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
};

// Main App
export default function App() {
  const [mode, setMode] = useState("signin");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api("/auth/me")
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const toggleMode = () => setMode(mode === "signin" ? "signup" : "signin");
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return user ? (
    <Dashboard user={user} onLogout={logout} />
  ) : (
    <AuthScreen mode={mode} toggleMode={toggleMode} setUser={setUser} />
  );
}

// Auth Screen
function AuthScreen({ mode, toggleMode, setUser }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden md:flex">
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto overflow-hidden">
                <div className="w-16 h-16 bg-white/40 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold">
              {mode === "signin" ? "Welcome back" : "Join our team"}
            </h2>
            <p className="mt-3 text-sm text-white/90">
              {mode === "signin" ? "Sign in to access your dashboard." : "Create your account to get started."}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10">
          {mode === "signin" ? (
            <SignIn toggleMode={toggleMode} setUser={setUser} />
          ) : (
            <SignUp toggleMode={toggleMode} setUser={setUser} />
          )}
        </div>
      </div>
    </div>
  );
}

// Sign In
function SignIn({ toggleMode, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eObj = {};
    if (!EMAIL_RE.test(email)) eObj.email = "Invalid email.";
    if (!PASSWORD_RE.test(password)) eObj.password = "Min 6 characters.";
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;

    setLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.access_token);
      const user = await api("/auth/me");
      setUser(user);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-2">Sign in</h1>
      <p className="text-sm text-gray-500 mb-6">
        Or{" "}
        <button type="button" onClick={toggleMode} className="text-indigo-600 underline">
          create an account
        </button>
      </p>

      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${
          errors.email ? "border-red-400" : "border-gray-200"
        }`}
        placeholder="you@example.com"
      />
      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}

      <label className="block text-sm font-medium text-gray-700 mt-4">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${
          errors.password ? "border-red-400" : "border-gray-200"
        }`}
        placeholder="••••••"
      />
      {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
      {errors.submit && <p className="text-xs text-red-600 mt-1">{errors.submit}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-md hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="mt-4 text-center text-sm text-gray-500">or continue with</div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center rounded-md bg-white text-black px-3 py-2 text-sm font-medium hover:opacity-90">
          <GoogleIcon /> Google
        </button>
        <button className="flex items-center justify-center rounded-md bg-gradient-to-r from-gray-700 to-black text-white px-3 py-2 text-sm font-medium hover:opacity-90">
          <GithubIcon /> GitHub
        </button>
      </div>
    </form>
  );
}

// Sign Up
function SignUp({ toggleMode, setUser }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", phone: "", email: "", password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eObj = {};
    if (!form.firstName.trim()) eObj.firstName = "Required";
    if (!form.lastName.trim()) eObj.lastName = "Required";
    if (!form.dob) eObj.dob = "Required";
    if (!PHONE_RE.test(form.phone)) eObj.phone = "Min 10 digits";
    if (!EMAIL_RE.test(form.email)) eObj.email = "Invalid email";
    if (!PASSWORD_RE.test(form.password)) eObj.password = "Min 6 chars";
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;

    setLoading(true);
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          dob: form.dob,
          phone_number: form.phone,
        }),
      });
      localStorage.setItem("token", data.access_token);
      const user = await api("/auth/me");
      setUser(user);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-2">Sign up</h1>
      <p className="text-sm text-gray-500 mb-6">
        Already have an account?{" "}
        <button type="button" onClick={toggleMode} className="text-indigo-600 underline">
          Sign in
        </button>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" value={form.firstName} onChange={handleChange("firstName")}
            className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${errors.firstName ? "border-red-400" : "border-gray-200"}`} />
          {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" value={form.lastName} onChange={handleChange("lastName")}
            className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${errors.lastName ? "border-red-400" : "border-gray-200"}`} />
          {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-4">Date of Birth</label>
      <input type="date" value={form.dob} onChange={handleChange("dob")}
        className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${errors.dob ? "border-red-400" : "border-gray-200"}`} />
      {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}

      <label className="block text-sm font-medium text-gray-700 mt-4">Phone</label>
      <input type="tel" value={form.phone} onChange={handleChange("phone")}
        className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${errors.phone ? "border-red-400" : "border-gray-200"}`} />
      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}

      <label className="block text-sm font-medium text-gray-700 mt-4">Email</label>
      <input type="email" value={form.email} onChange={handleChange("email")}
        className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${errors.email ? "border-red-400" : "border-gray-200"}`} />
      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}

      <label className="block text-sm font-medium text-gray-700 mt-4">Password</label>
      <input type="password" value={form.password} onChange={handleChange("password")}
        className={`mt-1 w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-300 ${errors.password ? "border-red-400" : "border-gray-200"}`} />
      {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
      {errors.submit && <p className="text-xs text-red-600 mt-1">{errors.submit}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-md hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>
    </form>
  );
}

// Dashboard
function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/dashboard")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    window.location.href = `${API_URL}/dashboard/export`;
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-red-600">Failed to load data.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Chatbot Experiments</h1>
          <button onClick={onLogout} className="text-gray-700 hover:text-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
              <HelpCircle size={18} /> Guidance
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Participants", value: data.total_participants, icon: Users, color: "text-blue-600" },
            { label: "Completion Rate", value: `${data.completion_rate}%`, icon: CheckCircle, color: "text-green-600" },
            { label: "Active Experiments", value: data.active_experiments, icon: PlayCircle, color: "text-purple-600" },
            { label: "Average SUS Score", value: `${data.avg_sus_score}/100`, icon: Star, color: "text-orange-600" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.label}</p>
                  <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
                <kpi.icon className={kpi.color} size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Participants Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.participants_over_time}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Survey Results</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'CUQ', value: data.survey_results.CUQ },
                { name: 'SUS', value: data.survey_results.SUS },
                { name: 'AttrakDiff', value: data.survey_results.AttrakDiff || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Your Experiments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.experiments.map(exp => (
                  <tr key={exp.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        exp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exp.participant_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      €{exp.spent.toFixed(2)} / €{exp.budget.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}