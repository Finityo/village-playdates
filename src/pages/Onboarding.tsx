import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const NEIGHBORHOODS = [
  "Riverside Park", "Sunfield District", "Maplewood Heights",
  "Cedarwood Commons", "Green Valley", "Harbor View",
  "Oak Park", "Midtown", "Lakeside",
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

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

// ── STEP 1: Name ─────────────────────────────────────────
function StepName({ onNext }: { onNext: () => void }) {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col flex-1 px-6 pt-4">
      <div className="text-5xl mb-6">👋</div>
      <h2 className="font-display font-black text-3xl mb-2 leading-tight">
        What's your name?
      </h2>
      <p className="text-muted-foreground text-base mb-8">
        This is how other moms will see you.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your first name…"
        className="w-full h-14 rounded-2xl bg-card border border-border px-5 text-base font-semibold outline-none focus:border-primary transition-colors"
        autoFocus
      />
      <div className="mt-auto pb-4">
        <button
          onClick={onNext}
          disabled={name.trim().length < 2}
          className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-base disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// ── STEP 2: Neighborhood ─────────────────────────────────
function StepNeighborhood({ onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState("");
  return (
    <div className="flex flex-col flex-1 px-6 pt-4">
      <div className="text-5xl mb-6">📍</div>
      <h2 className="font-display font-black text-3xl mb-2 leading-tight">
        Your neighborhood?
      </h2>
      <p className="text-muted-foreground text-base mb-6">
        We'll show you moms nearby.
      </p>
      <div className="flex-1 overflow-y-auto space-y-2 pb-4">
        {NEIGHBORHOODS.map((n) => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border font-semibold text-sm transition-all active:scale-[0.98] ${
              selected === n
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground"
            }`}
          >
            {n}
            {selected === n && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </button>
        ))}
      </div>
      <div className="flex gap-3 py-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── STEP 3: Kids' Ages ───────────────────────────────────
function StepKids({ onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (age: string) =>
    setSelected((prev) => prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]);
  return (
    <div className="flex flex-col flex-1 px-6 pt-4">
      <div className="text-5xl mb-6">🧒</div>
      <h2 className="font-display font-black text-3xl mb-2 leading-tight">
        Kids' ages?
      </h2>
      <p className="text-muted-foreground text-base mb-6">
        Select all that apply — we'll match you with moms who have similar-aged kids.
      </p>
      <div className="flex flex-wrap gap-3 mb-4">
        {KIDS_AGES.map((age) => {
          const sel = selected.includes(age);
          return (
            <button
              key={age}
              onClick={() => toggle(age)}
              className={`px-5 py-3 rounded-2xl border text-sm font-bold transition-all active:scale-[0.96] ${
                sel ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
              }`}
            >
              {age}
            </button>
          );
        })}
      </div>
      <div className="mt-auto flex gap-3 py-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── STEP 4: Interests ────────────────────────────────────
function StepInterests({ onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (label: string) =>
    setSelected((prev) => prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]);
  return (
    <div className="flex flex-col flex-1 px-6 pt-4">
      <div className="text-5xl mb-6">✨</div>
      <h2 className="font-display font-black text-3xl mb-2 leading-tight">
        What are you into?
      </h2>
      <p className="text-muted-foreground text-base mb-6">
        Pick at least 3 interests to find your best matches.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {INTERESTS.map(({ emoji, label }) => {
          const sel = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all active:scale-[0.96] ${
                sel ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
              }`}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              {sel && <CheckCircle2 className="h-3.5 w-3.5 ml-0.5" />}
            </button>
          );
        })}
      </div>
      <div className="mt-auto flex gap-3 py-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length < 3}
          className="flex-1 py-4 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          Find My Village 🌸
        </button>
      </div>
    </div>
  );
}

// ── MAIN ONBOARDING ──────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const TOTAL = 4;

  const next = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else navigate("/browse");
  };
  const back = () => {
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  const stepLabels = ["Your name", "Neighborhood", "Kids' ages", "Interests"];

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 flex-shrink-0">
        <button
          onClick={back}
          className="p-2 -ml-1 rounded-xl active:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          {/* Progress bar */}
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

      {/* Step content with slide transition */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          key={step}
          className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-250"
        >
          {step === 0 && <StepName onNext={next} />}
          {step === 1 && <StepNeighborhood onNext={next} onBack={back} />}
          {step === 2 && <StepKids onNext={next} onBack={back} />}
          {step === 3 && <StepInterests onNext={next} onBack={back} />}
        </div>
      </div>
    </div>
  );
}
