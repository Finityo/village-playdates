import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-1 rounded-xl active:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="flex flex-col flex-1 px-6 pt-4">
        <div className="text-5xl mb-6">🌸</div>
        <h1 className="font-display font-black text-3xl mb-2 leading-tight">Welcome back!</h1>
        <p className="text-muted-foreground text-base mb-8">Sign in to your MomCircle account.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-14 rounded-2xl bg-card border border-border px-5 text-base outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full h-14 rounded-2xl bg-card border border-border px-5 pr-14 text-base outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="mt-2">
            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-auto pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
