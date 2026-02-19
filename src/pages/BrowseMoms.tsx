import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Heart, MessageCircle, Users, Shield, Star, Filter, Search, CheckCircle2, X, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOMS, MY_INTERESTS, INTEREST_ICONS, type Mom } from "@/data/moms";

const DISTANCE_OPTIONS = ["0.5 mi", "1 mi", "2 mi", "5 mi"];
const AGE_GROUP_OPTIONS = ["0–1 yr", "1–2 yrs", "2–3 yrs", "3–5 yrs", "5–7 yrs", "7–10 yrs"];
const INTEREST_OPTIONS = [
  "Outdoor play", "Arts & Crafts", "Nature walks", "Sensory play",
  "Music & Dance", "Books & Storytime", "Sports & Active play", "Cooking together",
  "Hiking", "Yoga & Wellness", "Science & STEM", "Water play", "Museums", "Montessori",
];
const INTEREST_CHIP_OPTIONS = ["All", "Outdoor play", "Arts & Crafts", "Montessori", "Nature walks", "Sports & Active play", "Science & STEM", "Music & Dance"];

interface Filters {
  distance: string;
  ageGroups: string[];
  interests: string[];
}

const DEFAULT_FILTERS: Filters = { distance: "", ageGroups: [], interests: [] };

function countActiveFilters(f: Filters) {
  return (f.distance ? 1 : 0) + f.ageGroups.length + f.interests.length;
}

function distanceToMiles(d: string): number {
  return parseFloat(d.replace(" mi", ""));
}

function kidAgeToGroupKey(age: string): string {
  // Map "2 yrs" → "1–2 yrs" style groups
  const num = parseFloat(age);
  if (num < 1) return "0–1 yr";
  if (num <= 2) return "1–2 yrs";
  if (num <= 3) return "2–3 yrs";
  if (num <= 5) return "3–5 yrs";
  if (num <= 7) return "5–7 yrs";
  return "7–10 yrs";
}

export default function BrowseMoms() {
  const [moms, setMoms] = useState<Mom[]>(MOMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);

  const activeCount = countActiveFilters(filters);

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMoms((prev) => prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m)));
  };

  const openSheet = () => {
    setPendingFilters(filters);
    setShowFilters(true);
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setShowFilters(false);
  };

  const clearAll = () => {
    setPendingFilters(DEFAULT_FILTERS);
  };

  const togglePendingAgeGroup = (ag: string) =>
    setPendingFilters((prev) => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(ag)
        ? prev.ageGroups.filter((a) => a !== ag)
        : [...prev.ageGroups, ag],
    }));

  const togglePendingInterest = (i: string) =>
    setPendingFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(i)
        ? prev.interests.filter((x) => x !== i)
        : [...prev.interests, i],
    }));

  const filtered = moms.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesInterestChip =
      selectedInterest === "All" || m.interests.some((i) => i.includes(selectedInterest));

    const matchesDistance =
      !filters.distance ||
      parseFloat(m.distance) <= distanceToMiles(filters.distance);

    const matchesAgeGroups =
      filters.ageGroups.length === 0 ||
      m.kids.some((k) => filters.ageGroups.includes(kidAgeToGroupKey(k)));

    const matchesInterests =
      filters.interests.length === 0 ||
      filters.interests.some((fi) => m.interests.includes(fi));

    return matchesSearch && matchesInterestChip && matchesDistance && matchesAgeGroups && matchesInterests;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto">
          {/* Search + Filter button */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                placeholder="Search by name, neighborhood…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={openSheet}
              className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-sm font-semibold transition flex-shrink-0 ${
                activeCount > 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:bg-accent"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeCount > 0 && (
                <span className="ml-0.5 w-5 h-5 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

          {/* Interest quick-filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {INTEREST_CHIP_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedInterest(opt)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition flex-shrink-0 ${
                  selectedInterest === opt
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:bg-accent"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-5">
        <p className="text-sm font-semibold text-muted-foreground mb-4">
          {filtered.length} moms near you
          {activeCount > 0 && <span className="text-primary"> · {activeCount} filter{activeCount > 1 ? "s" : ""} active</span>}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mom) => (
            <MomCard key={mom.id} mom={mom} onLike={(e) => toggleLike(e, mom.id)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="font-display text-xl font-bold mb-2">No moms found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
            <button
              onClick={() => { setFilters(DEFAULT_FILTERS); setSelectedInterest("All"); }}
              className="mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── FILTER BOTTOM SHEET ── */}
      {showFilters && (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/50"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="bg-background rounded-t-3xl flex flex-col overflow-hidden"
            style={{ height: "min(88dvh, 88vh)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-2 flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-border">
              <div>
                <h2 className="font-display font-black text-lg">Filter Moms</h2>
                <p className="text-xs text-muted-foreground">
                  {countActiveFilters(pendingFilters) > 0
                    ? `${countActiveFilters(pendingFilters)} filter${countActiveFilters(pendingFilters) > 1 ? "s" : ""} selected`
                    : "Show moms that match your vibe"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {countActiveFilters(pendingFilters) > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-bold text-muted-foreground underline underline-offset-2 px-2 py-1"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-xl active:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 space-y-7">

              {/* Distance */}
              <section>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">
                  📍 Distance
                </p>
                <div className="flex gap-2 flex-wrap">
                  {DISTANCE_OPTIONS.map((d) => {
                    const active = pendingFilters.distance === d;
                    return (
                      <button
                        key={d}
                        onClick={() =>
                          setPendingFilters((prev) => ({
                            ...prev,
                            distance: prev.distance === d ? "" : d,
                          }))
                        }
                        className={`px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all active:scale-[0.97] ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        {active && <span className="mr-1">✓</span>}
                        Within {d}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Kids' Age Groups */}
              <section>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">
                  👶 Kids' Age Groups
                </p>
                <div className="flex gap-2 flex-wrap">
                  {AGE_GROUP_OPTIONS.map((ag) => {
                    const active = pendingFilters.ageGroups.includes(ag);
                    return (
                      <button
                        key={ag}
                        onClick={() => togglePendingAgeGroup(ag)}
                        className={`px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all active:scale-[0.97] ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        {active && <span className="mr-1">✓</span>}
                        {ag}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Shared Interests */}
              <section>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">
                  ✨ Shared Interests
                </p>
                <div className="flex gap-2 flex-wrap">
                  {INTEREST_OPTIONS.map((interest) => {
                    const active = pendingFilters.interests.includes(interest);
                    const icon = INTEREST_ICONS[interest] ?? "🌸";
                    return (
                      <button
                        key={interest}
                        onClick={() => togglePendingInterest(interest)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-sm font-semibold transition-all active:scale-[0.97] ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        <span>{icon}</span>
                        <span>{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-border bg-background safe-area-bottom">
              <button
                onClick={applyFilters}
                className="w-full py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm active:scale-[0.98] transition-all"
              >
                {countActiveFilters(pendingFilters) > 0
                  ? `Show moms (${countActiveFilters(pendingFilters)} filter${countActiveFilters(pendingFilters) > 1 ? "s" : ""} applied)`
                  : "Show all moms"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MomCard({ mom, onLike }: { mom: Mom; onLike: (e: React.MouseEvent) => void }) {
  const navigate = useNavigate();
  const sharedCount = mom.interests.filter((i) => MY_INTERESTS.includes(i)).length;

  return (
    <div
      onClick={() => navigate(`/mom/${mom.id}`)}
      className="rounded-2xl border border-border bg-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-0.5"
    >
      <div className="h-1.5 gradient-primary" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-soft"
              style={{ backgroundColor: mom.avatarColor }}
            >
              {mom.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base">{mom.name}</h3>
                {mom.verified && (
                  <Shield className="h-3.5 w-3.5 text-primary" fill="currentColor" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>{mom.neighborhood} · {mom.distance}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onLike}
            className={`p-2 rounded-xl transition-all ${
              mom.liked
                ? "bg-red-50 text-red-500"
                : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-400"
            }`}
          >
            <Heart className="h-5 w-5" fill={mom.liked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <Users className="h-3.5 w-3.5 text-coral" />
          <span className="text-xs font-semibold text-muted-foreground">Kids:</span>
          {mom.kids.map((age) => (
            <span key={age} className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
              {age}
            </span>
          ))}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{mom.bio}</p>

        {sharedCount > 0 && (
          <div className="flex items-center gap-1.5 mb-3 bg-primary/8 text-primary rounded-lg px-2.5 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-bold">{sharedCount} shared interest{sharedCount > 1 ? "s" : ""}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {mom.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs rounded-full font-semibold">
              {INTEREST_ICONS[interest] ?? "🌸"} {interest}
            </Badge>
          ))}
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">Available: </span>
          {mom.availability[0]}
          {mom.availability.length > 1 && ` +${mom.availability.length - 1} more`}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/mom/${mom.id}`); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            View Profile
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-accent text-accent-foreground hover:bg-secondary/30 transition"
          >
            <Star className="h-3.5 w-3.5" />
            Playdate
          </button>
        </div>
      </div>
    </div>
  );
}
