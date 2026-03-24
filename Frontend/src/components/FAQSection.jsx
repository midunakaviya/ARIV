
// src/components/FAQSection.jsx
import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    q: "How long does it take to set up an experiment?",
    a: "Most experiments can be set up in under 10 minutes using our guided configuration flow. Advanced setups may take slightly longer depending on complexity.",
  },
  {
    q: "Is my research data secure?",
    a: "Yes. All data is encrypted in transit and at rest. We follow GDPR-compliant data handling practices and strict access controls.",
  },
  {
    q: "Can I export my data for publication?",
    a: "Absolutely. You can export results in CSV format, suitable for academic publications and further analysis.",
  },
  {
    q: "Do you offer academic discounts?",
    a: "Yes. We offer special pricing for universities, students, and academic researchers. Contact us with your institutional email.",
  },
  {
    q: "What kind of support do you provide?",
    a: "We provide email support for free users, priority support for Pro users, and dedicated support with SLA for Enterprise customers.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
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
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div
          className="transition-all duration-700"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0
          }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-[#0B1220]">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Everything you need to know about our platform
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-500 ${
                  isOpen
                    ? "border-purple-500 bg-[#F4F0FF] shadow-lg"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible ? 1 : 0
                }}
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className={`w-full flex items-center justify-between px-6 py-5 text-left font-semibold transition-colors ${
                    isOpen
                      ? "text-purple-700"
                      : "text-[#0B1220] hover:text-purple-600"
                  }`}
                >
                  <span className="pr-8">{item.q}</span>
                  <span
                    className={`transform transition-all duration-300 flex-shrink-0 ${
                      isOpen
                        ? "rotate-90 text-purple-700"
                        : "text-gray-400"
                    }`}
                  >
                    →
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-purple-900/80 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}