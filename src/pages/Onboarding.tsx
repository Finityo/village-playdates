import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Loader2, MapPin, Navigation, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const NEIGHBORHOODS = [
  "Gruene", "Creekside", "Hunter's Creek", "Downtown New Braunfels",
  "River Chase", "Landa Park", "Solms Landing", "Meyer Ranch",
  "Copper Ridge", "Mission Hills", "Dry Comal Creek", "Westside NB",
];

const KIDS_AGES = ["0–1 yr", "1–2 yrs", "2–3 yrs", "3–5 yrs", "5–7 yrs", "7–10 yrs"];

const INTERESTS = [
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

// Illustrated avatars — colourful emoji-style options
const PRESET_AVATARS = [
  { id: "flower", emoji: "🌸", bg: "hsl(330,70%,92%)" },
  { id: "sun",    emoji: "☀️", bg: "hsl(45,90%,88%)"  },
  { id: "leaf",   emoji: "🌿", bg: "hsl(142,50%,88%)" },
  { id: "wave",   emoji: "🌊", bg: "hsl(204,70%,88%)" },
  { id: "star",   emoji: "⭐", bg: "hsl(50,90%,85%)"  },
  { id: "heart",  emoji: "💚", bg: "hsl(142,45%,85%)" },
  { id: "moon",   emoji: "🌙", bg: "hsl(270,50%,90%)" },
  { id: "cherry", emoji: "🍒", bg: "hsl(0,65%,90%)"   },
];

// ── STEP 1: Name ─────────────────────────────────────────
function StepName({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <div className="text-5xl mb-6">👋</div>
        <h2 className="font-display font-black text-3xl mb-2 leading-tight">What's your name?</h2>
        <p className="text-muted-foreground text-base mb-8">This is how other moms will see you.</p>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your first name…"
          className="w-full h-14 rounded-2xl bg-card border border-border px-5 text-base font-semibold outline-none focus:border-primary transition-colors"
          autoFocus
        />
      </div>
      <div className="flex-shrink-0 px-6 pb-4 pt-2">
        <button
          onClick={onNext}
          disabled={value.trim().length < 2}
          className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// ── STEP 2: Photo ─────────────────────────────────────────
type PhotoStepProps = {
  name: string;
  avatarUrl: string | null;
  presetId: string | null;
  onUpload: (url: string) => void;
  onPreset: (id: string, emoji: string) => void;
  onNext: () => void;
  onBack: () => void;
  userId: string;
};

function StepPhoto({ name, avatarUrl, presetId, onUpload, onPreset, onNext, onBack, userId }: PhotoStepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [tab, setTab] = useState<"upload" | "avatar">("upload");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size guard
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Photo too large", description: "Please pick a photo under 5 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      onUpload(data.publicUrl);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const selected = avatarUrl || presetId;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <div className="text-5xl mb-4">🤳</div>
        <h2 className="font-display font-black text-3xl mb-1 leading-tight">Add your photo</h2>
        <p className="text-muted-foreground text-sm mb-5">
          Help other moms recognise you. <span className="font-semibold text-foreground">No kids in photos</span> — your safety matters.
        </p>

        {/* Preview */}
        <div className="flex justify-center mb-5">
          <div className="relative w-24 h-24">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Your photo" className="w-24 h-24 rounded-full object-cover border-4 border-primary/30 shadow-lg" />
            ) : presetId ? (
              <div
                className="w-24 h-24 rounded-full border-4 border-primary/30 shadow-lg flex items-center justify-center text-4xl"
                style={{ background: PRESET_AVATARS.find(a => a.id === presetId)?.bg }}
              >
                {PRESET_AVATARS.find(a => a.id === presetId)?.emoji}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted border-4 border-border flex items-center justify-center">
                <Smile className="h-10 w-10 text-muted-foreground/40" />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-2xl mb-4">
          <button
            onClick={() => setTab("upload")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${tab === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <Camera className="h-3.5 w-3.5" /> My Photo
          </button>
          <button
            onClick={() => setTab("avatar")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${tab === "avatar" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <Smile className="h-3.5 w-3.5" /> Choose Avatar
          </button>
        </div>

        {tab === "upload" && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed border-border bg-card text-sm font-bold text-muted-foreground hover:border-primary hover:text-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              {uploading ? "Uploading…" : avatarUrl ? "Change photo" : "Choose from camera roll"}
            </button>
            {avatarUrl && (
              <p className="text-center text-xs text-primary font-semibold mt-2">✓ Photo uploaded</p>
            )}
          </div>
        )}

        {tab === "avatar" && (
          <div className="grid grid-cols-4 gap-3">
            {PRESET_AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => onPreset(a.id, a.emoji)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-[0.92] border-2 ${
                  presetId === a.id && !avatarUrl ? "border-primary scale-105 shadow-md" : "border-transparent"
                }`}
                style={{ background: a.bg }}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-6 pb-4 pt-2 flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all">Back</button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm active:scale-[0.98] transition-all"
        >
          {selected ? "Continue" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}

// ── STEP 3: Neighborhood ─────────────────────────────────
function StepNeighborhood({ value, onChange, onNext, onBack }: { value: string; onChange: (v: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <div className="text-5xl mb-6">📍</div>
        <h2 className="font-display font-black text-3xl mb-2 leading-tight">Your neighborhood?</h2>
        <p className="text-muted-foreground text-base mb-6">We'll show you moms nearby.</p>
        <div className="space-y-2">
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border font-semibold text-sm transition-all active:scale-[0.98] ${
                value === n ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
              }`}
            >
              {n}
              {value === n && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-6 pb-4 pt-2 flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all">Back</button>
        <button onClick={onNext} disabled={!value} className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all">Continue</button>
      </div>
    </div>
  );
}

// ── STEP 4: Location ─────────────────────────────────────
type LocationStepProps = {
  onGrant: (lat: number, lng: number) => void;
  onSkip: () => void;
  onBack: () => void;
};
function StepLocation({ onGrant, onSkip, onBack }: LocationStepProps) {
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");
  const [requesting, setRequesting] = useState(false);

  const requestLocation = () => {
    setRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("granted");
        setRequesting(false);
        onGrant(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setStatus("denied");
        setRequesting(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <div className="text-5xl mb-6">🗺️</div>
        <h2 className="font-display font-black text-3xl mb-2 leading-tight">Find parks near you</h2>
        <p className="text-muted-foreground text-base mb-8">
          Allow location so the map opens right where you are — no searching required.
        </p>

        {status === "idle" && (
          <button
            onClick={requestLocation}
            disabled={requesting}
            className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-3"
          >
            {requesting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
            {requesting ? "Requesting…" : "Allow Location"}
          </button>
        )}

        {status === "granted" && (
          <div className="w-full py-4 rounded-2xl bg-primary/10 border border-primary text-primary font-bold text-base flex items-center justify-center gap-2 mb-3">
            <MapPin className="h-5 w-5" />
            Location saved ✓
          </div>
        )}

        {status === "denied" && (
          <div className="bg-muted rounded-2xl px-4 py-3 mb-3 text-sm text-muted-foreground">
            No problem — you can allow this later in your device Settings. The map will still show parks in your area.
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-6 pb-4 pt-2 flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all">Back</button>
        <button
          onClick={onSkip}
          className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all text-muted-foreground"
        >
          {status === "granted" ? "Continue →" : "Skip"}
        </button>
      </div>
    </div>
  );
}

// ── STEP 5: Kids' Ages ───────────────────────────────────
function StepKids({ value, onChange, onNext, onBack }: { value: string[]; onChange: (v: string[]) => void; onNext: () => void; onBack: () => void }) {
  const toggle = (age: string) =>
    onChange(value.includes(age) ? value.filter((a) => a !== age) : [...value, age]);
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <div className="text-5xl mb-6">🧒</div>
        <h2 className="font-display font-black text-3xl mb-2 leading-tight">Kids' ages?</h2>
        <p className="text-muted-foreground text-base mb-6">Select all that apply — we'll match you with moms who have similar-aged kids.</p>
        <div className="flex flex-wrap gap-3">
          {KIDS_AGES.map((age) => (
            <button
              key={age}
              onClick={() => toggle(age)}
              className={`px-5 py-3 rounded-2xl border text-sm font-bold transition-all active:scale-[0.96] ${
                value.includes(age) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-6 pb-4 pt-2 flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all">Back</button>
        <button onClick={onNext} disabled={value.length === 0} className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all">Continue</button>
      </div>
    </div>
  );
}

// ── STEP 6: Interests ────────────────────────────────────
function StepInterests({ value, onChange, onFinish, onBack, saving }: { value: string[]; onChange: (v: string[]) => void; onFinish: () => void; onBack: () => void; saving: boolean }) {
  const toggle = (label: string) =>
    onChange(value.includes(label) ? value.filter((i) => i !== label) : [...value, label]);
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <div className="text-5xl mb-6">✨</div>
        <h2 className="font-display font-black text-3xl mb-2 leading-tight">What are you into?</h2>
        <p className="text-muted-foreground text-base mb-6">Pick at least 3 interests to find your best matches.</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(({ emoji, label }) => (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all active:scale-[0.96] ${
                value.includes(label) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              {value.includes(label) && <CheckCircle2 className="h-3.5 w-3.5 ml-0.5" />}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-6 pb-4 pt-2 flex gap-3">
        <button onClick={onBack} disabled={saving} className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all">Back</button>
        <button
          onClick={onFinish}
          disabled={value.length < 3 || saving}
          className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <>Find My Village 🌸</>}
        </button>
      </div>
    </div>
  );
}

// ── MAIN ONBOARDING ──────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Lifted state
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [presetId, setPresetId] = useState<string | null>(null);
  const [presetEmoji, setPresetEmoji] = useState<string | null>(null);
  const [neighborhood, setNeighborhood] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [kidsAges, setKidsAges] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const TOTAL = 6;
  const stepLabels = ["Name", "Photo", "Area", "Location", "Kids", "Interests"];

  const next = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
  };
  const back = () => {
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  const handlePreset = (id: string, emoji: string) => {
    setPresetId(id);
    setPresetEmoji(emoji);
    setAvatarUrl(null); // clear any uploaded photo if switching to avatar
  };

  const handleUpload = (url: string) => {
    setAvatarUrl(url);
    setPresetId(null); // clear preset if uploading real photo
    setPresetEmoji(null);
  };

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        display_name: name.trim(),
        neighborhood,
        kids_ages: kidsAges,
        interests,
      };

      // Real uploaded photo takes priority; fallback to preset emoji stored as avatar_url sentinel
      if (avatarUrl) {
        updates.avatar_url = avatarUrl;
      } else if (presetEmoji) {
        // Store the preset as a data URI so the rest of the app renders it consistently
        updates.avatar_url = `preset:${presetEmoji}`;
      }

      if (lat !== null && lng !== null) {
        updates.lat = lat;
        updates.lng = lng;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
      setSaving(false);
      setShowComplete(true);
      setTimeout(() => navigate("/dashboard"), 1800);
      return;
    } catch (err: any) {
      toast({ title: "Couldn't save profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 flex-shrink-0">
        <button onClick={back} className="p-2 -ml-1 rounded-xl active:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-400 ease-out"
              style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  i <= step ? "text-primary" : "text-muted-foreground/50"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div key={step} className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-250">
          {step === 0 && <StepName value={name} onChange={setName} onNext={next} />}
          {step === 1 && (
            <StepPhoto
              name={name}
              avatarUrl={avatarUrl}
              presetId={presetId}
              onUpload={handleUpload}
              onPreset={handlePreset}
              onNext={next}
              onBack={back}
              userId={user?.id ?? ""}
            />
          )}
          {step === 2 && <StepNeighborhood value={neighborhood} onChange={setNeighborhood} onNext={next} onBack={back} />}
          {step === 3 && (
            <StepLocation
              onGrant={(la, ln) => { setLat(la); setLng(ln); next(); }}
              onSkip={next}
              onBack={back}
            />
          )}
          {step === 4 && <StepKids value={kidsAges} onChange={setKidsAges} onNext={next} onBack={back} />}
          {step === 5 && <StepInterests value={interests} onChange={setInterests} onFinish={finish} onBack={back} saving={saving} />}
        </div>
      </div>

      {/* Profile completed overlay */}
      {showComplete && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 animate-fade-in">
          <div className="animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mb-5">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="font-display font-black text-2xl animate-fade-in mb-1">Profile Complete!</h2>
          <p className="text-sm text-muted-foreground animate-fade-in">Welcome to your Village 🌸</p>
        </div>
      )}
    </div>
  );
}
