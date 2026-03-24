// src/components/HeroSection.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HeroSection({ user }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <section className="relative overflow-hidden -mt-16 min-h-[calc(100vh-64px)] flex items-center bg-[linear-gradient(180deg,#F7F7FF_0%,#FFFFFF_70%)]">
      {/* Animated background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div 
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl transition-all duration-1000"
          style={{
            transform: isVisible ? 'scale(1)' : 'scale(0.8)',
            opacity: isVisible ? 1 : 0
          }}
        />
        <div 
          className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-rose-200/25 blur-3xl transition-all duration-1000 delay-200"
          style={{
            transform: isVisible ? 'scale(1)' : 'scale(0.8)',
            opacity: isVisible ? 1 : 0
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* LEFT - Content with staggered animations */}
          <div className="max-w-2xl">
            
            {/* Main heading with fade-in */}
            <h1 
              className="mt-8 text-5xl sm:text-6xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight text-slate-900 transition-all duration-700 delay-100"
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0
              }}
            >
              The Ultimate Platform
              <br />
              for{" "}
              <span className="bg-[linear-gradient(135deg,#7C3AED,#A855F7)] bg-clip-text text-transparent">
                Chatbot Experimentation
              </span>
            </h1>

            {/* Description with fade-in */}
            <p 
              className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl transition-all duration-700 delay-200"
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0
              }}
            >
              Design, deploy, and analyze AI chatbot experiences through research-grade
              experiments. Build flows, test variants, and evaluate results with confidence.
            </p>

            {/* CTA buttons with fade-in */}
            <div 
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-700 delay-300"
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0
              }}
            >
              <button
                onClick={() =>
                  user ? navigate("/dashboard") : navigate("/auth?role=company&mode=signup")
                }
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                View Insights
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path
                    d="M5 12h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
{/* 
              <button
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) {
                    const headerOffset = 80;
                    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-slate-900 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-300"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3v10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 11l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 21h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                User Guidance
              </button> */}
              <a
  href="/Ariv User Guide.docx"                    // ← exact filename from public/
  download="Ariv User Guide.docx"                 // suggested name when saving
  className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-slate-900 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-300"
>
  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 11l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 21h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </span>
  User Guidance
</a>
            </div>

            {/* Trust badges with fade-in */}
            <div 
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-600 transition-all duration-700 delay-400"
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0
              }}
            >
            
            </div>
          </div>

          {/* RIGHT - Dashboard mockup with animations */}
          <div 
            className="relative transition-all duration-1000 delay-200"
            style={{
              transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(50px) scale(0.95)',
              opacity: isVisible ? 1 : 0
            }}
          >
            {/* floating accent: star */}
            <div className="pointer-events-none absolute -right-2 top-12 sm:top-10 sm:-right-6 z-20 animate-float">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M12 2l2.8 6.6 7.2.6-5.5 4.7 1.7 7-6.2-3.7-6.2 3.7 1.7-7L2 9.2l7.2-.6L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* floating accent: lightning */}
            <div className="pointer-events-none absolute left-6 -bottom-6 sm:left-10 sm:-bottom-8 z-20 animate-float-delayed">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[linear-gradient(135deg,#7C3AED,#A855F7)] shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M13 2L3 14h7l-1 8 12-14h-7l-1-6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* main mock card with hover effect */}
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)] overflow-hidden hover:shadow-[0_24px_80px_-35px_rgba(15,23,42,0.55)] transition-all duration-500">
              {/* top bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/80 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* content */}
              <div className="p-6 sm:p-7">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="h-3.5 w-11/12 rounded-full bg-slate-100 animate-pulse" />
                    <div className="mt-2 h-3.5 w-8/12 rounded-full bg-slate-100 animate-pulse" />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 transition-colors">
                    <div className="h-3 w-10/12 rounded-full bg-slate-200/70" />
                    <div className="mt-2 h-7 w-full rounded-lg bg-purple-100/60" />
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 transition-colors">
                    <div className="h-3 w-9/12 rounded-full bg-slate-200/70" />
                    <div className="mt-2 h-7 w-full rounded-lg bg-emerald-100/60" />
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 transition-colors">
                    <div className="h-3 w-8/12 rounded-full bg-slate-200/70" />
                    <div className="mt-2 h-7 w-full rounded-lg bg-rose-100/60" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 hover:border-purple-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-6/12 rounded-full bg-slate-100" />
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  </div>
                  <div className="mt-3 h-3 w-10/12 rounded-full bg-slate-100" />
                  <div className="mt-2 h-3 w-11/12 rounded-full bg-slate-100" />
                  <div className="mt-2 h-3 w-7/12 rounded-full bg-slate-100" />
                </div>
              </div>

              {/* subtle gradient footer */}
              <div className="h-2 w-full bg-[linear-gradient(90deg,#7C3AED,#10B981,#F43F5E)] opacity-60" />
            </div>

            {/* subtle grid hint behind mock */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.10),transparent_55%)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animations to index.css or App.css */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
}