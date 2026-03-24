// // src/pages/Home.jsx
// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import HeroSection from "../components/HeroSection";
// import FeaturesSection from "../components/FeaturesSection";
// import PricingSection from "../components/PricingSection";
// import FAQSection from "../components/FAQSection";
// import ReviewsSection from "../components/ReviewsSection";

// export default function Home({ user }) {
//   const navigate = useNavigate();

//   // Real user name from simulated backend
//   const displayName = user
//     ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
//       user.email.split("@")[0]
//     : "User";

//   const firstName = user?.first_name || displayName.split(" ")[0];

//   const handleCTAClick = () => {
//     if (user) {
//       navigate("/dashboard");
//     } else {
//       navigate("/auth");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Real Navbar with real user */}
//       <Navbar user={user} />

//       {/* Hero with smart button */}
//       <HeroSection user={user} />

//       {/* Stunning features */}
//       <FeaturesSection />

//       {/* Pricing Section */}
//       <PricingSection />

//       {/* FAQ Section */}
//       <FAQSection/>

//       {/* Reviews Section */}
//       <ReviewsSection/>

//       {/* Personalized Final CTA */}
//       <section className="py-28 px-6 bg-gradient-to-b from-indigo-50 via-white to-white">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
//             Ready to run world-class chatbot experiments?
//           </h2>

//           <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
//             {user ? (
//               <>
//                 Hey{" "}
//                 <span className="font-bold text-indigo-600">{firstName}</span> —
//                 your experiments are waiting. See real-time SUS scores,
//                 participant behavior, and export everything in one click.
//               </>
//             ) : (
//               "Join 2,400+ researchers measuring chatbot UX with scientific precision."
//             )}
//           </p>

//           {user && (
//             <p className="mt-8 text-lg text-gray-500">
//               You’re logged in as{" "}
//               <span className="font-semibold text-gray-700">{displayName}</span>
//             </p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// // src/pages/Home.jsx
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import HeroSection from "../components/HeroSection";
// import FeaturesSection from "../components/FeaturesSection";
// //import WhyChooseSection from "../components/WhyChooseSection";
// import ReviewsSection from "../components/ReviewsSection";
// import PricingSection from "../components/PricingSection";
// import FAQSection from "../components/FAQSection";
// import FinalCTASection from "../components/FinalCTASection";
// import Footer from "../components/Footer";

// export default function Home({ user }) {
//   const navigate = useNavigate();

//   const displayName = user
//     ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
//       user.email.split("@")[0]
//     : "User";

//   const firstName = user?.first_name || displayName.split(" ")[0];

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar user={user} />

//       <main className="pt-14">
//         <HeroSection user={user} />
//         <FeaturesSection />
//         {/* <WhyChooseSection /> */}
//         <PricingSection />
//         <FAQSection />
//         <ReviewsSection />
//         <FinalCTASection />
//         <Footer />
//       </main>
//     </div>
//   );
// }

// src/pages/Home.jsx
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ReviewsSection from "../components/WhyChooseAriv";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import FinalCTASection from "../components/FinalCTASection";
import Footer from "../components/Footer";
import WhyChooseAriv from "../components/WhyChooseAriv";

export default function Home({ user }) {
  useEffect(() => {
    const handler = (e) => {
      const id = e?.detail;
      if (!id) return;

      let tries = 0;
      const maxTries = 80;

      const tick = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        tries += 1;
        if (tries < maxTries) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    window.addEventListener("ariv:scrollTo", handler);
    return () => window.removeEventListener("ariv:scrollTo", handler);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />

      <main className="pt-14">
        <HeroSection user={user} />

        <section id="features">
          <FeaturesSection />
        </section>

        {/* If you don’t have a Solutions section yet, we still need an anchor */}
        {/* <section id="solutions">
          <div />
        </section> */}

        <section id="pricing">
          <PricingSection />
        </section>

        <section id = "Features">
          <WhyChooseAriv />
        </section>

        <section id="faq">
          <FAQSection />
        </section>

        <FinalCTASection />
        <Footer />
      </main>
    </div>
  );
}
