
// src/components/WhyChooseAriv.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Users,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-violet-600" />,
    bg: "bg-violet-100",
    hoverBg: "group-hover:bg-violet-200",
    title: "Research-Grade Experimentation",
    description:
      "Research-grade data collection using validated surveys with built-in anonymization and randomization.",
  },
  {
    icon: <Zap className="w-6 h-6 text-violet-600" />,
    bg: "bg-violet-100",
    hoverBg: "group-hover:bg-violet-200",
    title: "Efficient Experiment Setup",
    description:
      "Configure and reorder experiment steps, define demographics, and launch chatbot studies in minutes.",
  },
  {
    icon: <Users className="w-6 h-6 text-violet-600" />,
    bg: "bg-violet-100",
    hoverBg: "group-hover:bg-violet-200",
    title: "Scalable Participant Management",
    description:
      "Manage participant pools, distribute experiments, and monitor participation across studies in real time.",
  },
  {
    icon: <Globe className="w-6 h-6 text-violet-600" />,
    bg: "bg-violet-100",
    hoverBg: "group-hover:bg-violet-200",
    title: "Flexible & Extensible Platform",
    description:
      "Integrate LLM APIs and chatbot interfaces to run experiments across multiple contexts and regions.",
  },
];

export default function WhyChooseAriv() {
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
    <section
      ref={sectionRef}
      id="whychooseariv"
      className="px-4 sm:px-6 lg:px-12 xl:px-20 py-20 bg-[#F4F0FF]"
    >
      
      {/* Heading with fade-in */}
      <div 
        className="text-center mb-14 transition-all duration-700"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: isVisible ? 1 : 0
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Why Customers Choose{" "} 
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            ARIV for Chatbot Experimentation
          </span>
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Built by MAASK, for everyone. 

        </p>
      </div>

      {/* Cards with staggered animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
            style={{
              transitionDelay: `${index * 100}ms`,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.hoverBg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              {item.icon}
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900 leading-snug min-h-[3rem] group-hover:text-violet-700 transition-colors">
              {item.title}
            </h3>

            <p className="mt-3 text-gray-600 text-sm leading-relaxed flex-grow">
              {item.description}
            </p>

            {/* Animated underline on hover */}
            <div className="mt-5 h-1 w-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>


    </section>
  );
}