
// src/pages/AuthScreen.jsx
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PASSWORD_RE = /^.{6,}$/;

const INDUSTRIES = [
  "Technology",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Other",
];

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

export default function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const urlRole = searchParams.get("role") || "participant"; 
  const initialMode = searchParams.get("mode") || "signin"; 
  const isParticipant = urlRole === "participant";

  const [mode, setMode] = useState(initialMode);

  const toggleMode = () => {
    const newMode = mode === "signin" ? "signup" : "signin";
    setMode(newMode);
    navigate(`/auth?role=${urlRole}&mode=${newMode}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[1080px] bg-white rounded-[22px] shadow-[0_30px_70px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col lg:flex-row">

        {/* Left panel */}
        <div className="w-full lg:w-[46%] bg-gradient-to-b from-[#7C3AED] via-[#7C3AED] to-[#6D28D9] relative">
          <button
            onClick={() => navigate("/welcome")}
            className="absolute top-6 left-6 text-white/95 text-[14px] font-medium flex items-center gap-2 hover:opacity-90"
          >
            <span className="text-[18px] leading-none">←</span> Back
          </button>

          <div className="h-full min-h-[560px] flex flex-col items-center justify-center text-center px-10 py-14">
            <div className="w-[92px] h-[92px] rounded-full border-2 border-white/20 flex items-center justify-center">
              <div className="w-[74px] h-[74px] rounded-full bg-white/10 flex items-center justify-center">
                {isParticipant ? (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <path d="M16 11a4 4 0 1 0-8 0a4 4 0 0 0 8 0Z" stroke="white" strokeWidth="2" />
                    <path d="M4 21v-1a7 7 0 0 1 14 0v1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5 21V7l7-4l7 4v14" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M9 21v-6h6v6" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            <h2 className="mt-10 text-[34px] font-semibold text-white leading-tight">
              {mode === "signin"
                ? "Welcome Back!"
                : isParticipant
                  ? "Join as Participant"
                  : "Join as Company"}
            </h2>

            <p className="mt-4 text-white/85 text-[15px] leading-7 max-w-[340px]">
              {mode === "signin"
                ? isParticipant
                  ? "Sign in to continue your experiments"
                  : "Sign in to manage your experiments"
                : isParticipant
                  ? "Join experiments, earn rewards, and contribute to research"
                  : "Create and manage experiments for your research"}
            </p>

            <div className="mt-10 space-y-4 text-left w-full max-w-[320px]">
              {isParticipant ? (
                <>
                  <Benefit text="Earn stars and badges" />
                  <Benefit text="Track your progress" />
                  <Benefit text="Contribute to research" />
                </>
              ) : (
                <>
                  <Benefit text="Create unlimited experiments" />
                  <Benefit text="Advanced analytics" />
                  <Benefit text="Manage participants" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-[54%] px-10 py-12 lg:px-14 lg:py-14">
          {mode === "signin" ? (
            <SignInPanel
              role={urlRole}
              isParticipant={isParticipant}
              onToggleMode={toggleMode}
              navigate={navigate}
            />
          ) : (
            <SignUpPanel
              role={urlRole}
              isParticipant={isParticipant}
              onToggleMode={toggleMode}
              navigate={navigate}
            />
          )}
        </div>

      </div>
    </div>
  );
}

function Benefit({ text }) {
  return (
    <div className="flex items-center gap-3 text-white/90">
      <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-white/10">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[14px]">{text}</span>
    </div>
  );
}

/* ------------------------------ SIGN IN ------------------------------ */

function SignInPanel({ role, isParticipant, onToggleMode, navigate }) {
  return (
    <div className="w-full max-w-[420px]">
      <h1 className="text-[28px] font-medium text-[#111827]">
        {isParticipant ? "Participant Sign In" : "Company Sign In"}
      </h1>

      <p className="mt-2 text-[14px] text-[#6B7280]">
        Don't have an account?{" "}
        <button type="button" onClick={onToggleMode} className="text-[#7C3AED] font-semibold hover:underline">
          Create one
        </button>
      </p>

      <div className="mt-10">
        <SignInForm role={role} isParticipant={isParticipant} navigate={navigate} />
      </div>
    </div>
  );
}

function SignInForm({ role, isParticipant, navigate }) {
  const isCompanyPage = role === "company";

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

      const backendRole = data.role || data.user_type;

      // --- ROLE ENFORCEMENT FIX ---
      if (isCompanyPage && backendRole !== "company") {
        setError("This is a Company login page. Please login as Participant.");
        setLoading(false);
        return;
      }

      if (!isCompanyPage && backendRole !== "participant") {
        setError("This is a Participant login page. Please login as Company.");
        setLoading(false);
        return;
      }

      // Save correct role
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", backendRole);

      // Redirect
      if (backendRole === "participant") {
        navigate("/participant/dashboard");
      } else {
        navigate("/home");
      }

    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-[14px]">{error}</div>
      )}

      <Field label="Email">
        <input
          type="email"
          placeholder={isParticipant ? "user@example.com" : "company@example.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none ring-0 focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none ring-0 focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full h-[48px] rounded-[12px] bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white font-semibold text-[14px] disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

/* ------------------------------ SIGN UP ------------------------------ */
/* (SignUp panels unchanged — your signup was already correct) */

function SignUpPanel({ role, isParticipant, onToggleMode, navigate }) {
  return (
    <div className="w-full max-w-[520px]">
      <h1 className="text-[28px] font-medium text-[#111827]">
        {isParticipant ? "Create Participant Account" : "Create Company Account"}
      </h1>

      <p className="mt-2 text-[14px] text-[#6B7280]">
        Already have an account?{" "}
        <button type="button" onClick={onToggleMode} className="text-[#7C3AED] font-semibold hover:underline">
          Sign In
        </button>
      </p>

      <div className="mt-8">
        {isParticipant ? (
          <ParticipantSignUpForm role={role} navigate={navigate} />
        ) : (
          <CompanySignUpForm role={role} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

function ParticipantSignUpForm({ role, navigate }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !dob) return setError("Please fill all required fields");
    if (!PASSWORD_RE.test(password)) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "participant",           // ← send role
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          dob,
          gender: gender || null,
          profession: profession || null,
          country: country || null,
          phone_number: phoneNumber || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", "participant");
        navigate("/participant/dashboard");
      } else {
        navigate(`/auth?role=${role}&mode=signin`, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-[14px]">{error}</div>}

      <Field label="First Name">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Last Name">
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Date of Birth">
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Gender">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full h-[44px] px-4 bg-white border border-[#D1D5DB] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </Field>

      <Field label="Profession">
        <input
          type="text"
          placeholder="Your Profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
        />
      </Field>

      <Field label="Country">
        <input
          type="text"
          placeholder="Your Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
        />
      </Field>

      <Field label="Phone Number">
        <input
          type="tel"
          placeholder="Contact number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          placeholder="type your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full h-[48px] rounded-[12px] bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white font-semibold text-[14px] disabled:opacity-70"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}

function CompanySignUpForm({ role, navigate }) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!companyName.trim()) return setError("Company name is required");
    if (!contactPerson.trim()) return setError("Contact person is required");
    if (!EMAIL_RE.test(email)) return setError("Please enter a valid email");
    if (!PASSWORD_RE.test(password)) return setError("Password must be at least 6 characters");
    if (!industry) return setError("Please select an industry");
    if (!companySize) return setError("Please select a company size");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "company",
          email,
          password,
          company_name: companyName,
          contact_person: contactPerson,
          industry,
          company_size: companySize,
          website: website || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", "company");
        navigate("/dashboard"); // ← consistent with login
      } else {
        navigate(`/auth?role=${role}&mode=signin`, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-[14px]">{error}</div>}

      <Field label="Company Name">
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Contact Person">
        <input
          type="text"
          placeholder="Full Name"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Company Email">
        <input
          type="email"
          placeholder="company@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        />
      </Field>

      <Field label="Industry">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full h-[44px] px-4 bg-white border border-[#D1D5DB] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        >
          <option value="">Select Industry</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Company Size">
        <select
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          className="w-full h-[44px] px-4 bg-white border border-[#D1D5DB] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
          required
        >
          <option value="">Select Size</option>
          {COMPANY_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Website (Optional)">
        <input
          type="url"
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full h-[44px] px-4 bg-[#F3F4F6] rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-purple-200"
          disabled={loading}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full h-[48px] rounded-[12px] bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white font-semibold text-[14px] disabled:opacity-70"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}

/* Your ParticipantSignUpForm, CompanySignUpForm, Field components stay SAME */

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-[12px] font-medium text-[#111827]">{label}</div>
      {children}
    </div>
  );
}
