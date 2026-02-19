import { useState } from "react";
import { MapPin, Heart, MessageCircle, Users, Shield, Star, Filter, Search, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockMoms = [
  {
    id: 1,
    name: "Jessica M.",
    neighborhood: "Riverside Park",
    kids: ["3 yrs", "5 yrs"],
    interests: ["Outdoor play", "Arts & Crafts", "Montessori"],
    availability: ["Weekday mornings", "Saturday afternoons"],
    bio: "Coffee-fueled mama of two who loves hiking trails and spontaneous park days. Looking for moms who don't mind a little mud!",
    distance: "0.4 mi",
    verified: true,
    liked: false,
    avatar: "JM",
    avatarColor: "hsl(142 38% 40%)",
  },
  {
    id: 2,
    name: "Amara K.",
    neighborhood: "Sunfield District",
    kids: ["2 yrs"],
    interests: ["Nature walks", "Sensory play", "Music & Dance"],
    availability: ["Weekday afternoons", "Sunday mornings"],
    bio: "New in town with my adventurous toddler. Seeking a village of kindred spirits — let's build one together!",
    distance: "0.9 mi",
    verified: true,
    liked: false,
    avatar: "AK",
    avatarColor: "hsl(12 82% 65%)",
  },
  {
    id: 3,
    name: "Sofia R.",
    neighborhood: "Maplewood Heights",
    kids: ["4 yrs", "7 yrs"],
    interests: ["Sports & Active play", "Cooking together", "Book clubs"],
    availability: ["Weekend mornings", "Friday afternoons"],
    bio: "Sports mom raising future athletes (and future chefs 😄). Always planning the next playdate at the big park!",
    distance: "1.2 mi",
    verified: false,
    liked: false,
    avatar: "SR",
    avatarColor: "hsl(204 80% 62%)",
  },
  {
    id: 4,
    name: "Priya T.",
    neighborhood: "Cedarwood Commons",
    kids: ["1 yr", "3 yrs"],
    interests: ["Yoga & Wellness", "Outdoor play", "Bilingual"],
    availability: ["Morning walks", "Weekday afternoons"],
    bio: "Mindful mama raising bilingual kiddos. Love slow mornings at the park and spontaneous picnics!",
    distance: "1.8 mi",
    verified: true,
    liked: false,
    avatar: "PT",
    avatarColor: "hsl(42 90% 60%)",
  },
  {
    id: 5,
    name: "Lauren B.",
    neighborhood: "Green Valley",
    kids: ["6 yrs"],
    interests: ["Science & STEM", "Hiking", "Art projects"],
    availability: ["After school", "Saturday mornings"],
    bio: "Science-enthusiast mom who turns every park trip into a nature discovery mission. Snacks always included.",
    distance: "2.1 mi",
    verified: true,
    liked: false,
    avatar: "LB",
    avatarColor: "hsl(133 45% 50%)",
  },
  {
    id: 6,
    name: "Maya O.",
    neighborhood: "Harbor View",
    kids: ["2 yrs", "4 yrs"],
    interests: ["Water play", "Crafts", "Outdoor play"],
    availability: ["Weekends", "Holiday mornings"],
    bio: "Water baby mom! We're always finding puddles to jump in and parks to explore. Join our little crew!",
    distance: "2.4 mi",
    verified: false,
    liked: false,
    avatar: "MO",
    avatarColor: "hsl(204 65% 55%)",
  },
];

const interestOptions = ["All", "Outdoor play", "Arts & Crafts", "Montessori", "Nature walks", "Sports & Active", "Bilingual", "STEM", "Music & Dance"];
const ageOptions = ["Any age", "0–1 yr", "1–2 yrs", "2–4 yrs", "4–6 yrs", "6+ yrs"];
const availabilityOptions = ["Any time", "Weekday mornings", "Weekday afternoons", "Weekend mornings", "Weekend afternoons"];

export default function BrowseMoms() {
  const [moms, setMoms] = useState(mockMoms);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [selectedAge, setSelectedAge] = useState("Any age");
  const [selectedAvailability, setSelectedAvailability] = useState("Any time");
  const [showFilters, setShowFilters] = useState(false);

  const toggleLike = (id: number) => {
    setMoms((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m))
    );
  };

  const filtered = moms.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesInterest =
      selectedInterest === "All" || m.interests.some((i) => i.includes(selectedInterest));
    return matchesSearch && matchesInterest;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                placeholder="Search by name, neighborhood, or interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border bg-card text-sm font-semibold hover:bg-accent transition"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 pt-1 pb-2 animate-in slide-in-from-top-2">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs font-bold text-muted-foreground self-center mr-1">Interests:</span>
                {interestOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedInterest(opt)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
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
          )}

          {/* Horizontal interest chips (always visible) */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {interestOptions.slice(0, 6).map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedInterest(opt)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition flex-shrink-0 ${
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
      <div className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-sm font-semibold text-muted-foreground mb-5">
          {filtered.length} moms near you
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mom) => (
            <MomCard key={mom.id} mom={mom} onLike={() => toggleLike(mom.id)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="font-display text-xl font-bold mb-2">No moms found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MomCard({ mom, onLike }: { mom: typeof mockMoms[0]; onLike: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group">
      {/* Top accent strip */}
      <div className="h-1.5 gradient-primary" />

      <div className="p-5">
        {/* Avatar + Name row */}
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

        {/* Kids ages */}
        <div className="flex items-center gap-1.5 mb-3">
          <Users className="h-3.5 w-3.5 text-coral" />
          <span className="text-xs font-semibold text-muted-foreground">Kids:</span>
          {mom.kids.map((age) => (
            <span key={age} className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
              {age}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{mom.bio}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mom.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs rounded-full font-semibold">
              {interest}
            </Badge>
          ))}
        </div>

        {/* Availability */}
        <div className="text-xs text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">Available: </span>
          {mom.availability[0]}
          {mom.availability.length > 1 && ` +${mom.availability.length - 1}`}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition">
            <MessageCircle className="h-3.5 w-3.5" />
            Connect
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-accent text-accent-foreground hover:bg-secondary/30 transition">
            <Star className="h-3.5 w-3.5" />
            Playdate
          </button>
        </div>
      </div>
    </div>
  );
}
