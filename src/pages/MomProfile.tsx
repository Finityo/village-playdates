import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, MapPin, Shield, Users, Calendar, Heart,
  MessageCircle, Star, CheckCircle2, Globe, Clock, Sparkles,
} from "lucide-react";
import { MOMS, MY_INTERESTS, INTEREST_ICONS, AVAILABILITY_ICONS } from "@/data/moms";
import profileBanner from "@/assets/profile-banner.jpg";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Map availability labels to day indices
const AVAILABILITY_DAYS: Record<string, number[]> = {
  "Weekday mornings": [0, 1, 2, 3, 4],
  "Weekday afternoons": [0, 1, 2, 3, 4],
  "Saturday mornings": [5],
  "Saturday afternoons": [5],
  "Sunday mornings": [6],
  "Sunday afternoons": [6],
  "Weekend mornings": [5, 6],
  "Weekends": [5, 6],
  "Morning walks": [0, 1, 2, 3, 4],
  "Friday afternoons": [4],
  "Thursday evenings": [3],
  "Wednesday afternoons": [2],
  "After school (3–5pm)": [0, 1, 2, 3, 4],
  "Holiday mornings": [5, 6],
};

export default function MomProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [playdateSent, setPlaydateSent] = useState(false);
  const [activeIcebreaker, setActiveIcebreaker] = useState<string | null>(null);

  const mom = MOMS.find((m) => m.id === Number(id));

  if (!mom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4">🌿</div>
          <h2 className="font-display text-2xl font-black mb-2">Mom not found</h2>
          <Link to="/browse" className="text-primary font-semibold hover:underline">← Back to Browse</Link>
        </div>
      </div>
    );
  }

  const sharedInterests = mom.interests.filter((i) => MY_INTERESTS.includes(i));

  // Build availability day map
  const availableDays = new Set<number>();
  mom.availability.forEach((slot) => {
    (AVAILABILITY_DAYS[slot] ?? []).forEach((d) => availableDays.add(d));
  });

  const handleConnect = () => {
    setConnected(true);
    if (activeIcebreaker === null) setActiveIcebreaker(mom.icebreakers[0]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── BANNER ─────────────────────────────────────── */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <img
          src={profileBanner}
          alt="Park banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-16 left-4 flex items-center gap-1.5 bg-white/80 backdrop-blur text-foreground text-sm font-bold px-3 py-2 rounded-full shadow-soft hover:bg-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Like button */}
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-16 right-4 p-2.5 rounded-full shadow-soft backdrop-blur transition ${
            liked ? "bg-red-50 text-red-500" : "bg-white/80 text-muted-foreground hover:bg-white"
          }`}
        >
          <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── PROFILE HEADER ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
        <div className="flex items-end gap-4 mb-5">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-floating border-4 border-background flex-shrink-0"
            style={{ backgroundColor: mom.avatarColor }}
          >
            {mom.avatar}
          </div>

          {/* Name + meta */}
          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-black">{mom.name}</h1>
              {mom.verified && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">
                  <Shield className="h-3 w-3" fill="currentColor" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{mom.neighborhood} · {mom.distance} away</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Calendar className="h-4 w-4 text-primary" />, value: mom.playdatesHosted, label: "Playdates" },
            { icon: <Users className="h-4 w-4 text-coral" />, value: mom.connectionsCount, label: "Connections" },
            { icon: <Clock className="h-4 w-4 text-sky" />, value: mom.memberSince, label: "Member since" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-4 text-center shadow-card">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="font-display font-black text-lg leading-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── ACTION BUTTONS ──────────────────────────── */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleConnect}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-soft ${
              connected
                ? "bg-primary/10 text-primary border-2 border-primary"
                : "gradient-primary text-white hover:shadow-hover"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            {connected ? "Message Sent ✓" : "Connect & Message"}
          </button>
          <button
            onClick={() => setPlaydateSent(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all ${
              playdateSent
                ? "border-secondary bg-secondary/20 text-foreground"
                : "border-secondary bg-accent text-foreground hover:bg-secondary/30"
            }`}
          >
            <Star className="h-4 w-4 text-secondary" fill={playdateSent ? "currentColor" : "none"} />
            {playdateSent ? "Playdate Invited ✓" : "Invite to Playdate"}
          </button>
        </div>

        {/* ── ICEBREAKERS (show after connect) ───────── */}
        {connected && (
          <div className="mb-8 bg-primary/5 border border-primary/20 rounded-2xl p-5 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm">Send an icebreaker</h3>
            </div>
            <div className="flex flex-col gap-2">
              {mom.icebreakers.map((msg) => (
                <button
                  key={msg}
                  onClick={() => setActiveIcebreaker(msg)}
                  className={`text-left text-sm px-4 py-2.5 rounded-xl border font-semibold transition ${
                    activeIcebreaker === msg
                      ? "bg-primary text-white border-primary"
                      : "bg-card border-border hover:bg-accent"
                  }`}
                >
                  "{msg}"
                </button>
              ))}
            </div>
            {activeIcebreaker && (
              <button className="mt-3 w-full py-2.5 rounded-xl gradient-primary text-white text-sm font-bold hover:shadow-hover transition-all">
                Send Message →
              </button>
            )}
          </div>
        )}

        <div className="space-y-6">
          {/* ── ABOUT ───────────────────────────────────── */}
          <section className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="font-display font-black text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">👋</span> About {mom.name.split(" ")[0]}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{mom.fullBio}</p>

            {/* Kids */}
            <div className="mt-5 pt-5 border-t border-border flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                <Users className="h-3.5 w-3.5" />
                Kids
              </div>
              {mom.kids.map((age) => (
                <span key={age} className="bg-accent text-accent-foreground text-xs font-black px-3 py-1.5 rounded-full">
                  {age}
                </span>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                <Globe className="h-3.5 w-3.5" />
                Languages
              </div>
              {mom.languages.map((lang) => (
                <span key={lang} className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </section>

          {/* ── SHARED INTERESTS ────────────────────────── */}
          {sharedInterests.length > 0 && (
            <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h2 className="font-display font-black text-lg mb-1 flex items-center gap-2">
                <span className="text-xl">✨</span> You both love
              </h2>
              <p className="text-xs text-muted-foreground mb-4">{sharedInterests.length} interests in common</p>
              <div className="flex flex-wrap gap-2">
                {sharedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-2 rounded-full shadow-soft"
                  >
                    <span>{INTEREST_ICONS[interest] ?? "🌟"}</span>
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ── ALL INTERESTS ────────────────────────────── */}
          <section className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="font-display font-black text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">🌟</span> Interests & Activities
            </h2>
            <div className="flex flex-wrap gap-2">
              {mom.interests.map((interest) => {
                const isShared = MY_INTERESTS.includes(interest);
                return (
                  <span
                    key={interest}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border transition ${
                      isShared
                        ? "bg-primary/10 text-primary border-primary/25"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    <span>{INTEREST_ICONS[interest] ?? "🌸"}</span>
                    {interest}
                    {isShared && <CheckCircle2 className="h-3 w-3 ml-0.5" />}
                  </span>
                );
              })}
            </div>
            {sharedInterests.length > 0 && (
              <p className="text-xs text-muted-foreground mt-3">
                <span className="text-primary font-bold">✓ = shared interest</span>
              </p>
            )}
          </section>

          {/* ── AVAILABILITY CALENDAR ───────────────────── */}
          <section className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="font-display font-black text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">📅</span> Availability
            </h2>

            {/* Day chips */}
            <div className="flex gap-2 mb-5">
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-black transition ${
                    availableDays.has(i)
                      ? "bg-primary text-white border-primary shadow-soft"
                      : "bg-muted/40 text-muted-foreground border-border"
                  }`}
                >
                  <span>{day}</span>
                  {availableDays.has(i) && <span className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                </div>
              ))}
            </div>

            {/* Slot list */}
            <div className="space-y-2">
              {mom.availability.map((slot) => (
                <div key={slot} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3">
                  <span className="text-base">{AVAILABILITY_ICONS[slot] ?? "🕐"}</span>
                  <span className="text-sm font-semibold">{slot}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── PREFERRED SPOTS ─────────────────────────── */}
          <section className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="font-display font-black text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">📍</span> Favorite Playdate Spots
            </h2>
            <div className="space-y-2.5">
              {mom.preferredSpots.map((spot) => (
                <div key={spot} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{spot}</span>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-semibold">
                    Public ✓
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── SAFETY NOTE ─────────────────────────────── */}
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-primary mb-0.5">MomCircle Safety Reminder</p>
              <p className="text-xs text-muted-foreground">
                Always meet in public spots for the first few playdates. MomCircle only suggests verified public locations. Stay safe and enjoy building your village! 🌿
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR (mobile) ─────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex gap-3 z-30">
        <button
          onClick={handleConnect}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${
            connected ? "bg-primary/10 text-primary" : "gradient-primary text-white"
          }`}
        >
          {connected ? "Message Sent ✓" : "Connect"}
        </button>
        <button
          onClick={() => setPlaydateSent(true)}
          className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition ${
            playdateSent ? "border-secondary bg-secondary/20" : "border-secondary bg-accent"
          }`}
        >
          {playdateSent ? "Invited ✓" : "Invite to Playdate"}
        </button>
      </div>
    </div>
  );
}
