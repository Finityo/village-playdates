import { useState, useEffect } from "react";
import { Shield, Edit2, MapPin, X, CheckCircle2, Camera, LogOut, Loader2 } from "lucide-react";
import { INTEREST_ICONS } from "@/data/moms";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AvatarPicker from "@/components/AvatarPicker";

import avatarCat from "@/assets/avatars/avatar-cat.png";
import avatarFox from "@/assets/avatars/avatar-fox.png";
import avatarBunny from "@/assets/avatars/avatar-bunny.png";
import avatarOwl from "@/assets/avatars/avatar-owl.png";
import avatarBear from "@/assets/avatars/avatar-bear.png";
import avatarPanda from "@/assets/avatars/avatar-panda.png";

const PRESET_AVATAR_MAP: Record<string, string> = {
  cat: avatarCat, fox: avatarFox, bunny: avatarBunny,
  owl: avatarOwl, bear: avatarBear, panda: avatarPanda,
};

const AVATAR_COLORS = [
  "hsl(142 38% 40%)", "hsl(12 82% 65%)", "hsl(204 80% 62%)",
  "hsl(42 90% 60%)", "hsl(133 45% 50%)", "hsl(204 65% 55%)",
];

const NEIGHBORHOODS = [
  "Gruene", "Creekside", "Hunter's Creek", "Downtown New Braunfels",
  "River Chase", "Landa Park", "Solms Landing", "Meyer Ranch",
  "Copper Ridge", "Mission Hills", "Dry Comal Creek", "Westside NB",
];

const ALL_INTERESTS = [
  { emoji: "🛝", label: "Outdoor play" }, { emoji: "🎨", label: "Arts & Crafts" },
  { emoji: "🌿", label: "Nature walks" }, { emoji: "📖", label: "Books & Storytime" },
  { emoji: "🫧", label: "Sensory play" }, { emoji: "🎵", label: "Music & Dance" },
  { emoji: "⚽", label: "Sports & Active" }, { emoji: "🍳", label: "Cooking together" },
  { emoji: "🥾", label: "Hiking" }, { emoji: "🧘", label: "Yoga & Wellness" },
  { emoji: "🔬", label: "Science & STEM" }, { emoji: "💧", label: "Water play" },
  { emoji: "🧺", label: "Picnics" }, { emoji: "📚", label: "Montessori" },
  { emoji: "🏛️", label: "Museums" }, { emoji: "🌸", label: "Mindfulness" },
];

const KIDS_AGES = ["0–1 yr", "1–2 yrs", "2–3 yrs", "3–5 yrs", "5–7 yrs", "7–10 yrs"];

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Helper to resolve avatar URL (including preset-avatar: prefix)
function resolveAvatarSrc(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("preset-avatar:")) {
    const id = url.replace("preset-avatar:", "");
    return PRESET_AVATAR_MAP[id] ?? null;
  }
  return url;
}

// ── EDIT PROFILE SHEET ────────────────────────────────────
function EditSheet({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [bio, setBio] = useState("");
  const [selectedKids, setSelectedKids] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || !profile) return;
    setName(profile.display_name ?? "");
    setNeighborhood(profile.neighborhood ?? "");
    setBio(profile.bio ?? "");
    setSelectedKids(profile.kids_ages ?? []);
    setSelectedInterests(profile.interests ?? []);
    setInitialized(true);
  }, [profile, initialized]);

  const toggleKid = (age: string) =>
    setSelectedKids((prev) => prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]);
  const toggleInterest = (label: string) =>
    setSelectedInterests((prev) => prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      display_name: name.trim() || null,
      neighborhood: neighborhood || null,
      bio: bio.trim() || null,
      kids_ages: selectedKids,
      interests: selectedInterests,
    });
    setSaving(false);
    if (result?.error) {
      toast({ title: "Couldn't save", description: result.error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved! ✓" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-t-3xl max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-2 flex-shrink-0" />
        <div className="flex items-center justify-between px-5 pb-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-display font-black text-lg">Edit Profile</h2>
            <p className="text-xs text-muted-foreground">Update your info</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl active:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Name */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 block">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name…"
              className="w-full h-12 rounded-2xl bg-card border border-border px-4 text-sm font-semibold outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell other moms about yourself…"
              className="w-full rounded-2xl bg-card border border-border px-4 py-3 text-sm font-semibold outline-none focus:border-primary transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Neighborhood */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 block">Neighborhood</label>
            <div className="space-y-2">
              {NEIGHBORHOODS.map((n) => (
                <button
                  key={n}
                  onClick={() => setNeighborhood(n)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all active:scale-[0.98] ${
                    neighborhood === n ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                  }`}
                >
                  {n}
                  {neighborhood === n && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Kids' ages */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 block">Kids' ages</label>
            <div className="flex flex-wrap gap-2">
              {KIDS_AGES.map((age) => (
                <button
                  key={age}
                  onClick={() => toggleKid(age)}
                  className={`px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all active:scale-[0.96] ${
                    selectedKids.includes(age) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 block">Interests</label>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map(({ emoji, label }) => (
                <button
                  key={label}
                  onClick={() => toggleInterest(label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all active:scale-[0.96] ${
                    selectedInterests.includes(label) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border safe-area-bottom bg-background flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save Changes ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PROFILE PAGE ────────────────────────────────────
export default function Profile() {
  const [showEdit, setShowEdit] = useState(false);
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sync local avatar url from profile
  useEffect(() => {
    if (profile?.avatar_url) setLocalAvatarUrl(profile.avatar_url);
  }, [profile?.avatar_url]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAvatarUploaded = (url: string) => {
    setLocalAvatarUrl(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "Mom";
  const initials = getInitials(displayName);
  const avatarColor = user ? getAvatarColor(user.id) : "hsl(204 80% 62%)";
  const avatarUrl = localAvatarUrl ?? profile?.avatar_url ?? null;
  const neighborhood = profile?.neighborhood;
  const bio = profile?.bio;
  const kidsAges = profile?.kids_ages ?? [];
  const interests = profile?.interests ?? [];
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Banner */}
      <div className="relative h-32 gradient-banner">
        {/* Avatar positioned over banner bottom edge */}
        <div className="absolute -bottom-12 left-5">
          {user ? (
            <AvatarPicker
              userId={user.id}
              currentAvatarUrl={avatarUrl}
              displayName={displayName}
              avatarColor={avatarColor}
              onAvatarChanged={handleAvatarUploaded}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white border-4 border-background shadow-soft"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold active:scale-[0.96] transition-all"
        >
          <Edit2 className="h-3.5 w-3.5" /> Edit Profile
        </button>
      </div>

      {/* Name + neighborhood */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="font-display font-black text-2xl">{displayName}</h1>
          {profile?.verified && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
              <Shield className="h-2.5 w-2.5" fill="currentColor" />
              Verified
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
          {neighborhood && <><MapPin className="h-3.5 w-3.5" /><span>{neighborhood}</span><span className="text-muted-foreground/40">·</span></>}
          <span>Member since {memberSince}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
          <Camera className="h-3 w-3" />
          Tap your photo to update it
        </p>
        {bio ? (
          <p className="text-sm text-foreground/80 leading-relaxed">{bio}</p>
        ) : (
          <button onClick={() => setShowEdit(true)} className="text-sm text-primary font-semibold underline-offset-2 hover:underline">
            + Add a bio
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4 grid grid-cols-3 divide-x divide-border bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {[{ value: 7, label: "Hosted" }, { value: 14, label: "Attended" }, { value: 12, label: "Connections" }].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center py-4">
            <span className="font-display font-black text-2xl text-primary">{value}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Kids' ages */}
      {kidsAges.length > 0 && (
        <section className="px-4 mb-5">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Kids' Ages</h2>
          <div className="flex flex-wrap gap-2">
            {kidsAges.map((age) => (
              <span key={age} className="px-4 py-2 rounded-2xl bg-secondary/30 border border-secondary/50 text-sm font-bold text-foreground">
                🧒 {age}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <section className="px-4 mb-5">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span key={interest} className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                <span>{INTEREST_ICONS[interest] ?? "✨"}</span>
                <span>{interest}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {kidsAges.length === 0 && interests.length === 0 && (
        <div className="mx-4 mb-5 p-5 rounded-2xl bg-card border border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground mb-3">Complete your profile to get matched with the best moms near you!</p>
          <button
            onClick={() => setShowEdit(true)}
            className="px-5 py-2.5 rounded-xl gradient-primary text-white font-bold text-sm active:scale-[0.97] transition-all"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 flex flex-col gap-3">
        <button
          onClick={() => setShowEdit(true)}
          className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-bold text-base active:bg-primary/10 transition-all flex items-center justify-center gap-2"
        >
          <Edit2 className="h-4 w-4" /> Edit Profile
        </button>
        <button
          onClick={handleSignOut}
          className="w-full py-3.5 rounded-2xl border border-border bg-card text-muted-foreground font-bold text-sm active:bg-muted transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
        {user && <p className="text-center text-xs text-muted-foreground pb-2">Signed in as {user.email}</p>}
      </div>

      {showEdit && <EditSheet onClose={() => setShowEdit(false)} />}
    </div>
  );
}
