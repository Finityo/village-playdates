import { useState, useEffect, useCallback } from "react";
import { Plus, MapPin, Calendar, Clock, X, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MiniMap } from "@/components/MiniMap";

// ── TYPES ────────────────────────────────────────────────
interface AttendeeProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface Playdate {
  id: string;
  creator_id: string;
  park: string;
  date: string;
  time: string;
  description: string;
  created_at: string;
  rsvps: { user_id: string }[];
  attendees?: AttendeeProfile[];
}

const PARKS: { name: string; lat: number; lng: number }[] = [
  { name: "Landa Park",                  lat: 29.7085, lng: -98.1274 },
  { name: "Hinman Island Park",          lat: 29.7072, lng: -98.1235 },
  { name: "Fischer Park",                lat: 29.7198, lng: -98.1421 },
  { name: "Cypress Bend Park",           lat: 29.7312, lng: -98.1056 },
  { name: "Solms Park",                  lat: 29.6890, lng: -98.1150 },
  { name: "Dry Comal Creek Greenbelt",   lat: 29.7260, lng: -98.1320 },
  { name: "West Side Community Park",    lat: 29.7010, lng: -98.1450 },
  { name: "McQueeney Park",              lat: 29.6008, lng: -97.9870 },
  { name: "Gruene River Park",           lat: 29.7400, lng: -98.1060 },
  { name: "Comal River Tube Chute",      lat: 29.7035, lng: -98.1205 },
  { name: "Panther Canyon Nature Trail", lat: 29.7550, lng: -98.1400 },
  { name: "Wurstfest Grounds",           lat: 29.7120, lng: -98.1180 },
];

const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

// ── ATTENDEE STACK ───────────────────────────────────────
function AttendeeStack({ count, attendees }: { count: number; attendees?: AttendeeProfile[] }) {
  const shown = Math.min(count, 3);
  const colors = ["hsl(142 38% 40%)", "hsl(204 80% 62%)", "hsl(42 90% 60%)", "hsl(12 82% 65%)"];

  return (
    <div className="flex items-center">
      {Array.from({ length: shown }).map((_, i) => {
        const attendee = attendees?.[i];
        return (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-2 border-card overflow-hidden flex-shrink-0"
            style={{ marginLeft: i > 0 ? "-8px" : 0, zIndex: shown - i, position: "relative" }}
          >
            {attendee?.avatar_url ? (
              <img
                src={attendee.avatar_url}
                alt={attendee.display_name ?? "Attendee"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[10px] font-black text-white"
                style={{ backgroundColor: colors[i % colors.length] }}
              >
                {attendee?.display_name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
        );
      })}
      {count > 3 && (
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-card -ml-2">
          +{count - 3}
        </div>
      )}
      <span className="ml-2 text-xs text-muted-foreground">{count} going</span>
      {attendees && attendees.length > 0 && (
        <span className="ml-1 text-xs text-muted-foreground truncate max-w-[110px]">
          · {attendees[0].display_name ?? "A mom"}
          {attendees.length > 1 ? ` & ${attendees.length - 1} more` : ""}
        </span>
      )}
    </div>
  );
}

// ── DELETE CONFIRMATION DIALOG ────────────────────────────
function DeleteConfirmDialog({ parkName, onCancel, onConfirm }: {
  parkName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-6" onClick={onCancel}>
      <div
        className="bg-background rounded-3xl border border-border shadow-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl mb-3 text-center">🗑️</div>
        <h3 className="font-display font-black text-lg text-center mb-1">Delete Playdate?</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          <span className="font-bold text-foreground">{parkName}</span> will be removed for all attendees.
          This can't be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-border bg-card font-bold text-sm active:bg-muted transition-all"
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-destructive text-destructive-foreground font-bold text-sm active:scale-[0.98] transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PLAYDATE CARD ─────────────────────────────────────────
function PlaydateCard({
  pd,
  userId,
  onRsvp,
  onDelete,
}: {
  pd: Playdate;
  userId: string | undefined;
  onRsvp: (pd: Playdate) => void;
  onDelete: (pd: Playdate) => void;
}) {
  const isGoing = userId ? pd.rsvps.some((r) => r.user_id === userId) : false;
  const isOwn = userId === pd.creator_id;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      <div className="px-4 py-3 gradient-hero">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-display font-black text-sm">{pd.park}</span>
          </div>
          <div className="flex items-center gap-2">
            {isOwn && (
              <button
                onClick={() => onDelete(pd)}
                className="p-1.5 rounded-lg bg-background/50 hover:bg-destructive/10 transition-colors active:scale-95"
                aria-label="Delete playdate"
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            )}
            {isGoing ? (
              <span className="text-[10px] font-black uppercase tracking-wide bg-primary text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" /> Going
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-wide bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Upcoming
              </span>
            )}
          </div>
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
        <AttendeeStack count={pd.rsvps.length} attendees={pd.attendees} />
        {!isOwn ? (
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
        ) : (
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
  initialPark,
}: {
  onClose: () => void;
  onConfirm: (park: string, date: string, time: string, description: string) => Promise<void>;
  initialPark?: string;
}) {
  const [step, setStep] = useState(initialPark ? 1 : 0);
  const [selectedPark, setSelectedPark] = useState(initialPark ?? "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const canNext = [
    selectedPark !== "",
    selectedDate !== undefined && selectedTime !== "",
    true,
  ];

  const steps = ["Pick a Park", "Date & Time", "Description"];

  const handleConfirm = async () => {
    if (!selectedDate) return;
    setSaving(true);
    const dateLabel = format(selectedDate, "EEE, MMM d");
    await onConfirm(selectedPark, dateLabel, selectedTime, description);
    setSaving(false);
    onClose();
  };

  const selectedParkData = PARKS.find((p) => p.name === selectedPark);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-background rounded-t-3xl pt-2 pb-0 flex flex-col overflow-hidden"
        style={{ height: "min(90dvh, 90vh)" }}
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
              {/* Mini map preview when a park is selected */}
              {selectedParkData && (
                <div className="mb-3">
                  <MiniMap
                    lat={selectedParkData.lat}
                    lng={selectedParkData.lng}
                    parkName={selectedParkData.name}
                  />
                </div>
              )}
              {PARKS.map((park) => (
                <button
                  key={park.name}
                  onClick={() => setSelectedPark(park.name)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                    selectedPark === park.name ? "border-primary bg-primary/10" : "border-border bg-card"
                  }`}
                >
                  <MapPin className={`h-4 w-4 flex-shrink-0 ${selectedPark === park.name ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-semibold ${selectedPark === park.name ? "text-primary" : "text-foreground"}`}>
                    {park.name}
                  </span>
                  {selectedPark === park.name && (
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
              {initialPark && step === 1 && (
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-bold text-primary">{selectedPark}</span>
                  <button
                    onClick={() => { setStep(0); }}
                    className="ml-auto text-xs text-muted-foreground underline"
                  >
                    Change
                  </button>
                </div>
              )}
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">📅 Pick a Date</p>
                <div className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-2xl border border-border bg-card p-3 pointer-events-auto"
                  />
                </div>
                {selectedDate && (
                  <p className="text-center text-xs font-bold text-primary mt-2">
                    Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">⏰ Pick a Time</p>
                <div className="grid grid-cols-5 gap-2">
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
                <p className="text-xs text-muted-foreground">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d")} at {selectedTime}
                </p>
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
  const { schedulePlaydateReminder, notifyRsvp } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [playdates, setPlaydates] = useState<Playdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlan, setShowPlan] = useState(false);
  const [initialPark, setInitialPark] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<Playdate | null>(null);

  // Auto-open sheet if a park was passed via URL query param
  useEffect(() => {
    const park = searchParams.get("park");
    if (park) {
      setInitialPark(park);
      setShowPlan(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchPlaydates = useCallback(async () => {
    const { data, error } = await supabase
      .from("playdates")
      .select("*, rsvps:playdate_rsvps(user_id)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const enriched = await Promise.all(
        (data as Playdate[]).map(async (pd) => {
          if (!pd.rsvps.length) return { ...pd, attendees: [] };
          const userIds = pd.rsvps.map((r) => r.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, display_name, avatar_url")
            .in("id", userIds);
          const attendees: AttendeeProfile[] = (profiles ?? []).map((p) => ({
            user_id: p.id,
            display_name: p.display_name,
            avatar_url: p.avatar_url,
          }));
          return { ...pd, attendees };
        })
      );
      setPlaydates(enriched);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlaydates();
  }, [fetchPlaydates]);

  // Realtime: new playdates + rsvp changes
  useEffect(() => {
    const channel = supabase
      .channel("playdates-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "playdates" }, fetchPlaydates)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "playdate_rsvps" }, async (payload) => {
        if (!user) return;
        const rsvpUserId = (payload.new as { user_id: string }).user_id;
        const playdateId = (payload.new as { playdate_id: string }).playdate_id;
        const myPlaydate = playdates.find(
          (pd) => pd.id === playdateId && pd.creator_id === user.id && rsvpUserId !== user.id
        );
        if (myPlaydate) {
          await notifyRsvp(myPlaydate.park);
        }
        fetchPlaydates();
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "playdate_rsvps" }, fetchPlaydates)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPlaydates, playdates, user, notifyRsvp]);

  const handleCreate = async (park: string, date: string, time: string, description: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("playdates")
      .insert({ creator_id: user.id, park, date, time, description })
      .select()
      .single();

    if (!error && data) {
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
    fetchPlaydates();
  };

  const handleDelete = async () => {
    if (!confirmDelete || !user) return;
    await supabase.from("playdates").delete().eq("id", confirmDelete.id).eq("creator_id", user.id);
    setConfirmDelete(null);
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
          {myPlaydates.length > 0 && (
            <section className="px-4 py-2">
              <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> My Playdates
              </h2>
              <div className="space-y-3">
                {myPlaydates.map((pd) => (
                  <PlaydateCard key={pd.id} pd={pd} userId={user?.id} onRsvp={handleRsvp} onDelete={setConfirmDelete} />
                ))}
              </div>
            </section>
          )}

          <section className="px-4 py-2">
            <h2 className="font-display font-bold text-base mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {otherPlaydates.length > 0 ? "Join a Playdate" : "Upcoming"}
            </h2>
            {otherPlaydates.length > 0 ? (
              <div className="space-y-3">
                {otherPlaydates.map((pd) => (
                  <PlaydateCard key={pd.id} pd={pd} userId={user?.id} onRsvp={handleRsvp} onDelete={setConfirmDelete} />
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

      <button
        onClick={() => { setInitialPark(undefined); setShowPlan(true); }}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 px-5 py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm shadow-floating active:scale-[0.96] transition-all"
      >
        <Plus className="h-5 w-5" />
        Plan Playdate
      </button>

      {showPlan && (
        <PlanSheet
          onClose={() => setShowPlan(false)}
          onConfirm={handleCreate}
          initialPark={initialPark}
        />
      )}

      {confirmDelete && (
        <DeleteConfirmDialog
          parkName={confirmDelete.park}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
