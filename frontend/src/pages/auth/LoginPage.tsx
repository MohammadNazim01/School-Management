import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { theme } = useUIStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tokens = await authService.login(email, password);
      const user = await authService.me(tokens.access_token);
      setAuth(user, tokens.access_token);
      toast.success(`Welcome back, ${user.email.split("@")[0]}!`);
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Mobile brand */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-bold text-lg">EduCore</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in to EduCore</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10"
              rightIcon={
                <button type="button" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff /> : <Eye />}
                </button>
              }
            />
          </div>

          <Button type="submit" className="w-full h-10" variant="gradient" loading={loading}>
            Sign in
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground">Demo credentials</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Admin", email: "admin@school.edu", pw: "admin123" },
            { label: "Teacher", email: "teacher@school.edu", pw: "teacher123" },
            { label: "Student", email: "student@school.edu", pw: "student123" },
          ].map((demo) => (
            <button
              key={demo.label}
              type="button"
              onClick={() => { setEmail(demo.email); setPassword(demo.pw); }}
              className="rounded-lg border p-2.5 text-center hover:bg-muted transition-colors"
            >
              <p className="text-xs font-semibold">{demo.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{demo.email}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
