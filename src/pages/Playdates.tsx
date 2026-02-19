import { useState } from "react";
import { Plus, MapPin, Calendar, Users, ChevronRight, X, Clock } from "lucide-react";
import { MOMS } from "@/data/moms";
import { useNotifications } from "@/hooks/useNotifications";

interface Playdate {
  id: number;
  park: string;
  date: string;
  time: string;
  attendees: { avatar: string; color: string; name: string }[];
  status: "upcoming" | "past";
  description: string;
}

const PARKS = [
  "Riverside Park", "Oakwood Playground", "Sunfield Common",
  "Maplewood Sports Park", "Heritage Trail", "Lotus Park",
  "Nature Discovery Park", "Harbor Splash Pad", "Bayfront Park",
];

const UPCOMING: Playdate[] = [
  {
    id: 1,
    park: "Riverside Park",
    date: "Wed, Feb 19",
    time: "10:00 AM",
    attendees: [
      { avatar: "JM", color: "hsl(142 38% 40%)", name: "Jessica M." },
      { avatar: "ME", color: "hsl(204 80% 62%)", name: "Me" },
    ],
    status: "upcoming",
    description: "Morning park hang — bring snacks and muddy boots! 🌿",
  },
  {
    id: 2,
    park: "Cedarwood Green",
    date: "Sat, Feb 22",
    time: "9:00 AM",
    attendees: [
      { avatar: "PT", color: "hsl(42 90% 60%)", name: "Priya T." },
      { avatar: "AK", color: "hsl(12 82% 65%)", name: "Amara K." },
      { avatar: "ME", color: "hsl(204 80% 62%)", name: "Me" },
    ],
    status: "upcoming",
    description: "Morning walk + coffee group 🧘",
  },
];

const PAST: Playdate[] = [
  {
    id: 3,
    park: "Oakwood Playground",
    date: "Sun, Feb 9",
    time: "11:00 AM",
    attendees: [
      { avatar: "SR", color: "hsl(204 80% 62%)", name: "Sofia R." },
      { avatar: "ME", color: "hsl(142 38% 40%)", name: "Me" },
    ],
    status: "past",
    description: "Soccer + trail mix afternoon ⚽",
  },
];

function AttendeeStack({ attendees }: { attendees: Playdate["attendees"] }) {
  return (
    <div className="flex items-center">
      {attendees.slice(0, 3).map((a, i) => (
        <div
          key={a.avatar + i}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-card"
          style={{ backgroundColor: a.color, marginLeft: i > 0 ? "-8px" : 0, zIndex: attendees.length - i }}
        >
          {a.avatar}
        </div>
      ))}
      {attendees.length > 3 && (
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-card -ml-2">
          +{attendees.length - 3}
        </div>
      )}
      <span className="ml-2 text-xs text-muted-foreground">{attendees.length} going</span>
    </div>
  );
}

function PlaydateCard({ pd }: { pd: Playdate }) {
  return (
    <div className={`bg-card rounded-2xl border border-border shadow-card overflow-hidden ${pd.status === "past" ? "opacity-70" : ""}`}>
      <div className={`px-4 py-3 ${pd.status === "upcoming" ? "gradient-hero" : "bg-muted"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-display font-black text-sm">{pd.park}</span>
          </div>
          {pd.status === "upcoming" && (
            <span className="text-[10px] font-black uppercase tracking-wide bg-primary text-white px-2 py-0.5 rounded-full">
              Upcoming
            </span>
          )}
          {pd.status === "past" && (
            <span className="text-[10px] font-black uppercase tracking-wide bg-muted-foreground/20 text-muted-foreground px-2 py-0.5 rounded-full">
              Past
            </span>
          )}
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{pd.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{pd.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{pd.time}</span>
          </div>
        </div>
        <AttendeeStack attendees={pd.attendees} />
      </div>
    </div>
  );
}

// ── PLAN PLAYDATE SHEET ─────────────────────────────────
function PlanSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: (park: string, time: string) => void }) {
  const [step, setStep] = useState(0);
  const [selectedPark, setSelectedPark] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMoms, setSelectedMoms] = useState<number[]>([]);

  const times = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  const dates = ["Today, Feb 19", "Tomorrow, Feb 20", "Thu, Feb 21", "Fri, Feb 22", "Sat, Feb 23", "Sun, Feb 24"];

  const toggleMom = (id: number) =>
    setSelectedMoms((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);

  const canNext = [
    selectedPark !== "",
    selectedDate !== "" && selectedTime !== "",
    selectedMoms.length > 0,
  ];

  const steps = ["Pick a Park", "Date & Time", "Invite Moms"];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-background rounded-t-3xl pt-2 pb-0 flex flex-col overflow-hidden"
        style={{ height: "min(85dvh, 85vh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 mb-4">
          <div>
            <h2 className="font-display font-black text-lg">Plan a Playdate</h2>
            <p className="text-xs text-muted-foreground">{steps[step]} · Step {step + 1} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl active:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-5 mb-4">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5">
          {/* Step 0: Pick Park */}
          {step === 0 && (
            <div className="space-y-2 pb-4">
              {PARKS.map((park) => (
                <button
                  key={park}
                  onClick={() => setSelectedPark(park)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                    selectedPark === park
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <MapPin className={`h-4 w-4 flex-shrink-0 ${selectedPark === park ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-semibold ${selectedPark === park ? "text-primary" : "text-foreground"}`}>
                    {park}
                  </span>
                  {selectedPark === park && (
                    <div className="ml-auto w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                      <span className="text-white text-[10px] font-black">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="pb-4 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Date</p>
                <div className="grid grid-cols-2 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-3 rounded-2xl border text-sm font-semibold text-left transition-all active:scale-[0.97] ${
                        selectedDate === d ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Time</p>
                <div className="grid grid-cols-4 gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all active:scale-[0.97] ${
                        selectedTime === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Invite Moms */}
          {step === 2 && (
            <div className="space-y-2 pb-4">
              {MOMS.slice(0, 5).map((mom) => {
                const selected = selectedMoms.includes(mom.id);
                return (
                  <button
                    key={mom.id}
                    onClick={() => toggleMom(mom.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                      selected ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ backgroundColor: mom.avatarColor }}
                    >
                      {mom.avatar}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-sm font-bold ${selected ? "text-primary" : ""}`}>{mom.name}</p>
                      <p className="text-xs text-muted-foreground">{mom.neighborhood} · {mom.distance}</p>
                    </div>
                    {selected && (
                      <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-black">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-5 py-4 border-t border-border flex gap-3 safe-area-bottom bg-background">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3.5 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all"
            >
              Back
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext[step]}
              className="flex-1 py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => { onConfirm(selectedPark, selectedTime); onClose(); }}
              disabled={!canNext[2]}
              className="flex-1 py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all"
            >
              Send Invites 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────
export default function Playdates() {
  const [showPlan, setShowPlan] = useState(false);
  const { schedulePlaydateReminder } = useNotifications();

  return (
    <div className="min-h-screen bg-background relative">
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-display font-black text-2xl">Playdates</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{UPCOMING.length} upcoming this week</p>
      </div>

      {/* Upcoming */}
      <section className="px-4 py-2">
        <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" /> Upcoming
        </h2>
        <div className="space-y-3">
          {UPCOMING.map((pd) => <PlaydateCard key={pd.id} pd={pd} />)}
        </div>
      </section>

      {/* Past */}
      <section className="px-4 py-4">
        <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" /> Past Playdates
        </h2>
        <div className="space-y-3">
          {PAST.map((pd) => <PlaydateCard key={pd.id} pd={pd} />)}
        </div>
      </section>

      {/* Floating FAB */}
      <button
        onClick={() => setShowPlan(true)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 px-5 py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm shadow-floating active:scale-[0.96] transition-all"
      >
        <Plus className="h-5 w-5" />
        Plan Playdate
      </button>

      {/* Bottom sheet */}
      {showPlan && (
        <PlanSheet
          onClose={() => setShowPlan(false)}
          onConfirm={(park, time) => {
            // Schedule a reminder notification ~5 seconds from now (demo);
            // in production this would be 1 hour before the actual playdate time
            schedulePlaydateReminder(park, time, 5000);
          }}
        />
      )}
    </div>
  );
}
