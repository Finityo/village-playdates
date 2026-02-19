import { Link } from "react-router-dom";
import { Shield, Users, Star, ArrowRight, CheckCircle2, Sparkles, MapPin, Calendar, Heart, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const howItWorks = [
  { icon: "🌸", title: "Create Your Profile", desc: "Share your neighborhood, kids' ages, interests, and schedule.", color: "hsl(142 38% 40%)" },
  { icon: "🔍", title: "Browse & Filter", desc: "Find moms by distance, kids' ages, and shared interests.", color: "hsl(12 82% 65%)" },
  { icon: "💬", title: "Connect & Chat", desc: "Icebreakers make it easy. Only mutual matches can message.", color: "hsl(204 80% 62%)" },
  { icon: "🛝", title: "Plan a Playdate", desc: "Pick a public park, confirm times, get reminders.", color: "hsl(42 90% 60%)" },
];

const safetyFeatures = [
  "ID verification required",
  "Mutual match before messaging",
  "Public meeting spot suggestions",
  "No children's photos policy",
];

const testimonials = [
  { name: "Rachel H.", neighborhood: "Oak Park", text: "Found my best mom-friend in two weeks! Our kids are inseparable now.", kids: "Mom of 2 (ages 3 & 5)", avatar: "RH", color: "hsl(142 38% 40%)" },
  { name: "Destiny L.", neighborhood: "Midtown", text: "Finally an app where I feel safe meeting new people. ID verification gave me peace of mind.", kids: "Mom of 1 (age 2)", avatar: "DL", color: "hsl(12 82% 65%)" },
  { name: "Mei C.", neighborhood: "Lakeside", text: "We have a group of 6 moms that meets every Saturday. MomCircle built our village!", kids: "Mom of 2 (ages 4 & 6)", avatar: "MC", color: "hsl(204 80% 62%)" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Full-bleed image */}
        <div className="relative h-72 md:h-96">
          <img src={heroImage} alt="Moms at the park" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
        </div>

        {/* Copy below image */}
        <div className="px-5 pt-4 pb-8 gradient-hero">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 border border-primary/20">
            <Sparkles className="h-3 w-3" />
            Mom friends are just a click away
          </div>
          <h1 className="font-display text-4xl font-black leading-tight mb-3">
            Make mom friends.<br />
            <span className="text-primary">Build your village.</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Connect with moms in your neighborhood based on your kids' ages, shared interests, and schedule.
          </p>

          <Link
            to="/onboarding"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base shadow-soft active:scale-[0.98] transition-all"
          >
            Get Started — It's Free
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Trust row */}
          <div className="flex items-center justify-around mt-6 pt-5 border-t border-border">
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold">ID-verified</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users className="h-5 w-5 text-coral" />
              <span className="text-xs font-bold">12,000+ moms</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Star className="h-5 w-5 text-secondary" fill="currentColor" />
              <span className="text-xs font-bold">4.9 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ────────────────────────────── */}
      <section className="px-4 py-6">
        <h2 className="font-display font-black text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🔍", label: "Browse Moms", sub: "Near you", href: "/browse", color: "bg-primary/10" },
            { icon: "📅", label: "Plan Playdate", sub: "Book a spot", href: "/playdates", color: "bg-secondary/20" },
            { icon: "💬", label: "Messages", sub: "3 unread", href: "/messages", color: "bg-coral/10" },
            { icon: "👥", label: "My Village", sub: "8 connections", href: "/browse", color: "bg-sky/10" },
          ].map((a) => (
            <Link
              key={a.label}
              to={a.href}
              className={`${a.color} rounded-2xl p-4 flex flex-col gap-2 active:scale-[0.97] transition-all border border-border/50`}
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="font-bold text-sm">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEARBY MOMS PREVIEW ──────────────────────── */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-lg">Moms Near You</h2>
          <Link to="/browse" className="text-primary text-sm font-bold flex items-center gap-0.5">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {[
            { avatar: "JM", name: "Jessica M.", dist: "0.4 mi", kids: "3 & 5 yrs", color: "hsl(142 38% 40%)", verified: true },
            { avatar: "AK", name: "Amara K.", dist: "0.9 mi", kids: "2 yrs", color: "hsl(12 82% 65%)", verified: true },
            { avatar: "SR", name: "Sofia R.", dist: "1.2 mi", kids: "4 & 7 yrs", color: "hsl(204 80% 62%)", verified: false },
            { avatar: "PT", name: "Priya T.", dist: "1.8 mi", kids: "1 & 3 yrs", color: "hsl(42 90% 60%)", verified: true },
          ].map((m, i) => (
            <Link
              key={m.avatar}
              to={`/mom/${i + 1}`}
              className="flex-shrink-0 w-36 bg-card rounded-2xl border border-border p-4 shadow-card active:scale-[0.97] transition-all"
            >
              <div className="relative mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-soft"
                  style={{ backgroundColor: m.color }}
                >
                  {m.avatar}
                </div>
                {m.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="h-2.5 w-2.5 text-white" fill="white" />
                  </div>
                )}
              </div>
              <p className="font-bold text-xs leading-tight mb-1">{m.name}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5" />{m.dist}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Kids: {m.kids}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="px-4 py-6">
        <h2 className="font-display font-black text-lg mb-4">How It Works</h2>
        <div className="space-y-3">
          {howItWorks.map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-card rounded-2xl p-4 border border-border shadow-card">
              <div className="text-2xl flex-shrink-0">{step.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: step.color }}>
                  Step {i + 1}
                </div>
                <h3 className="font-display font-bold text-sm mb-0.5">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAFETY ───────────────────────────────────── */}
      <section className="mx-4 my-4 rounded-3xl gradient-hero border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-display font-black text-lg">Safety First</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          MomCircle is built with safety as its foundation.
        </p>
        <div className="space-y-2.5">
          {safetyFeatures.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="px-4 py-4">
        <h2 className="font-display font-black text-lg mb-4">Moms Love MomCircle</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {testimonials.map((t) => (
            <div key={t.name} className="flex-shrink-0 w-72 bg-card rounded-2xl p-5 border border-border shadow-card">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-secondary" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-xs">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.kids} · {t.neighborhood}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREMIUM BANNER ───────────────────────────── */}
      <section className="mx-4 my-4 rounded-3xl gradient-banner text-white p-6">
        <div className="mb-1 text-sm font-bold opacity-80">MomCircle Premium</div>
        <h2 className="font-display font-black text-2xl mb-2">Grow your village faster</h2>
        <p className="text-sm opacity-80 mb-5">Unlimited connections, advanced filters, verified badge & more.</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black">$9</span>
            <span className="text-sm opacity-70">/month</span>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-white text-primary font-bold text-sm active:scale-[0.97] transition-all">
            Try Free 7 Days
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="px-4 py-6 text-center">
        <div className="font-display font-black text-base text-primary mb-1">MomCircle</div>
        <p className="text-xs text-muted-foreground">© 2025 · Building villages, one playdate at a time 🛝</p>
        <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Safety</a>
          <a href="#" className="hover:text-foreground">Terms</a>
        </div>
      </footer>
    </div>
  );
}
