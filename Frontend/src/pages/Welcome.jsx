import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#FBF8FF] flex items-center justify-center">
      <div className="w-full max-w-[1180px] px-6 py-14">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-[#7C3AED] shadow-[0_10px_20px_rgba(124,58,237,0.25)] flex items-center justify-center">
            <span className="text-white text-2xl">✦</span>
          </div>

          <h1 className="mt-6 text-[18px] font-medium text-[#111827]">
            Welcome to Ariv
          </h1>
          <p className="mt-2 text-[15px] text-[#6B7280]">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 max-w-[1040px] mx-auto">
          <button
            type="button"
            onClick={() => navigate("/auth?role=participant&mode=signin")}
            className="bg-white rounded-[18px] shadow-[0_16px_30px_rgba(17,24,39,0.10)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.14)] transition-shadow border border-[#F1F1F5] h-[260px] flex flex-col items-center justify-center px-10"
          >
            <div className="h-[74px] w-[74px] rounded-full bg-[#F3E8FF] flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>

            <div className="mt-8 text-center">
              <div className="text-[18px] font-medium text-[#111827]">
                I'm a Participant
              </div>
              <div className="mt-3 text-[14px] leading-6 text-[#6B7280] max-w-[360px]">
                Join experiments, earn rewards, and contribute to research
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[#7C3AED] text-[14px] font-medium">
              <span>Continue as Participant</span>
              <span className="text-[18px] leading-none">›</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/auth?role=company&mode=signin")}
            className="bg-white rounded-[18px] shadow-[0_16px_30px_rgba(17,24,39,0.10)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.14)] transition-shadow border border-[#F1F1F5] h-[260px] flex flex-col items-center justify-center px-10"
          >
            <div className="h-[74px] w-[74px] rounded-full bg-[#F3E8FF] flex items-center justify-center">
              <span className="text-3xl">🏢</span>
            </div>

            <div className="mt-8 text-center">
              <div className="text-[18px] font-medium text-[#111827]">
                I'm a Company
              </div>
              <div className="mt-3 text-[14px] leading-6 text-[#6B7280] max-w-[380px]">
                Create experiments, manage research, and analyze results
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[#7C3AED] text-[14px] font-medium">
              <span>Continue as Company</span>
              <span className="text-[18px] leading-none">›</span>
            </div>
          </button>
        </div>

        <div className="mt-14 text-center text-[14px] text-[#6B7280]">
          By continuing, you agree to our{" "}
          <span className="underline underline-offset-2 cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-2 cursor-pointer">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
}
