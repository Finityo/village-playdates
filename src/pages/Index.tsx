import { Link, Navigate } from "react-router-dom";
import { Shield, Users, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroLanding from "@/assets/hero-landing.jpg";

const howItWorks = [
  { icon: "🌸", title: "Create Your Profile", desc: "Share your neighborhood, kids' ages, interests, and schedule.", color: "hsl(142 38% 40%)" },
  { icon: "🔍", title: "Browse & Filter", desc: "Find moms by distance, kids' ages, and shared interests.", color: "hsl(12 82% 65%)" },
  { icon: "💬", title: "Connect & Chat", desc: "Icebreakers make it easy. Only mutual matches can message.", color: "hsl(204 80% 62%)" },
  { icon: "🛝", title: "Plan a Playdate", desc: "Pick a public park, confirm times, get reminders.", color: "hsl(42 90% 60%)" },
];

const safetyFeatures = [
  "ID verification required", "Mutual match before messaging",
  "Public meeting spot suggestions", "No children's photos policy",
];

const testimonials = [
  { name: "Rachel H.", neighborhood: "Oak Park", text: "Found my best mom-friend in two weeks! Our kids are inseparable now.", kids: "Mom of 2 (ages 3 & 5)", avatar: "RH", color: "hsl(142 38% 40%)" },
  { name: "Destiny L.", neighborhood: "Midtown", text: "Finally an app where I feel safe meeting new people. ID verification gave me peace of mind.", kids: "Mom of 1 (age 2)", avatar: "DL", color: "hsl(12 82% 65%)" },
  { name: "Mei C.", neighborhood: "Lakeside", text: "We have a group of 6 moms that meets every Saturday. MomCircle built our village!", kids: "Mom of 2 (ages 4 & 6)", avatar: "MC", color: "hsl(204 80% 62%)" },
];

export default function Index() {
  const { session, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── TOP BAR ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 bg-background/95 backdrop-blur border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-soft">
            <span className="text-white font-black text-sm">MC</span>
          </div>
          <span className="font-display font-black text-lg text-foreground">MomCircle</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-full text-sm font-bold border border-border hover:bg-muted transition"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-full text-sm font-bold gradient-primary text-white shadow-soft hover:opacity-90 transition"
          >
            Join free
          </Link>
        </div>
      </div>

      {/* ── HERO ILLUSTRATION ────────────────────────────── */}
      <div className="w-full overflow-hidden" style={{ maxHeight: "52vw", minHeight: 220 }}>
        <img
          src={heroLanding}
          alt="Two moms chatting at the park while kids play"
          className="w-full object-cover object-top"
          style={{ aspectRatio: "16/9" }}
        />
      </div>

      {/* ── HERO COPY ────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-8 gradient-hero">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-5 border border-primary/20">
          <Sparkles className="h-3 w-3" />
          Mom friends are just a click away
        </div>

        <h1 className="font-display text-4xl font-black leading-tight mb-3">
          Make mom friends.<br />
          <span className="text-primary">Build your village.</span>
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed mb-7">
          Connect with moms in your neighborhood based on your kids' ages, shared interests, and schedule.
        </p>

        <Link
          to="/signup"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base shadow-soft active:scale-[0.98] transition-all mb-3"
        >
          Get Started — It's Free <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-center text-sm text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="text-primary font-bold">
            Sign in
          </Link>
        </p>

        {/* Trust bar */}
        <div className="flex items-center justify-around mt-7 pt-6 border-t border-border">
          <div className="flex flex-col items-center gap-1.5">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xs font-bold">ID-verified</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-1.5">
            <Users className="h-6 w-6 text-coral" />
            <span className="text-xs font-bold">12,000+ moms</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-1.5">
            <Star className="h-6 w-6 text-secondary" fill="currentColor" />
            <span className="text-xs font-bold">4.9 rating</span>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="px-4 py-8">
        <h2 className="font-display font-black text-xl mb-5">How It Works</h2>
        <div className="space-y-3">
          {howItWorks.map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-card rounded-2xl p-4 border border-border shadow-card">
              <div className="text-2xl flex-shrink-0">{step.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: step.color }}>Step {i + 1}</div>
                <h3 className="font-display font-bold text-sm mb-0.5">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAFETY ───────────────────────────────────────── */}
      <section className="mx-4 mb-8 rounded-3xl gradient-hero border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-display font-black text-lg">Safety First</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">MomCircle is built with safety as its foundation.</p>
        <div className="space-y-2.5">
          {safetyFeatures.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="px-4 pb-8">
        <h2 className="font-display font-black text-xl mb-5">Moms Love MomCircle</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
          {testimonials.map((t) => (
            <div key={t.name} className="flex-shrink-0 w-72 bg-card rounded-2xl p-5 border border-border shadow-card">
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-secondary" fill="currentColor" />)}</div>
              <p className="text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: t.color }}>{t.avatar}</div>
                <div>
                  <p className="font-bold text-xs">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.kids} · {t.neighborhood}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="mx-4 mb-8 rounded-3xl gradient-banner text-white p-6 text-center">
        <div className="text-3xl mb-3">🛝</div>
        <h2 className="font-display font-black text-2xl mb-2">Join your village today</h2>
        <p className="text-sm opacity-80 mb-5">12,000+ moms already building real friendships.</p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-base shadow-soft active:scale-[0.97] transition-all"
        >
          Get Started Free <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="px-4 py-6 text-center">
        <div className="font-display font-black text-base text-primary mb-1">MomCircle</div>
        <p className="text-xs text-muted-foreground">© 2025 · Building villages, one playdate at a time 🛝</p>
        <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/safety" className="hover:text-foreground">Safety</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
