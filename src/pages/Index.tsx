import { Link } from "react-router-dom";
import {
  Shield, Users, Star, ArrowRight, CheckCircle2, Sparkles,
  MapPin, ChevronRight, Calendar, Clock, Heart, Zap, Bell, Loader2,
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { MOMS, INTEREST_ICONS } from "@/data/moms";

// ── STATIC DATA (marketing) ──────────────────────────────
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

// ── UPCOMING PLAYDATES (feed preview) ────────────────────
const UPCOMING_FEED = [
  {
    id: 1, park: "Riverside Park", date: "Wed, Feb 19", time: "10:00 AM", emoji: "🌿",
    attendees: [{ avatar: "JM", color: "hsl(142 38% 40%)" }, { avatar: "ME", color: "hsl(204 80% 62%)" }],
  },
  {
    id: 2, park: "Cedarwood Green", date: "Sat, Feb 22", time: "9:00 AM", emoji: "🧘",
    attendees: [{ avatar: "PT", color: "hsl(42 90% 60%)" }, { avatar: "AK", color: "hsl(12 82% 65%)" }, { avatar: "ME", color: "hsl(204 80% 62%)" }],
  },
];

const NUDGES = [
  { emoji: "💌", text: "Amara replied to your icebreaker!", href: "/messages", cta: "Reply now" },
  { emoji: "🎉", text: "2 new moms joined your neighborhood this week!", href: "/browse", cta: "Say hello" },
  { emoji: "📅", text: "Your playdate at Riverside Park is tomorrow!", href: "/playdates", cta: "View details" },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ── HOME FEED (logged-in) ─────────────────────────────────
function HomeFeed() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();

  const greeting = getGreeting();

  // Derive display name: profile > email local part
  const displayName = profile?.display_name
    ? profile.display_name.split(" ")[0]
    : (user?.email?.split("@")[0].replace(/[._\-+]/g, " ").split(" ")[0] ?? "Mom");
  const firstName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  const myInterests: string[] = profile?.interests ?? [];
  const myNeighborhood = profile?.neighborhood ?? null;

  // Sort MOMS: those with shared interests first
  const sortedMoms = [...MOMS].sort((a, b) => {
    const sharedA = myInterests.length > 0 ? a.interests.filter(i => myInterests.includes(i)).length : 0;
    const sharedB = myInterests.length > 0 ? b.interests.filter(i => myInterests.includes(i)).length : 0;
    return sharedB - sharedA;
  }).slice(0, 6);

  const nudge = NUDGES[0];

  // Derive avatar initials & color from display name
  const avatarInitials = profile?.display_name ? getInitials(profile.display_name) : firstName.slice(0, 2).toUpperCase();
  const avatarColor = "hsl(204 80% 62%)";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">

      {/* ── PERSONALIZED HEADER ───────────────────────── */}
      <div className="gradient-hero px-5 pt-12 pb-6 safe-area-top">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs font-bold text-primary/70 uppercase tracking-widest mb-0.5">{greeting} 👋</p>
            <h1 className="font-display font-black text-2xl leading-tight">Hey, {firstName}!</h1>
            {myNeighborhood ? (
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {myNeighborhood}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">Your village is waiting</p>
            )}
          </div>
          {/* Avatar + notification bell */}
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shadow-soft"
              style={{ backgroundColor: avatarColor }}
            >
              {avatarInitials}
            </div>
            <button className="relative w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center shadow-card">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral flex items-center justify-center text-[9px] font-black text-white">3</span>
            </button>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-2 mt-4">
          {[
            { label: "Connections", value: "8", icon: "👯" },
            { label: "Playdates", value: String(UPCOMING_FEED.length), icon: "📅" },
            { label: "Messages", value: "3", icon: "💬" },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 bg-card/70 rounded-2xl px-3 py-2.5 border border-border/60 text-center shadow-card">
              <div className="text-base mb-0.5">{stat.icon}</div>
              <div className="font-display font-black text-lg leading-none text-foreground">{stat.value}</div>
              <div className="text-[9px] text-muted-foreground font-semibold mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROFILE COMPLETION NUDGE (if incomplete) ──── */}
      {!profile?.display_name && (
        <div className="px-4 pt-4">
          <Link
            to="/onboarding"
            className="flex items-center gap-3 bg-secondary/20 rounded-2xl border border-secondary/40 p-4 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg flex-shrink-0">✨</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">Complete your profile</p>
              <p className="text-xs text-muted-foreground">Add your name, neighborhood & interests</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </Link>
        </div>
      )}

      {/* ── QUICK-CONNECT NUDGE ───────────────────────── */}
      <div className={`px-4 ${!profile?.display_name ? "pt-3" : "-mt-1 pt-4"}`}>
        <Link
          to={nudge.href}
          className="flex items-center gap-3 bg-card rounded-2xl border border-primary/20 p-4 shadow-soft active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 text-lg shadow-soft">
            {nudge.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-tight text-foreground">{nudge.text}</p>
          </div>
          <div className="flex items-center gap-1 text-primary font-bold text-xs flex-shrink-0">
            {nudge.cta}
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      {/* ── NEARBY MOMS CAROUSEL ──────────────────────── */}
      <section className="pt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <div>
            <h2 className="font-display font-black text-lg">Moms Near You</h2>
            <p className="text-xs text-muted-foreground">
              {myInterests.length > 0 ? "Sorted by shared interests" : "Browse & connect"}
            </p>
          </div>
          <Link to="/browse" className="text-primary text-sm font-bold flex items-center gap-0.5">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 px-4 hide-scrollbar">
          {sortedMoms.map((mom) => {
            const sharedInterests = myInterests.length > 0
              ? mom.interests.filter(i => myInterests.includes(i))
              : [];
            return (
              <Link
                key={mom.id}
                to={`/mom/${mom.id}`}
                className="flex-shrink-0 w-40 bg-card rounded-2xl border border-border shadow-card overflow-hidden active:scale-[0.97] transition-all"
              >
                <div className="h-20 flex items-center justify-center relative" style={{ backgroundColor: mom.avatarColor + "22" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-soft" style={{ backgroundColor: mom.avatarColor }}>
                    {mom.avatar}
                  </div>
                  {mom.verified && (
                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-soft">
                      <Shield className="h-2.5 w-2.5 text-white" fill="white" />
                    </div>
                  )}
                  {sharedInterests.length > 0 && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-primary/90 flex items-center gap-0.5">
                      <Heart className="h-2 w-2 text-white" fill="white" />
                      <span className="text-[9px] font-black text-white">{sharedInterests.length}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-display font-black text-xs leading-tight mb-0.5">{mom.name}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mb-1.5">
                    <MapPin className="h-2.5 w-2.5" />{mom.distance}
                  </p>
                  {sharedInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {sharedInterests.slice(0, 2).map(interest => (
                        <span key={interest} className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          {INTEREST_ICONS[interest]} {interest.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  )}
                  {sharedInterests.length === 0 && (
                    <p className="text-[10px] text-muted-foreground">{mom.kids.join(", ")}</p>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Browse more end card */}
          <Link
            to="/browse"
            className="flex-shrink-0 w-40 bg-card rounded-2xl border border-dashed border-primary/40 shadow-card flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-all p-4"
          >
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
              <Users className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-bold text-primary text-center leading-tight">Browse all moms</p>
          </Link>
        </div>
      </section>

      {/* ── UPCOMING PLAYDATES PREVIEW ────────────────── */}
      <section className="px-4 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display font-black text-lg">Your Playdates</h2>
            <p className="text-xs text-muted-foreground">{UPCOMING_FEED.length} upcoming this week</p>
          </div>
          <Link to="/playdates" className="text-primary text-sm font-bold flex items-center gap-0.5">
            All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {UPCOMING_FEED.map((pd) => (
            <Link
              key={pd.id}
              to="/playdates"
              className="flex items-center gap-4 bg-card rounded-2xl border border-border p-4 shadow-card active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex flex-col items-center justify-center flex-shrink-0 shadow-soft">
                <span className="text-[9px] font-black text-white/80 uppercase tracking-wider leading-none">
                  {pd.date.split(",")[0]}
                </span>
                <span className="text-lg font-black text-white leading-none">
                  {pd.date.split(" ")[2]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                  <p className="font-display font-black text-sm truncate">{pd.park}</p>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {pd.time} {pd.emoji}
                </p>
                <div className="flex items-center mt-2">
                  {pd.attendees.map((a, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-card flex items-center justify-center text-[8px] font-black text-white"
                      style={{ backgroundColor: a.color, marginLeft: i > 0 ? "-4px" : 0, zIndex: pd.attendees.length - i }}
                    >
                      {a.avatar[0]}
                    </div>
                  ))}
                  <span className="ml-2 text-[10px] text-muted-foreground font-semibold">{pd.attendees.length} going</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </Link>
          ))}

          <Link
            to="/playdates"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-bold text-sm active:bg-primary/5 transition-all"
          >
            <Calendar className="h-4 w-4" />
            Plan a new playdate
          </Link>
        </div>
      </section>

      {/* ── STAY CONNECTED ────────────────────────────── */}
      <section className="px-4 pt-6">
        <h2 className="font-display font-black text-lg mb-3">Stay Connected</h2>
        <div className="space-y-3">
          {NUDGES.slice(1).map((n, i) => (
            <Link
              key={i}
              to={n.href}
              className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 shadow-card active:scale-[0.98] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center text-lg flex-shrink-0">{n.emoji}</div>
              <p className="flex-1 text-sm font-semibold text-foreground">{n.text}</p>
              <div className="flex items-center gap-1 text-primary font-bold text-xs flex-shrink-0">
                {n.cta} <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROFILE TIP BANNER ────────────────────────── */}
      <section className="mx-4 mt-6 mb-2 rounded-3xl bg-card border border-border shadow-card overflow-hidden">
        <div className="gradient-hero px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">Profile tip</span>
          </div>
          <p className="font-display font-black text-base mb-1">Add your availability schedule</p>
          <p className="text-xs text-muted-foreground mb-3">Moms are 3× more likely to connect when schedules are visible.</p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-primary text-white font-bold text-xs shadow-soft active:scale-[0.97] transition-all"
          >
            Update Profile <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ── MARKETING PAGE (logged-out) ──────────────────────────
function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="relative h-72 md:h-96">
          <img src={heroImage} alt="Moms at the park" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
        </div>
        <div className="px-5 pt-4 pb-8 gradient-hero">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 border border-primary/20">
            <Sparkles className="h-3 w-3" />
            Mom friends are just a click away
          </div>
          <h1 className="font-display text-4xl font-black leading-tight mb-3">
            Make mom friends.<br /><span className="text-primary">Build your village.</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Connect with moms in your neighborhood based on your kids' ages, shared interests, and schedule.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/signup" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base shadow-soft active:scale-[0.98] transition-all">
              Get Started — It's Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-primary text-primary font-bold text-base active:scale-[0.98] transition-all">
              Sign In
            </Link>
          </div>
          <div className="flex items-center justify-around mt-6 pt-5 border-t border-border">
            <div className="flex flex-col items-center gap-1"><Shield className="h-5 w-5 text-primary" /><span className="text-xs font-bold">ID-verified</span></div>
            <div className="flex flex-col items-center gap-1"><Users className="h-5 w-5 text-coral" /><span className="text-xs font-bold">12,000+ moms</span></div>
            <div className="flex flex-col items-center gap-1"><Star className="h-5 w-5 text-secondary" fill="currentColor" /><span className="text-xs font-bold">4.9 rating</span></div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6">
        <h2 className="font-display font-black text-lg mb-4">How It Works</h2>
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

      <section className="mx-4 my-4 rounded-3xl gradient-hero border border-border p-6">
        <div className="flex items-center gap-2 mb-3"><Shield className="h-5 w-5 text-primary" /><h2 className="font-display font-black text-lg">Safety First</h2></div>
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

      <section className="px-4 py-4">
        <h2 className="font-display font-black text-lg mb-4">Moms Love MomCircle</h2>
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

      <section className="mx-4 my-4 rounded-3xl gradient-banner text-white p-6">
        <div className="mb-1 text-sm font-bold opacity-80">MomCircle Premium</div>
        <h2 className="font-display font-black text-2xl mb-2">Grow your village faster</h2>
        <p className="text-sm opacity-80 mb-5">Unlimited connections, advanced filters, verified badge & more.</p>
        <div className="flex items-center justify-between">
          <div><span className="text-2xl font-black">$9</span><span className="text-sm opacity-70">/month</span></div>
          <button className="px-5 py-2.5 rounded-xl bg-white text-primary font-bold text-sm active:scale-[0.97] transition-all">Try Free 7 Days</button>
        </div>
      </section>

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

// ── ROOT ──────────────────────────────────────────────────
export default function Index() {
  const { user } = useAuth();
  return user ? <HomeFeed /> : <MarketingPage />;
}
