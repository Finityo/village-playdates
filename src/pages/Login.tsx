import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      toast({ title: "Enter your email", description: "Type your email address above, then tap resend.", variant: "destructive" });
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim() });
    setResending(false);

    if (error) {
      toast({ title: "Couldn't resend", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verification email sent! 📬", description: "Check your inbox and spam/junk folder." });
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

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary font-semibold hover:underline">
              Forgot password?
            </Link>
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
        </div>

        <button
          type="button"
          onClick={async () => {
            const { error, redirected } = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: `${window.location.origin}/dashboard`,
            });
            if (!redirected && !error) navigate("/dashboard");
            if (error) toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
          }}
          className="w-full py-4 rounded-2xl border border-border bg-card font-bold text-base flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={async () => {
            const { error, redirected } = await lovable.auth.signInWithOAuth("apple", {
              redirect_uri: `${window.location.origin}/dashboard`,
            });
            if (!redirected && !error) navigate("/dashboard");
            if (error) toast({ title: "Apple sign-in failed", description: String(error), variant: "destructive" });
          }}
          className="w-full mt-3 py-4 rounded-2xl border border-border bg-card font-bold text-base flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Continue with Apple
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resending}
            className="text-sm text-primary font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Didn't get a verification email? Resend"}
          </button>
        </div>

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
