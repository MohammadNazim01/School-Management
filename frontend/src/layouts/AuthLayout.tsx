import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  { label: "Student Management", desc: "Track every student's journey" },
  { label: "Attendance Analytics", desc: "Real-time attendance insights" },
  { label: "Performance Reports", desc: "Automated grade calculations" },
  { label: "Fee Management", desc: "Streamlined payment tracking" },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex w-[480px] flex-col bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 size-64 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 size-48 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col h-full p-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EduCore</span>
          </div>

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-bold text-white leading-tight">
                The modern school
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">
                  management system.
                </span>
              </h1>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">
                One platform to manage students, teachers, attendance, grades, fees, and more.
              </p>
            </motion.div>

            <div className="mt-10 space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="size-2 rounded-full bg-violet-400 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-white">{f.label}</span>
                    <span className="text-sm text-slate-400"> — {f.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500">© 2025 EduCore. Built for modern schools.</p>
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
