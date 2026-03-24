export default function ReviewsSection() {
  return (
    <section className="py-14 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black font-semibold text-[#0B1220] mb-4">
            Trusted by Industry Teams Worldwide
          </h2>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <div className="flex gap-1 text-yellow-400 text-lg">★★★★★</div>
            <span>4.9/5 from 2,000+ teams</span>
          </div>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-white p-4">
            <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              “ARIV completely changed how we evaluate User Experience.
              Running controlled experiments is now fast and structured.”
            </p>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                TC
              </div>
              <div>
                <p className="font-semibold text-[#0B1220]">Thomas Klein</p>
                <p className="text-sm text-gray-500">
                  Head of Product, SaaS Platform
                </p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-white p-4">
            <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              “The analytics and experiment comparison features give us insights
              we never had before. ARIV is now central to our chatbot roadmap.”
            </p>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                GS
              </div>
              <div>
                <p className="font-semibold text-[#0B1220]">Anita Verma</p>
                <p className="text-sm text-gray-500">
                  Director of AI, Enterprise Solutions
                </p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-white p-4">
            <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              “Best-in-class platform for chatbot testing. From setup to results,
              everything feels professional, scalable, and enterprise-ready.”
            </p>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                IL
              </div>
              <div>
                <p className="font-semibold text-[#0B1220]">James Liu</p>
                <p className="text-sm text-gray-500">
                  Research Lead, Innovation Labs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
