import { useState, useEffect, useCallback } from "react";
import { Plus, MapPin, Calendar, Users, Clock, X, Loader2, CheckCircle2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";

// ── TYPES ────────────────────────────────────────────────
interface Playdate {
  id: string;
  creator_id: string;
  park: string;
  date: string;
  time: string;
  description: string;
  created_at: string;
  rsvps: { user_id: string }[];
}

const PARKS = [
  "Riverside Park", "Oakwood Playground", "Sunfield Common",
  "Maplewood Sports Park", "Heritage Trail", "Lotus Park",
  "Nature Discovery Park", "Harbor Splash Pad", "Bayfront Park",
  "Cedarwood Green",
];

const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

function getUpcomingDates(): { label: string; value: string }[] {
  const dates: { label: string; value: string }[] = [];
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = i === 0
      ? `Today, ${monthNames[d.getMonth()]} ${d.getDate()}`
      : i === 1
      ? `Tomorrow, ${monthNames[d.getMonth()]} ${d.getDate()}`
      : `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;
    const value = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    dates.push({ label, value });
  }
  return dates;
}

// ── ATTENDEE STACK ───────────────────────────────────────
function AttendeeStack({ count, creatorInitials }: { count: number; creatorInitials: string }) {
  const colors = ["hsl(142 38% 40%)", "hsl(204 80% 62%)", "hsl(42 90% 60%)", "hsl(12 82% 65%)"];
  const shown = Math.min(count, 3);
  return (
    <div className="flex items-center">
      {Array.from({ length: shown }).map((_, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-card"
          style={{ backgroundColor: colors[i % colors.length], marginLeft: i > 0 ? "-8px" : 0, zIndex: shown - i }}
        >
          {i === 0 ? creatorInitials : "?"}
        </div>
      ))}
      {count > 3 && (
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-card -ml-2">
          +{count - 3}
        </div>
      )}
      <span className="ml-2 text-xs text-muted-foreground">{count} going</span>
    </div>
  );
}

// ── PLAYDATE CARD ─────────────────────────────────────────
function PlaydateCard({
  pd,
  userId,
  onRsvp,
}: {
  pd: Playdate;
  userId: string | undefined;
  onRsvp: (pd: Playdate) => void;
}) {
  const isGoing = userId ? pd.rsvps.some((r) => r.user_id === userId) : false;
  const isOwn = userId === pd.creator_id;
  const isUpcoming = true; // all loaded playdates are upcoming

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="px-4 py-3 gradient-hero">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-display font-black text-sm">{pd.park}</span>
          </div>
          {isGoing && (
            <span className="text-[10px] font-black uppercase tracking-wide bg-primary text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-2.5 w-2.5" /> Going
            </span>
          )}
          {!isGoing && isUpcoming && (
            <span className="text-[10px] font-black uppercase tracking-wide bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Upcoming
            </span>
          )}
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{pd.description || "No description added."}</p>
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
        <AttendeeStack count={pd.rsvps.length} creatorInitials="?" />
        {!isOwn && (
          <button
            onClick={() => onRsvp(pd)}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${
              isGoing
                ? "border border-border bg-muted text-muted-foreground"
                : "gradient-primary text-white"
            }`}
          >
            {isGoing ? "Cancel RSVP" : "Join Playdate 🎉"}
          </button>
        )}
        {isOwn && (
          <div className="text-center text-xs text-muted-foreground font-semibold py-1">
            You're hosting this playdate 🌟
          </div>
        )}
      </div>
    </div>
  );
}

// ── PLAN SHEET ────────────────────────────────────────────
function PlanSheet({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (park: string, date: string, time: string, description: string) => Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [selectedPark, setSelectedPark] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const dates = getUpcomingDates();

  const canNext = [
    selectedPark !== "",
    selectedDate !== "" && selectedTime !== "",
    true, // description optional
  ];

  const steps = ["Pick a Park", "Date & Time", "Description"];

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm(selectedPark, selectedDate, selectedTime, description);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-background rounded-t-3xl pt-2 pb-0 flex flex-col overflow-hidden"
        style={{ height: "min(85dvh, 85vh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

        <div className="flex items-center justify-between px-5 mb-4">
          <div>
            <h2 className="font-display font-black text-lg">Plan a Playdate</h2>
            <p className="text-xs text-muted-foreground">{steps[step]} · Step {step + 1} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl active:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 mb-4">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-5">
          {/* Step 0: Park */}
          {step === 0 && (
            <div className="space-y-2 pb-4">
              {PARKS.map((park) => (
                <button
                  key={park}
                  onClick={() => setSelectedPark(park)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                    selectedPark === park ? "border-primary bg-primary/10" : "border-border bg-card"
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
                      key={d.value}
                      onClick={() => setSelectedDate(d.label)}
                      className={`p-3 rounded-2xl border text-sm font-semibold text-left transition-all active:scale-[0.97] ${
                        selectedDate === d.label ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Time</p>
                <div className="grid grid-cols-4 gap-2">
                  {TIMES.map((t) => (
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

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="pb-4 space-y-4">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Add a description (optional)</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Morning park hang — bring snacks and muddy boots! 🌿"
                rows={4}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-muted-foreground"
              />
              <div className="bg-primary/8 rounded-2xl border border-primary/20 p-4 space-y-1">
                <p className="text-xs font-black text-primary">📍 {selectedPark}</p>
                <p className="text-xs text-muted-foreground">{selectedDate} at {selectedTime}</p>
              </div>
            </div>
          )}
        </div>

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
              onClick={handleConfirm}
              disabled={saving}
              className="flex-1 py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Plan Playdate 🎉"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Playdates() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { schedulePlaydateReminder } = useNotifications();
  const [playdates, setPlaydates] = useState<Playdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlan, setShowPlan] = useState(false);

  const fetchPlaydates = useCallback(async () => {
    const { data, error } = await supabase
      .from("playdates")
      .select("*, rsvps:playdate_rsvps(user_id)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPlaydates(data as Playdate[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlaydates();
  }, [fetchPlaydates]);

  // Realtime: listen for new playdates and rsvp changes
  useEffect(() => {
    const channel = supabase
      .channel("playdates-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "playdates" }, fetchPlaydates)
      .on("postgres_changes", { event: "*", schema: "public", table: "playdate_rsvps" }, fetchPlaydates)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPlaydates]);

  const handleCreate = async (park: string, date: string, time: string, description: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("playdates")
      .insert({ creator_id: user.id, park, date, time, description })
      .select()
      .single();

    if (!error && data) {
      // Auto-RSVP creator
      await supabase.from("playdate_rsvps").insert({ playdate_id: data.id, user_id: user.id });
      schedulePlaydateReminder(park, time, 5000);
    }
  };

  const handleRsvp = async (pd: Playdate) => {
    if (!user) return;
    const isGoing = pd.rsvps.some((r) => r.user_id === user.id);
    if (isGoing) {
      await supabase
        .from("playdate_rsvps")
        .delete()
        .eq("playdate_id", pd.id)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("playdate_rsvps")
        .insert({ playdate_id: pd.id, user_id: user.id });
    }
    // Realtime will refresh — but also do a manual refresh for instant feel
    fetchPlaydates();
  };

  const myPlaydates = playdates.filter(
    (pd) => user && pd.rsvps.some((r) => r.user_id === user.id)
  );
  const otherPlaydates = playdates.filter(
    (pd) => !user || !pd.rsvps.some((r) => r.user_id === user.id)
  );

  return (
    <div className="min-h-screen bg-background relative pb-28">
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-display font-black text-2xl">Playdates</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {myPlaydates.length} you're attending · {otherPlaydates.length} open to join
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* My Playdates */}
          {myPlaydates.length > 0 && (
            <section className="px-4 py-2">
              <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> My Playdates
              </h2>
              <div className="space-y-3">
                {myPlaydates.map((pd) => (
                  <PlaydateCard key={pd.id} pd={pd} userId={user?.id} onRsvp={handleRsvp} />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming (join) */}
          <section className="px-4 py-2">
            <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {otherPlaydates.length > 0 ? "Join a Playdate" : "Upcoming"}
            </h2>
            {otherPlaydates.length > 0 ? (
              <div className="space-y-3">
                {otherPlaydates.map((pd) => (
                  <PlaydateCard key={pd.id} pd={pd} userId={user?.id} onRsvp={handleRsvp} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-card rounded-2xl border border-border">
                <div className="text-4xl mb-3">🌳</div>
                <p className="font-bold text-sm mb-1">No open playdates yet</p>
                <p className="text-xs text-muted-foreground">Be the first to plan one!</p>
              </div>
            )}
          </section>
        </>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowPlan(true)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 px-5 py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm shadow-floating active:scale-[0.96] transition-all"
      >
        <Plus className="h-5 w-5" />
        Plan Playdate
      </button>

      {showPlan && (
        <PlanSheet
          onClose={() => setShowPlan(false)}
          onConfirm={handleCreate}
        />
      )}
    </div>
  );
}
