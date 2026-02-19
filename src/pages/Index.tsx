import { Link } from "react-router-dom";
import { MapPin, Shield, Users, Calendar, Heart, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const howItWorks = [
  {
    icon: "🌸",
    title: "Create Your Profile",
    desc: "Share your neighborhood, your kids' ages, interests, and when you're free — no children's photos required.",
    color: "hsl(142 38% 40%)",
  },
  {
    icon: "🔍",
    title: "Browse & Filter",
    desc: "Search by distance, kids' ages, shared interests, and schedule overlap. Your perfect mom match is nearby.",
    color: "hsl(12 82% 65%)",
  },
  {
    icon: "💬",
    title: "Connect & Chat",
    desc: "Use pre-written icebreakers or your own words. Only mutual connections can message each other.",
    color: "hsl(204 80% 62%)",
  },
  {
    icon: "🛝",
    title: "Plan a Playdate",
    desc: "Use our playdate planner to suggest parks, confirm times, and get reminders. Your village awaits!",
    color: "hsl(42 90% 60%)",
  },
];

const safetyFeatures = [
  "ID verification required",
  "Mutual match before messaging",
  "Public meeting spot suggestions",
  "Community reporting system",
  "Profile verification badges",
  "No children's photos policy",
];

const testimonials = [
  {
    name: "Rachel H.",
    neighborhood: "Oak Park",
    text: "Found my best mom-friend in two weeks! Our kids are inseparable now.",
    kids: "Mom of 2 (ages 3 & 5)",
    avatar: "RH",
    color: "hsl(142 38% 40%)",
  },
  {
    name: "Destiny L.",
    neighborhood: "Midtown",
    text: "Finally a safe app where I feel comfortable meeting new people. The ID verification gave me peace of mind.",
    kids: "Mom of 1 (age 2)",
    avatar: "DL",
    color: "hsl(12 82% 65%)",
  },
  {
    name: "Mei C.",
    neighborhood: "Lakeside",
    text: "We have a group of 6 moms now that meets every Saturday. MomCircle built our village!",
    kids: "Mom of 2 (ages 4 & 6)",
    avatar: "MC",
    color: "hsl(204 80% 62%)",
  },
];

const premiumFeatures = [
  "Unlimited connections per day",
  "See who liked your profile",
  "Advanced filters (school, language, parenting style)",
  "Verified badge",
  "Boost profile visibility",
  "Priority safety support",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        <div className="gradient-hero absolute inset-0 -z-10" />
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/8 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-secondary/20 blur-2xl -z-10" />

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-end">
            {/* Left: Copy */}
            <div className="pb-12 md:pb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                Mom friends are just a click away
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-5">
                Make mom friends.{" "}
                <span className="text-primary relative">
                  Build your
                  <br />village.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                Connect with moms in your neighborhood based on your kids' ages, shared interests, and schedule. No algorithms — just real community.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full gradient-primary text-white font-bold text-base shadow-soft hover:shadow-hover transition-all"
                >
                  Find Moms Near Me
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-card border border-border font-bold text-base hover:bg-accent transition"
                >
                  How it Works
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-5 mt-8">
                <div className="flex items-center gap-1.5 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-semibold">ID-verified moms</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-coral" />
                  <span className="font-semibold">12,000+ moms</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 text-secondary" fill="currentColor" />
                  <span className="font-semibold">4.9 rating</span>
                </div>
              </div>
            </div>

            {/* Right: Hero image */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg">
                <img
                  src={heroImage}
                  alt="Two moms chatting at a park while their kids play"
                  className="w-full rounded-t-3xl shadow-floating object-cover"
                  style={{ maxHeight: "480px" }}
                />
                {/* Floating card */}
                <div className="absolute -left-6 top-1/3 bg-card rounded-2xl px-4 py-3 shadow-floating border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black">JM</div>
                    <div>
                      <p className="text-xs font-bold">Jessica M. wants to connect!</p>
                      <p className="text-[10px] text-muted-foreground">0.4 mi · Kids: 3 & 5 yrs</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 bottom-24 bg-card rounded-2xl px-4 py-3 shadow-floating border border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-coral" />
                    <p className="text-xs font-bold">Playdate @ Riverside Park</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Tomorrow at 10am · 3 moms going</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-black mb-3">How MomCircle Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From profile to playdate in four simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-hover transition-all group">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div
                  className="text-xs font-black mb-2 uppercase tracking-widest"
                  style={{ color: step.color }}
                >
                  Step {i + 1}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY ───────────────────────────────────────── */}
      <section id="safety" className="py-20 gradient-hero">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
                <Shield className="h-3.5 w-3.5" />
                Safety First
              </div>
              <h2 className="font-display text-4xl font-black mb-5">
                Your safety is our <span className="text-primary">top priority</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We know trust is everything — especially for moms. MomCircle is built with safety as its foundation, from ID verification to mutual matching requirements.
              </p>
              <ul className="space-y-3">
                {safetyFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border shadow-floating">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-soft">
                  🛡️
                </div>
                <h3 className="font-display font-black text-xl">No Child Photos Policy</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  MomCircle strictly prohibits photos of children on profiles. Protect your little ones while building your village.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-bold">Public spots only</p>
                    <p className="text-xs text-muted-foreground">We suggest verified safe public meeting places</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <Heart className="h-5 w-5 text-coral" />
                  <div>
                    <p className="text-xs font-bold">Mutual match required</p>
                    <p className="text-xs text-muted-foreground">Messaging only opens after both moms connect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-black mb-3">Moms Love MomCircle</h2>
            <p className="text-muted-foreground text-lg">Real stories from real villages</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-hover transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-secondary" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.kids} · {t.neighborhood}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM ──────────────────────────────────────── */}
      <section id="premium" className="py-20 gradient-hero">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-black mb-3">Grow Your Village Faster</h2>
            <p className="text-muted-foreground text-lg">Go Premium to unlock unlimited connections</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
              <div className="mb-6">
                <h3 className="font-display font-black text-2xl mb-1">Free</h3>
                <p className="text-3xl font-black">$0 <span className="text-base font-normal text-muted-foreground">/month</span></p>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /> 5 connections per day</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /> In-app messaging</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Browse & filter moms</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /> Basic profile</li>
              </ul>
              <Link to="/browse" className="mt-8 w-full flex justify-center items-center py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/10 transition">
                Get Started Free
              </Link>
            </div>

            {/* Premium */}
            <div className="gradient-primary rounded-2xl p-8 text-white shadow-floating relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-secondary text-foreground text-xs font-black px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="font-display font-black text-2xl mb-1">Premium</h3>
                <p className="text-3xl font-black">$9 <span className="text-base font-normal opacity-70">/month</span></p>
              </div>
              <ul className="space-y-3 text-sm">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 opacity-90" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition shadow-soft">
                Start 7-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="py-20 gradient-banner text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-5">
            Your village is waiting 🌿
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of moms building real friendships and unforgettable playdates.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold text-lg shadow-floating hover:bg-white/90 transition"
          >
            Find Moms Near Me
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-foreground text-background py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display font-black text-xl">MomCircle</div>
          <p className="text-sm opacity-50">© 2025 MomCircle. Building villages, one playdate at a time. 🛝</p>
          <div className="flex gap-4 text-sm opacity-60">
            <a href="#" className="hover:opacity-100">Privacy</a>
            <a href="#" className="hover:opacity-100">Safety</a>
            <a href="#" className="hover:opacity-100">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
