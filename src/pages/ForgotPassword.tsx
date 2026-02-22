import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      <div className="flex items-center px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-1 rounded-xl active:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="flex flex-col flex-1 px-6 pt-4">
        <div className="text-5xl mb-6">🔑</div>
        <h1 className="font-display font-black text-3xl mb-2 leading-tight">Reset Password</h1>

        {sent ? (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-base">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
            </p>
            <p className="text-muted-foreground text-sm">
              Check your inbox and spam/junk folder. The link will expire in 1 hour.
            </p>
            <Link
              to="/login"
              className="mt-4 w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base text-center active:scale-[0.98] transition-all"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-base mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <div className="mt-2">
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base disabled:opacity-40 active:scale-[0.98] transition-all"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </div>
            </form>
          </>
        )}

        <div className="mt-auto pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/login" className="text-primary font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
