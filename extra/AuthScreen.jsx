
// src/pages/AuthScreen.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PASSWORD_RE = /^.{6,}$/;

export default function AuthScreen({ setUser }) {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const navigate = useNavigate();

  const toggleMode = () => setMode(mode === "signin" ? "signup" : "signin");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden md:flex">
        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-black/90 flex items-center justify-center mx-auto mb-6">
              {/* <div className="w-16 h-16 bg-white/40 rounded-full" /> */}
              <img 
               src="/logo.jpg"  // <-- Replace with your logo path
               alt="Company Logo"
               className="w-26 h-24 object-contain rounded-full"
             />
            </div>
            <h2 className="text-3xl font-bold">
              {mode === "signin" ? "Welcome back!" : "Join ChatFlow"}
            </h2>
            <p className="mt-4 text-lg opacity-90">
              {mode === "signin"
                ? "Sign in to continue to your dashboard"
                : "Create your account and start building"}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          {mode === "signin" ? (
            <SignIn setUser={setUser} navigate={navigate} toggleMode={toggleMode} />
          ) : (
            <SignUp setUser={setUser} navigate={navigate} toggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
}

// ======================== SIGN IN ========================
function SignIn({ setUser, navigate, toggleMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(email)) return setError("Please enter a valid email");
    if (!PASSWORD_RE.test(password)) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      localStorage.setItem("token", data.access_token);

      // Get full user data
      const meRes = await fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!meRes.ok) throw new Error("Failed to fetch user data");

      const userData = await meRes.json();
      setUser(userData);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
        <p className="text-gray-600 mt-2">
          New here?{" "}
          <button type="button" onClick={toggleMode} className="text-indigo-600 font-semibold hover:underline">
            Create an account
          </button>
        </p>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none"
        required
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none"
        required
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

// ======================== SIGN UP ========================
function SignUp({ setUser, navigate, toggleMode }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    dob: "",
    country: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(form.email)) return setError("Please enter a valid email");
    if (!PASSWORD_RE.test(form.password)) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.first_name || null,
          last_name: form.last_name || null,
          dob: form.dob || null,
          country: form.country || null,
          phone_number: form.phone_number || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Registration failed. Email might already exist.");

      localStorage.setItem("token", data.access_token);

      const meRes = await fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!meRes.ok) throw new Error("Failed to load user");

      const userData = await meRes.json();
      setUser(userData);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-600 mt-2">
          Already have an account?{" "}
          <button type="button" onClick={toggleMode} className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </button>
        </p>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="First Name" value={form.first_name} onChange={update("first_name")} className="px-4 py-3 rounded-xl border border-gray-300" />
        <input type="text" placeholder="Last Name" value={form.last_name} onChange={update("last_name")} className="px-4 py-3 rounded-xl border border-gray-300" />
      </div>

      <input
        type="email"
        placeholder="Email *"
        value={form.email}
        onChange={update("email")}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none"
        required
      />

      <input
        type="password"
        placeholder="Password (6+ chars) *"
        value={form.password}
        onChange={update("password")}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-100 outline-none"
        required
      />

      <input type="date" placeholder="Date of Birth" value={form.dob} onChange={update("dob")} className="w-full px-4 py-3 rounded-xl border border-gray-300" />

      <input type="text" placeholder="Country" value={form.country} onChange={update("country")} className="w-full px-4 py-3 rounded-xl border border-gray-300" />

      <input type="text" placeholder="Phone Number" value={form.phone_number} onChange={update("phone_number")} className="w-full px-4 py-3 rounded-xl border border-gray-300" />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-70"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}