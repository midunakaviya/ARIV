// src/components/FeatureCard.jsx

export default function FeatureCard({
  module,
  icon,
  title,
  description,
  features,
  statLabel,
  statValue,
  onClick,
  accent = "violet",
}) {
  // ARIV-aligned accent system
  const accents = {
    violet: {
      topBg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconText: "text-violet-600",
      button: "bg-violet-600 hover:bg-violet-700",
      tick: "text-violet-600",
    },
    emerald: {
      topBg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-600",
      button: "bg-emerald-600 hover:bg-emerald-700",
      tick: "text-emerald-600",
    },
    cyan: {
      topBg: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconText: "text-cyan-600",
      button: "bg-cyan-600 hover:bg-cyan-700",
      tick: "text-cyan-600",
    },
  };

  const tone = accents[accent];

  return (
    <div
      className="
        rounded-3xl
        border border-slate-200
        bg-white
        shadow-sm hover:shadow-md
        transition
        overflow-hidden
        flex flex-col
        max-w-[420px] w-full mx-auto
      "
    >
      {/* TOP COLORED SECTION */}
      <div className={`px-8 py-6 ${tone.topBg}`}>
        <div className="flex items-start gap-4">
          
          {/* Icon */}
          <div
            className={`h-12 w-12 rounded-xl ${tone.iconBg} flex items-center justify-center shrink-0`}
          >
            <div className={tone.iconText}>{icon}</div>
          </div>

          {/* Module + Title */}
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {module}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 leading-snug">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-8 py-8 flex flex-col flex-1">
        
        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed max-w-[95%]">
          {description}
        </p>

        {/* Feature list */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`${tone.tick} font-semibold mt-[1px]`}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 tracking-wide">
              {statLabel}
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {statValue}
            </p>
          </div>

          <button
            onClick={onClick}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition ${tone.button}`}
          >
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}
