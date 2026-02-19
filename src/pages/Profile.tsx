import { useState } from "react";
import { Shield, Edit2, MapPin, X, CheckCircle2, Camera } from "lucide-react";
import { MY_INTERESTS, INTEREST_ICONS, AVAILABILITY_ICONS } from "@/data/moms";

// ── MY PROFILE DATA ──────────────────────────────────────
const MY_PROFILE = {
  name: "Sarah M.",
  avatar: "SM",
  avatarColor: "hsl(204 80% 62%)",
  neighborhood: "Riverside Park",
  bio: "Coffee-fueled mama of two who loves park days, creative projects, and building a real community. Let's be each other's village! 🌸",
  kids: ["3 yrs", "5 yrs"],
  interests: MY_INTERESTS,
  availability: ["Weekday mornings", "Saturday afternoons", "Sunday mornings"],
  verified: true,
  memberSince: "Jan 2025",
  playdatesHosted: 7,
  connectionsCount: 12,
  playdatesAttended: 14,
};

const NEIGHBORHOODS = [
  "Riverside Park", "Sunfield District", "Maplewood Heights",
  "Cedarwood Commons", "Green Valley", "Harbor View",
  "Oak Park", "Midtown", "Lakeside",
];

const ALL_INTERESTS = [
  { emoji: "🛝", label: "Outdoor play" },
  { emoji: "🎨", label: "Arts & Crafts" },
  { emoji: "🌿", label: "Nature walks" },
  { emoji: "📖", label: "Books & Storytime" },
  { emoji: "🫧", label: "Sensory play" },
  { emoji: "🎵", label: "Music & Dance" },
  { emoji: "⚽", label: "Sports & Active" },
  { emoji: "🍳", label: "Cooking together" },
  { emoji: "🥾", label: "Hiking" },
  { emoji: "🧘", label: "Yoga & Wellness" },
  { emoji: "🔬", label: "Science & STEM" },
  { emoji: "💧", label: "Water play" },
  { emoji: "🧺", label: "Picnics" },
  { emoji: "📚", label: "Montessori" },
  { emoji: "🏛️", label: "Museums" },
  { emoji: "🌸", label: "Mindfulness" },
];

const KIDS_AGES = ["0–1 yr", "1–2 yrs", "2–3 yrs", "3–5 yrs", "5–7 yrs", "7–10 yrs"];

// ── EDIT PROFILE SHEET ───────────────────────────────────
function EditSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState(MY_PROFILE.name.split(" ")[0]);
  const [neighborhood, setNeighborhood] = useState(MY_PROFILE.neighborhood);
  const [bio, setBio] = useState(MY_PROFILE.bio);
  const [selectedKids, setSelectedKids] = useState<string[]>(MY_PROFILE.kids);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(MY_PROFILE.interests);

  const toggleKid = (age: string) =>
    setSelectedKids((prev) => prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]);
  const toggleInterest = (label: string) =>
    setSelectedInterests((prev) => prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-background rounded-t-3xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-2 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-display font-black text-lg">Edit Profile</h2>
            <p className="text-xs text-muted-foreground">Update your info</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl active:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-soft"
                style={{ backgroundColor: MY_PROFILE.avatarColor }}
              >
                {MY_PROFILE.avatar}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-primary flex items-center justify-center shadow-floating">
                <Camera className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Tap to change photo</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 block">First name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                    neighborhood === n
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground"
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
              {KIDS_AGES.map((age) => {
                const sel = selectedKids.includes(age);
                return (
                  <button
                    key={age}
                    onClick={() => toggleKid(age)}
                    className={`px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all active:scale-[0.96] ${
                      sel ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 block">Interests</label>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map(({ emoji, label }) => {
                const sel = selectedInterests.includes(label);
                return (
                  <button
                    key={label}
                    onClick={() => toggleInterest(label)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all active:scale-[0.96] ${
                      sel ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border safe-area-bottom bg-background flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base active:scale-[0.98] transition-all"
          >
            Save Changes ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PROFILE PAGE ────────────────────────────────────
export default function Profile() {
  const [showEdit, setShowEdit] = useState(false);
  const p = MY_PROFILE;

  const stats = [
    { value: p.playdatesHosted, label: "Hosted" },
    { value: p.playdatesAttended, label: "Attended" },
    { value: p.connectionsCount, label: "Connections" },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Banner + avatar */}
      <div className="relative h-32 gradient-banner">
        <div className="absolute -bottom-12 left-5">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white border-4 border-background shadow-soft"
            style={{ backgroundColor: p.avatarColor }}
          >
            {p.avatar}
          </div>
          {p.verified && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-primary flex items-center justify-center border-2 border-background">
              <Shield className="h-3.5 w-3.5 text-white" fill="white" />
            </div>
          )}
        </div>
        {/* Edit button top-right */}
        <button
          onClick={() => setShowEdit(true)}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold active:scale-[0.96] transition-all"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit Profile
        </button>
      </div>

      {/* Name + neighborhood */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="font-display font-black text-2xl">{p.name}</h1>
          {p.verified && <Shield className="h-4 w-4 text-primary" fill="currentColor" />}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5" />
          <span>{p.neighborhood}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>Member since {p.memberSince}</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{p.bio}</p>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4 grid grid-cols-3 divide-x divide-border bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {stats.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center py-4">
            <span className="font-display font-black text-2xl text-primary">{value}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Kids' ages */}
      <section className="px-4 mb-5">
        <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Kids' Ages
        </h2>
        <div className="flex flex-wrap gap-2">
          {p.kids.map((age) => (
            <span
              key={age}
              className="px-4 py-2 rounded-2xl bg-secondary/30 border border-secondary/50 text-sm font-bold text-foreground"
            >
              🧒 {age}
            </span>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section className="px-4 mb-5">
        <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {p.interests.map((interest) => (
            <span
              key={interest}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary"
            >
              <span>{INTEREST_ICONS[interest] ?? "✨"}</span>
              <span>{interest}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Availability */}
      <section className="px-4 mb-5">
        <h2 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Availability
        </h2>
        <div className="flex flex-wrap gap-2">
          {p.availability.map((slot) => (
            <span
              key={slot}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-accent border border-accent-foreground/10 text-xs font-bold text-foreground"
            >
              <span>{AVAILABILITY_ICONS[slot] ?? "🕐"}</span>
              <span>{slot}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Edit profile button (bottom) */}
      <div className="px-4">
        <button
          onClick={() => setShowEdit(true)}
          className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-bold text-base active:bg-primary/10 transition-all flex items-center justify-center gap-2"
        >
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      {/* Edit sheet */}
      {showEdit && <EditSheet onClose={() => setShowEdit(false)} />}
    </div>
  );
}
