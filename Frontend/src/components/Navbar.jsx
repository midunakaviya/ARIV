
// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { LogOut, ChevronDown } from "lucide-react";


// const API_BASE = "http://localhost:8000";

// export default function Navbar({ user }) {
//   const location = useLocation();
//   const navigate = useNavigate();
  

//   const [menuOpen, setMenuOpen] = useState(false);
//   const hasToken = !!localStorage.getItem("token");


//   // ---- fetch "me" from backend so logged-in name shows (e.g., John) ----
//   const [me, setMe] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setMe(null);
//       return;
//     }

//     // If user prop already has a person name, use it
//     const hasPersonName =
//       !!(user?.first_name || user?.firstName || user?.full_name || user?.fullName || user?.name || user?.username);

//     if (hasPersonName) {
//       setMe(user);
//       return;
//     }

//     let cancelled = false;

//     fetch(`${API_BASE}/auth/me`, {
//   headers: { Authorization: `Bearer ${token}` },
// })
//       .then((r) => (r.ok ? r.json() : null))
//       .then((data) => {
//         if (!cancelled && data) setMe(data);
//       })
//       .catch(() => {});

//     return () => {
//       cancelled = true;
//     };
//   }, [user]);

//   const effectiveUser = hasToken ? (me || user) : null;

//   // Prefer first/last name (John) from backend
//   const displayName = useMemo(() => {
//   const u = effectiveUser;
//   if (!u) return "User";

//   const first = u.first_name || u.firstName || "";
//   const last = u.last_name || u.lastName || "";
//   const full = `${first} ${last}`.trim();

//   return (
//     full ||
//     u.full_name ||
//     u.fullName ||
//     u.username ||
//     u.name ||
//     (u.email ? u.email.split("@")[0] : "") ||
//     "User"
//   );
// }, [effectiveUser]);

//   const avatarLetter = useMemo(() => {
//     return (displayName || "U").trim().slice(0, 1).toUpperCase() || "U";
//   }, [displayName]);

//   // Smooth scroll + account for sticky navbar height
//   const handleAnchorClick = (e, id) => {
//     e.preventDefault();
//     setMenuOpen(false);

//     const el = document.getElementById(id);
//     if (!el) return;

//     const headerOffset = 80; // sticky header height
//     const elementPosition = el.getBoundingClientRect().top + window.scrollY;
//     const offsetPosition = elementPosition - headerOffset;

//     window.history.replaceState(null, "", `#${id}`);
//     window.scrollTo({ top: offsetPosition, behavior: "smooth" });
//   };

//   // If page loads with a hash, scroll to it (with offset)
//   useEffect(() => {
//     const hash = location.hash;
//     if (!hash) return;

//     const id = hash.replace("#", "");
//     const el = document.getElementById(id);
//     if (!el) return;

//     const headerOffset = 80;
//     const elementPosition = el.getBoundingClientRect().top + window.scrollY;
//     const offsetPosition = elementPosition - headerOffset;

//     // delay a bit so sections are mounted
//     setTimeout(() => {
//       window.scrollTo({ top: offsetPosition, behavior: "smooth" });
//     }, 50);
//   }, [location.hash]);

//   // requirement: Sign In + Logout open welcome page
//   const handleSignIn = () => {
//     setMenuOpen(false);
//     navigate("/");
//   };

//   const handleLogout = () => {
//   setMenuOpen(false);
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   window.location.href = "/";
// };

//   return (
//     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
//         <div className="h-16 flex items-center justify-between">
//           {/* Brand */}
// <div className="flex items-center gap-2">
//   <span className="text-[18px] font-extrabold tracking-[0.18em] text-slate-900">
//   ARIV
// </span>
// </div>

//           {/* Nav Links (DESKTOP) */}
//           <div className="hidden md:flex items-center gap-8">
//             <a
//               href="#features"
//               onClick={(e) => handleAnchorClick(e, "features")}
//               className="text-gray-600 hover:text-gray-900 transition-colors"
//             >
//                     Features
//             </a>
            
//             <a
//               href="#pricing"
//               onClick={(e) => handleAnchorClick(e, "pricing")}
//               className="text-gray-600 hover:text-gray-900 transition-colors"
//             >
//                     Pricing
//             </a>
            
//             <a
//               href="#faq"
//               onClick={(e) => handleAnchorClick(e, "faq")}
//               className="text-gray-600 hover:text-gray-900 transition-colors"
//             >
//                     FAQ
//             </a>
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center gap-3">
//             {/* Mobile menu toggle */}
//             <button
//               type="button"
//               className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
//               onClick={() => setMenuOpen((v) => !v)}
//               aria-label="Open menu"
//             >
//               <div className="w-5 space-y-1">
//                 <div className="h-0.5 bg-slate-700" />
//                 <div className="h-0.5 bg-slate-700" />
//                 <div className="h-0.5 bg-slate-700" />
//               </div>
//             </button>

//             {!effectiveUser ? (
//               <>
//                 <button
//                   onClick={handleSignIn}
//                   className="hidden sm:inline-flex px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
//                 >
//                   Sign In
//                 </button>

//                 <button
//                   onClick={() => navigate("/auth?role=company&mode=signup")}
//                   className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[linear-gradient(135deg,#7C3AED,#A855F7)] shadow-sm hover:opacity-95"
//                 >
//                   Get Started Free
//                 </button>
//               </>
//             ) : (
//               <div className="hidden md:flex items-center gap-3">
//   <div className="relative">
//     <button
//       type="button"
//       onClick={() => setMenuOpen((v) => !v)}  // reuse your menuOpen
//       className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
//     >
//       <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 flex items-center justify-center font-bold shadow-sm">
//         {avatarLetter}
//       </div>

//       <div className="text-left leading-tight max-w-[160px]">
//         <div className="text-sm font-semibold text-slate-900 truncate">
//           {displayName}
//         </div>
//         <div className="text-xs text-slate-500 truncate">
//           Account
//         </div>
//       </div>

//       <ChevronDown className="w-4 h-4 text-slate-500" />
//     </button>

//     {menuOpen && (
//       <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
//         >
//           <LogOut className="w-4 h-4" />
//           Sign out
//         </button>
//       </div>
//     )}
//   </div>
// </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile dropdown */}
//         {menuOpen && (
//           <div className="md:hidden pb-4">
//             <div className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//               <div className="p-2">
//                 <a
//                   href="#features"
//                   onClick={(e) => handleAnchorClick(e, "features")}
//                   className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
//                 >
//                   Features
//                 </a>
                
//                 <a
//                   href="#pricing"
//                   onClick={(e) => handleAnchorClick(e, "pricing")}
//                   className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
//                 >
//                   Pricing
//                 </a>
//                 <a
//                   href="#solutions"
//                   onClick={(e) => handleAnchorClick(e, "solutions")}
//                   className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
//                 >
//                   Why Choose Ariv
//                 </a>
//                 <a
//                   href="#faq"
//                   onClick={(e) => handleAnchorClick(e, "faq")}
//                   className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
//                 >
//                   FAQ
//                 </a>
//               </div>

//               <div className="border-t border-slate-100 p-3 flex items-center justify-between gap-3">
//                 {!effectiveUser ? (
//                   <>
//                     <button
//                       onClick={handleSignIn}
//                       className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-800"
//                     >
//                       Sign In
//                     </button>
//                     <button
//                       onClick={() => {
//                         setMenuOpen(false);
//                         navigate("/auth?role=company&mode=signup");
//                       }}
//                       className="flex-1 px-4 py-2 rounded-xl font-semibold text-white bg-[linear-gradient(135deg,#7C3AED,#A855F7)]"
//                     >
//                       Get Started
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       <div className="h-9 w-9 rounded-xl bg-[linear-gradient(135deg,#7C3AED,#A855F7)] text-white flex items-center justify-center font-bold shadow-sm">
//                         {avatarLetter}
//                       </div>
//                       <div className="min-w-0">
//                         <div className="text-sm font-semibold text-slate-900 truncate">
//                           {displayName}
//                         </div>
//                       </div>
//                     </div>

//                     <button
//                       onClick={handleLogout}
//                       className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[linear-gradient(135deg,#7C3AED,#A855F7)] shadow-sm hover:opacity-95"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       Logout
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function Navbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const hasToken = !!localStorage.getItem("token");

  // Fetch "me" ...
  const [me, setMe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMe(null);
      return;
    }

    const hasPersonName = !!(
      user?.first_name ||
      user?.firstName ||
      user?.full_name ||
      user?.fullName ||
      user?.name ||
      user?.username
    );

    if (hasPersonName) {
      setMe(user);
      return;
    }

    let cancelled = false;

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setMe(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user]);

  const effectiveUser = hasToken ? me || user : null;

  const displayName = useMemo(() => {
    const u = effectiveUser;
    if (!u) return "User";

    const first = u.first_name || u.firstName || "";
    const last = u.last_name || u.lastName || "";
    const full = `${first} ${last}`.trim();

    return (
      full ||
      u.full_name ||
      u.fullName ||
      u.username ||
      u.name ||
      (u.email ? u.email.split("@")[0] : "") ||
      "User"
    );
  }, [effectiveUser]);

  const avatarLetter = useMemo(() => {
    return (displayName || "U").trim().slice(0, 1).toUpperCase() || "U";
  }, [displayName]);

  // Smooth scroll with offset
  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);

    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    setTimeout(() => {
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }, 50);
  }, [location.hash]);

  const handleSignIn = () => {
    setMenuOpen(false);
    navigate("/");
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="h-16 flex items-center justify-between">
          {/* Brand - left */}
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-extrabold tracking-[0.18em] text-slate-900">
              ARIV
            </span>
          </div>

          {/* Right side: links + account */}
          <div className="flex items-center gap-8">
            {/* Desktop nav links - moved to right */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                onClick={(e) => handleAnchorClick(e, "features")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleAnchorClick(e, "pricing")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={(e) => handleAnchorClick(e, "faq")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </a>
            </div>

            {/* Auth / Account area */}
            <div className="flex items-center gap-3">
              {/* Mobile toggle */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open menu"
              >
                <div className="w-5 space-y-1">
                  <div className="h-0.5 bg-slate-700" />
                  <div className="h-0.5 bg-slate-700" />
                  <div className="h-0.5 bg-slate-700" />
                </div>
              </button>

              {!effectiveUser ? (
                <>
                  <button
                    onClick={handleSignIn}
                    className="hidden sm:inline-flex px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => navigate("/auth?role=company&mode=signup")}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[linear-gradient(135deg,#7C3AED,#A855F7)] shadow-sm hover:opacity-95"
                  >
                    Get Started Free
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                  >
                    <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 flex items-center justify-center font-bold shadow-sm">
                      {avatarLetter}
                    </div>

                    <div className="text-left leading-tight max-w-[160px]">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {displayName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        Account
                      </div>
                    </div>

                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden py-1">
                      {/* Optional: show marketing links in dropdown when logged in */}
                      <a
                        href="#features"
                        onClick={(e) => handleAnchorClick(e, "features")}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Features
                      </a>
                      <a
                        href="#pricing"
                        onClick={(e) => handleAnchorClick(e, "pricing")}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Pricing
                      </a>
                      <a
                        href="#faq"
                        onClick={(e) => handleAnchorClick(e, "faq")}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100"
                      >
                        FAQ
                      </a>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────── */}
        {/* Mobile menu - keep similar but reorder if desired */}
        {/* ──────────────────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden pb-5 pt-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-2">
                <a
                  href="#features"
                  onClick={(e) => handleAnchorClick(e, "features")}
                  className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => handleAnchorClick(e, "pricing")}
                  className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={(e) => handleAnchorClick(e, "faq")}
                  className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  FAQ
                </a>
              </div>

              <div className="border-t border-slate-100 p-3">
                {!effectiveUser ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSignIn}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-800"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/auth?role=company&mode=signup");
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-[linear-gradient(135deg,#7C3AED,#A855F7)]"
                    >
                      Get Started
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                        {avatarLetter}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {displayName}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-sm hover:brightness-105"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}