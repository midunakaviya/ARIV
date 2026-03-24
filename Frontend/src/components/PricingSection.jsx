// src/components/PricingSection.jsx
import React, { useEffect, useRef, useState } from "react";

export default function PricingSection() {
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
    <section ref={sectionRef} className="w-full bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div 
          className="text-center transition-all duration-700"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#5B6475]">
            Choose the plan that fits your Experiment needs
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
          {/* FREE */}
          <div 
            className="rounded-2xl border border-[#E6E6EF] bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            style={{
              transitionDelay: '100ms',
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            <h3 className="text-lg font-bold text-[#0B1220]">Free</h3>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-extrabold text-[#0B1220]">€0</span>
              <span className="pb-1 text-sm text-[#5B6475]">/month</span>
            </div>

            <ul className="mt-5 space-y-3.5 text-sm text-[#0B1220]">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7EE] text-[#18A957]">
                  ✓
                </span>
                <span>Up to 3 experiments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7EE] text-[#18A957]">
                  ✓
                </span>
                <span>50 participants/month</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7EE] text-[#18A957]">
                  ✓
                </span>
                <span>Basic analytics</span>
              </li>
              
            </ul>

            <button className="mt-7 w-full rounded-xl bg-[#F2F2F6] py-2.5 text-sm font-semibold text-[#0B1220] hover:bg-[#EAEAEE] hover:scale-105 transition-all duration-300">
              
              
              Get Started
            </button>
          </div>

          {/* PRO (Most popular) - Scale up on hover */}
          <div 
            className="relative rounded-2xl bg-[linear-gradient(135deg,#7C3AED,#A855F7)] p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 hover:scale-105"
            style={{
              transitionDelay: '200ms',
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
              opacity: isVisible ? 1 : 0
            }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded-full bg-[#FFC107] px-4 py-1 text-xs font-extrabold text-[#0B1220] shadow-lg animate-pulse">
                MOST POPULAR
              </span>
            </div>

            <h3 className="text-lg font-bold">Pro</h3>

            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-extrabold">€99</span>
              <span className="pb-1 text-sm text-white/80">/month</span>
            </div>

            <ul className="mt-5 space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  ✓
                </span>
                <span>Unlimited experiments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  ✓
                </span>
                <span>1,000 participants/month</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  ✓
                </span>
                <span>Advanced analytics</span>
              </li>

            </ul>

            <button className="mt-7 w-full rounded-xl bg-white py-2.5 text-sm font-extrabold text-[#7C3AED] hover:bg-white/90 hover:scale-105 transition-all duration-300">
               Get Started
            </button>
          </div>

          {/* ENTERPRISE */}
          <div 
            className="rounded-2xl border border-[#E6E6EF] bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            style={{
              transitionDelay: '300ms',
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            <h3 className="text-lg font-bold text-[#0B1220]">Enterprise</h3>

            {/* <div className="mt-3">
              <div className="text-3xl font-extrabold text-[#0B1220]">Pro</div>
            </div> */}
            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-extrabold text-[#0B1220]">€199</span>
              <span className="pb-1 text-sm text-[#5B6475]">/month</span>
            </div>
            <ul className="mt-5 space-y-3.5 text-sm text-[#0B1220]">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7EE] text-[#18A957]">
                  ✓
                </span>
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7EE] text-[#18A957]">
                  ✓
                </span>
                <span>Unlimited participants</span>
              </li>
                
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF7EE] text-[#18A957]">
                  ✓
                </span>
                <span>Email support</span>
              </li>
            </ul>
            <button className="mt-7 w-full rounded-xl bg-[#F2F2F6] py-2.5 text-sm font-semibold text-[#0B1220] hover:bg-[#EAEAEE] hover:scale-105 transition-all duration-300">
              
              
              Get Started
            </button>
            
          </div>
        </div>
      </div>
    </section>
  );
}
