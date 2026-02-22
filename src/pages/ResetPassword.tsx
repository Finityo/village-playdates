import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the hash token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return;
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated! 🎉", description: "You can now sign in with your new password." });
      navigate("/dashboard");
    }
  };

  if (!ready) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 px-6">
        <div className="text-5xl mb-6">⏳</div>
        <h1 className="font-display font-black text-2xl mb-2 text-center">Verifying reset link…</h1>
        <p className="text-muted-foreground text-sm text-center">
          If this takes too long, the link may have expired. Request a new one from the login page.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      <div className="flex flex-col flex-1 px-6 pt-12">
        <div className="text-5xl mb-6">🔐</div>
        <h1 className="font-display font-black text-3xl mb-2 leading-tight">New Password</h1>
        <p className="text-muted-foreground text-base mb-8">Choose a strong new password for your account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-foreground">New password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-foreground">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type it again"
              required
              minLength={6}
              className="w-full h-14 rounded-2xl bg-card border border-border px-5 text-base outline-none focus:border-primary transition-colors"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive font-medium">Passwords don't match</p>
            )}
          </div>

          <div className="mt-2">
            <button
              type="submit"
              disabled={loading || password.length < 6 || password !== confirmPassword}
              className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              {loading ? "Updating…" : "Set New Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
