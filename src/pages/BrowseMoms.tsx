import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Heart, MessageCircle, Users, Shield, Star, Filter, Search, ChevronDown, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOMS, MY_INTERESTS, INTEREST_ICONS, type Mom } from "@/data/moms";

const interestOptions = ["All", "Outdoor play", "Arts & Crafts", "Montessori", "Nature walks", "Sports & Active play", "Bilingual", "Science & STEM", "Music & Dance"];

export default function BrowseMoms() {
  const [moms, setMoms] = useState<Mom[]>(MOMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMoms((prev) => prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m)));
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
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-4">
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

          {/* Interest chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {interestOptions.map((opt) => (
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
            <MomCard key={mom.id} mom={mom} onLike={(e) => toggleLike(e, mom.id)} />
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

function MomCard({ mom, onLike }: { mom: Mom; onLike: (e: React.MouseEvent) => void }) {
  const navigate = useNavigate();
  const sharedCount = mom.interests.filter((i) => MY_INTERESTS.includes(i)).length;

  return (
    <div
      onClick={() => navigate(`/mom/${mom.id}`)}
      className="rounded-2xl border border-border bg-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-0.5"
    >
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

        {/* Shared interests badge */}
        {sharedCount > 0 && (
          <div className="flex items-center gap-1.5 mb-3 bg-primary/8 text-primary rounded-lg px-2.5 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-bold">{sharedCount} shared interest{sharedCount > 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mom.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs rounded-full font-semibold">
              {INTEREST_ICONS[interest] ?? "🌸"} {interest}
            </Badge>
          ))}
        </div>

        {/* Availability */}
        <div className="text-xs text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">Available: </span>
          {mom.availability[0]}
          {mom.availability.length > 1 && ` +${mom.availability.length - 1} more`}
        </div>

        {/* Actions */}
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
