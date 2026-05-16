import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back to <span className="text-purple-400">TaskZen</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to continue your AI-powered workflow.</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
