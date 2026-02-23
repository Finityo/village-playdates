import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft, MapPin, Shield, Users, Calendar, Heart,
  MessageCircle, Star, CheckCircle2, Globe, Clock, Sparkles, Loader2,
} from "lucide-react";
import { MOMS, MY_INTERESTS, INTEREST_ICONS, AVAILABILITY_ICONS } from "@/data/moms";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { UserAvatar } from "@/components/UserAvatar";
import profileBanner from "@/assets/profile-banner.jpg";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  "Weekday Mornings": [0, 1, 2, 3, 4],
  "Weekday Afternoons": [0, 1, 2, 3, 4],
  "Weekend Mornings": [5, 6],
  "Weekend Afternoons": [5, 6],
  "Weekend Evenings": [5, 6],
  "Weekday Evenings": [0, 1, 2, 3, 4],
};

interface RealProfileData {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
  kids_ages: string[] | null;
  interests: string[] | null;
  availability: string[] | null;
  bio: string | null;
  verified: boolean;
  created_at: string;
}

export default function MomProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile: myProfile } = useProfile();
  const [liked, setLiked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [playdateSent, setPlaydateSent] = useState(false);
  const [activeIcebreaker, setActiveIcebreaker] = useState<string | null>(null);

  // Determine if this is a mock ID (number) or real UUID
  const isRealProfile = id && id.includes("-");

  // Real profile state
  const [realProfile, setRealProfile] = useState<RealProfileData | null>(null);
  const [loadingReal, setLoadingReal] = useState(false);

  useEffect(() => {
    if (!isRealProfile || !id) return;
    setLoadingReal(true);
    supabase
      .from("profiles")
      .select("id, display_name, avatar_url, neighborhood, kids_ages, interests, availability, bio, verified, created_at")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setRealProfile(data as RealProfileData | null);
        setLoadingReal(false);
      });
  }, [id, isRealProfile]);

  // Check if already connected (conversation exists)
  useEffect(() => {
    if (!isRealProfile || !id || !user) return;
    supabase
      .from("conversations")
      .select("id")
      .or(`and(participant_a.eq.${user.id},participant_b.eq.${id}),and(participant_a.eq.${id},participant_b.eq.${user.id})`)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setConnected(true);
      });
  }, [id, isRealProfile, user]);

  // Handle mock profile
  const mom = !isRealProfile ? MOMS.find((m) => m.id === Number(id)) : null;

  if (!isRealProfile && !mom) {
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

  if (isRealProfile && loadingReal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isRealProfile && !realProfile) {
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

  // Normalize data for rendering
  const name = isRealProfile ? (realProfile!.display_name ?? "Community Mom") : mom!.name;
  const neighborhood = isRealProfile ? (realProfile!.neighborhood ?? "") : mom!.neighborhood;
  const bio = isRealProfile ? (realProfile!.bio ?? "") : mom!.fullBio;
  const shortBio = isRealProfile ? (realProfile!.bio ?? "") : mom!.bio;
  const interests = isRealProfile ? (realProfile!.interests ?? []) : mom!.interests;
  const kidsAges = isRealProfile ? (realProfile!.kids_ages ?? []) : mom!.kids;
  const availability = isRealProfile ? (realProfile!.availability ?? []) : mom!.availability;
  const verified = isRealProfile ? realProfile!.verified : mom!.verified;
  const memberSince = isRealProfile
    ? new Date(realProfile!.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : mom!.memberSince;
  const avatarUrl = isRealProfile ? realProfile!.avatar_url : null;
  const profileId = isRealProfile ? realProfile!.id : "";

  const myInterests = myProfile?.interests ?? MY_INTERESTS;
  const sharedInterests = interests.filter((i) => myInterests.includes(i));

  // Build availability day map
  const availableDays = new Set<number>();
  availability.forEach((slot) => {
    (AVAILABILITY_DAYS[slot] ?? []).forEach((d) => availableDays.add(d));
  });

  const handleConnect = async () => {
    if (isRealProfile && user && profileId) {
      // Create a real conversation
      const [pa, pb] = user.id < profileId ? [user.id, profileId] : [profileId, user.id];
      await supabase.from("conversations").upsert(
        { participant_a: pa, participant_b: pb },
        { onConflict: "participant_a,participant_b", ignoreDuplicates: true }
      );
      setConnected(true);
      navigate("/messages");
    } else {
      setConnected(true);
      if (activeIcebreaker === null && mom) setActiveIcebreaker(mom.icebreakers[0]);
      navigate("/messages");
    }
  };

  const ICEBREAKERS = isRealProfile
    ? [
        `Hi ${name.split(" ")[0]}! I'd love to connect 👋`,
        "Our kids seem like a great match for a playdate!",
        "What's your favorite park nearby? 🌳",
      ]
    : mom!.icebreakers;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ── BANNER ─────────────────────────────────────── */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <img src={profileBanner} alt="Park banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-16 left-4 flex items-center gap-1.5 bg-white/80 backdrop-blur text-foreground text-sm font-bold px-3 py-2 rounded-full shadow-soft hover:bg-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-16 right-4 p-2.5 rounded-full shadow-soft backdrop-blur transition ${liked ? "bg-red-50 text-red-500" : "bg-white/80 text-muted-foreground hover:bg-white"}`}
        >
          <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── PROFILE HEADER ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
        <div className="flex items-end gap-4 mb-5">
          {isRealProfile ? (
            <UserAvatar avatarUrl={avatarUrl} displayName={name} userId={profileId} size="lg" className="border-4 border-background shadow-floating" />
          ) : (
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-floating border-4 border-background flex-shrink-0"
              style={{ backgroundColor: mom!.avatarColor }}
            >
              {mom!.avatar}
            </div>
          )}
          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-black">{name}</h1>
              {verified && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">
                  <Shield className="h-3 w-3" fill="currentColor" /> Verified
                </span>
              )}
            </div>
            {neighborhood && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{neighborhood}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: <Users className="h-4 w-4 text-coral" />, value: kidsAges.length, label: "Kids" },
            { icon: <Clock className="h-4 w-4 text-sky" />, value: memberSince, label: "Member since" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-4 text-center shadow-card">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="font-display font-black text-lg leading-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── ACTION BUTTONS ──────────────────────────── */}
        {isRealProfile && user && profileId !== user.id && (
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleConnect}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-soft ${connected ? "bg-primary/10 text-primary border-2 border-primary" : "gradient-primary text-white hover:shadow-hover"}`}
            >
              <MessageCircle className="h-4 w-4" />
              {connected ? "Connected ✓" : "Connect & Message"}
            </button>
            <button
              onClick={() => { setPlaydateSent(true); navigate("/playdates"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all ${playdateSent ? "border-secondary bg-secondary/20 text-foreground" : "border-secondary bg-accent text-foreground hover:bg-secondary/30"}`}
            >
              <Star className="h-4 w-4 text-secondary" fill={playdateSent ? "currentColor" : "none"} />
              {playdateSent ? "Playdate Invited ✓" : "Invite to Playdate"}
            </button>
          </div>
        )}

        {!isRealProfile && (
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleConnect}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-soft ${connected ? "bg-primary/10 text-primary border-2 border-primary" : "gradient-primary text-white hover:shadow-hover"}`}
            >
              <MessageCircle className="h-4 w-4" />
              {connected ? "Message Sent ✓" : "Connect & Message"}
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* ── ABOUT ───────────────────────────────────── */}
          <section className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="font-display font-black text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">👋</span> About {name.split(" ")[0]}
            </h2>
            {bio && <p className="text-sm leading-relaxed text-muted-foreground">{bio}</p>}

            {kidsAges.length > 0 && (
              <div className="mt-5 pt-5 border-t border-border flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  <Users className="h-3.5 w-3.5" /> Kids
                </div>
                {kidsAges.map((age) => (
                  <span key={age} className="bg-accent text-accent-foreground text-xs font-black px-3 py-1.5 rounded-full">{age}</span>
                ))}
              </div>
            )}
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
                  <span key={interest} className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-2 rounded-full shadow-soft">
                    <span>{INTEREST_ICONS[interest] ?? "🌟"}</span> {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ── ALL INTERESTS ────────────────────────────── */}
          {interests.length > 0 && (
            <section className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="font-display font-black text-lg mb-4 flex items-center gap-2">
                <span className="text-xl">🌟</span> Interests & Activities
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const isShared = myInterests.includes(interest);
                  return (
                    <span
                      key={interest}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border transition ${isShared ? "bg-primary/10 text-primary border-primary/25" : "bg-muted text-muted-foreground border-border"}`}
                    >
                      <span>{INTEREST_ICONS[interest] ?? "🌸"}</span> {interest}
                      {isShared && <CheckCircle2 className="h-3 w-3 ml-0.5" />}
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── AVAILABILITY ───────────────────────────── */}
          {availability.length > 0 && (
            <section className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="font-display font-black text-lg mb-4 flex items-center gap-2">
                <span className="text-xl">📅</span> Availability
              </h2>
              <div className="flex gap-2 mb-5">
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-black transition ${availableDays.has(i) ? "bg-primary text-white border-primary shadow-soft" : "bg-muted/40 text-muted-foreground border-border"}`}
                  >
                    <span>{day}</span>
                    {availableDays.has(i) && <span className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {availability.map((slot) => (
                  <div key={slot} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3">
                    <span className="text-base">{AVAILABILITY_ICONS[slot] ?? "🕐"}</span>
                    <span className="text-sm font-semibold">{slot}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── SAFETY NOTE ─────────────────────────────── */}
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-primary mb-0.5">MomCircle Safety Reminder</p>
              <p className="text-xs text-muted-foreground">
                Always meet in public spots for the first few playdates. Stay safe and enjoy building your village! 🌿
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR ──────────────────────────── */}
      {isRealProfile && user && profileId !== user.id && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border px-4 pt-3 pb-4 flex gap-3 z-30 safe-area-bottom">
          <button
            onClick={handleConnect}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${connected ? "bg-primary/10 text-primary" : "gradient-primary text-white"}`}
          >
            {connected ? "Connected ✓" : "Connect"}
          </button>
          <button
            onClick={() => { setPlaydateSent(true); navigate("/playdates"); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition ${playdateSent ? "border-secondary bg-secondary/20" : "border-secondary bg-accent"}`}
          >
            {playdateSent ? "Invited ✓" : "Invite to Playdate"}
          </button>
        </div>
      )}
    </div>
  );
}
