

// src/components/FinalCTASection.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function FinalCTASection({ user }) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-50px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F5F3FF] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20">
        <div 
          className="text-center text-slate-900 transition-all duration-700"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0
          }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Research?
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Join researchers using ARIV to conduct better chatbot UX studies
          </p>

          <div 
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-200"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            {/* Primary CTA */}
            <button
              onClick={() => navigate("/experiment-config")}
              className="group rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Start Your Free Trial
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => navigate("/auth")}
              className="rounded-xl border-2 border-indigo-300 bg-white px-8 py-4 text-base font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Talk to an Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}