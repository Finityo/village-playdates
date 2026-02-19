import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, Users, Navigation, X } from "lucide-react";

// ── FIX LEAFLET DEFAULT ICON PATHS (broken by bundlers) ─────────────────────
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// SVG pin factory
function makeSvgIcon(color: string, size = 32) {
  const h = Math.round(size * 1.25);
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="${size}" height="${h}">
      <path d="M16 0C9.37 0 4 5.37 4 12c0 9 12 28 12 28S28 21 28 12C28 5.37 22.63 0 16 0z"
            fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="12" r="6" fill="white" opacity="0.9"/>
    </svg>
  `);
  return L.divIcon({
    html: `<img src="data:image/svg+xml,${svg}" width="${size}" height="${h}" />`,
    className: "",
    iconSize: [size, h],
    iconAnchor: [size / 2, h],
    popupAnchor: [0, -h],
  });
}

// ── CURATED PARKS ────────────────────────────────────────────────────────────
export interface Park {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
  rating: number;
  playgroundType: string;
  bestFor: string[];
  tip: string;
  hot: boolean;
  momsHere: number;
}

const PARKS: Park[] = [
  {
    id: 1, name: "Riverside Park", lat: 40.8004, lng: -73.9789,
    description: "Beloved waterfront park with wide paths, spray pad, and multiple playgrounds along the Hudson.",
    rating: 4.9, playgroundType: "Spray Pad + Playground",
    bestFor: ["Toddlers", "Water play", "Stroller-friendly"],
    tip: "The 91st St playground has the best toddler section — never too crowded on weekday mornings.",
    hot: true, momsHere: 12,
  },
  {
    id: 2, name: "Oakwood Playground", lat: 40.7749, lng: -73.9654,
    description: "Community favourite with shaded benches, soft-surface play area, and a community garden.",
    rating: 4.7, playgroundType: "Inclusive Playground",
    bestFor: ["All ages", "Arts & Crafts", "Nature walks"],
    tip: "Moms group meets here every Tuesday at 10 AM — just show up!",
    hot: true, momsHere: 8,
  },
  {
    id: 3, name: "Sunfield Common", lat: 40.758, lng: -73.9855,
    description: "Gorgeous open green space with a large sandbox, climbing structure, and café nearby.",
    rating: 4.6, playgroundType: "Natural Play Area",
    bestFor: ["Sensory play", "Outdoor play", "Coffee nearby ☕"],
    tip: "Bring sand toys — the sandbox here is enormous and kids love it.",
    hot: false, momsHere: 5,
  },
  {
    id: 4, name: "Maplewood Sports Park", lat: 40.7825, lng: -73.9501,
    description: "Spacious park with soccer fields, basketball courts, and a dedicated under-5 play zone.",
    rating: 4.5, playgroundType: "Sports + Playground",
    bestFor: ["Sports & Active play", "Older kids", "Big groups"],
    tip: "Saturday mornings are popular for informal parent kick-arounds.",
    hot: false, momsHere: 6,
  },
  {
    id: 5, name: "Heritage Trail Park", lat: 40.769, lng: -73.972,
    description: "Tree-lined trail loop great for strollers, with a picnic area and small creek.",
    rating: 4.4, playgroundType: "Nature Trail + Picnic",
    bestFor: ["Nature walks", "Hiking", "Yoga & Wellness"],
    tip: "Morning yoga moms group meets at the flat clearing near the north entrance.",
    hot: false, momsHere: 3,
  },
  {
    id: 6, name: "Lotus Park", lat: 40.7915, lng: -73.961,
    description: "Peaceful park with a pond, ducks to feed, and a lovely toddler-fenced play corner.",
    rating: 4.8, playgroundType: "Fenced Toddler Area",
    bestFor: ["Toddlers", "Books & Storytime", "Sensory play"],
    tip: "The fenced area is perfect for 1-3 year olds — you can actually sit and chat!",
    hot: true, momsHere: 9,
  },
  {
    id: 7, name: "Harbor Splash Pad", lat: 40.7102, lng: -74.0134,
    description: "Free waterfront splash pad with incredible views. Running late May through September.",
    rating: 4.9, playgroundType: "Splash Pad",
    bestFor: ["Water play", "Toddlers", "Summer hangouts"],
    tip: "Arrive before 10 AM in summer — it fills up fast! Bring extra clothes.",
    hot: true, momsHere: 15,
  },
  {
    id: 8, name: "Bayfront Park", lat: 40.726, lng: -74.002,
    description: "Underrated gem with a climbing wall, swings over grass, and picnic tables.",
    rating: 4.3, playgroundType: "Adventure Playground",
    bestFor: ["Outdoor play", "Science & STEM", "Older kids"],
    tip: "Local dad group runs a weekend nature scavenger hunt for 4-8 year olds.",
    hot: false, momsHere: 4,
  },
  {
    id: 9, name: "Cedarwood Green", lat: 40.745, lng: -73.987,
    description: "Shaded neighbourhood green with Montessori-style wooden play structures.",
    rating: 4.7, playgroundType: "Wooden / Montessori Play",
    bestFor: ["Montessori", "Arts & Crafts", "Nature walks"],
    tip: "Coffee walk group meets here every Saturday at 9 AM.",
    hot: true, momsHere: 10,
  },
  {
    id: 10, name: "Nature Discovery Park", lat: 40.8121, lng: -73.9435,
    description: "Semi-wild park with logs, mud kitchens, and a rain garden — perfect for curious kids.",
    rating: 4.6, playgroundType: "Nature Play",
    bestFor: ["Nature walks", "Sensory play", "Science & STEM"],
    tip: "Mud kitchen is a hit — pack old clothes and don't stress about mess!",
    hot: false, momsHere: 5,
  },
];

export default function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selected, setSelected] = useState<Park | null>(null);
  const [filter, setFilter] = useState<"all" | "hot">("all");

  // Initialise the map once
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current, {
      center: [40.758, -73.975],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap.current);

    L.control.zoom({ position: "bottomright" }).addTo(leafletMap.current);

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  // Re-draw markers whenever filter changes
  useEffect(() => {
    if (!leafletMap.current) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const visible = filter === "hot" ? PARKS.filter((p) => p.hot) : PARKS;

    visible.forEach((park) => {
      const icon = makeSvgIcon(
        park.hot ? "hsl(142,38%,40%)" : "hsl(204,80%,62%)",
        park.hot ? 36 : 28
      );
      const marker = L.marker([park.lat, park.lng], { icon })
        .addTo(leafletMap.current!)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:140px">
            <strong style="font-size:13px">${park.name}</strong>
            ${park.hot ? '<span style="background:#3d8b5e;color:white;font-size:9px;padding:1px 6px;border-radius:20px;margin-left:4px">🔥 Hotspot</span>' : ""}
            <div style="font-size:11px;color:#666;margin-top:2px">👥 ${park.momsHere} moms recently</div>
          </div>
        `, { closeButton: false });

      marker.on("click", () => {
        setSelected(park);
        leafletMap.current?.flyTo([park.lat, park.lng], 15, { duration: 0.8 });
      });

      markersRef.current.push(marker);
    });
  }, [filter]);

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        leafletMap.current?.flyTo([lat, lng], 15, { duration: 1 });
        const userIcon = makeSvgIcon("hsl(12,82%,65%)", 30);
        L.marker([lat, lng], { icon: userIcon })
          .addTo(leafletMap.current!)
          .bindPopup("📍 You are here")
          .openPopup();
      },
      () => alert("Location access denied. Please enable it in your browser settings.")
    );
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 3.5rem - 5rem)" }}>
      {/* Filter bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-b border-border flex-shrink-0">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            filter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"
          }`}
        >
          All Parks ({PARKS.length})
        </button>
        <button
          onClick={() => setFilter("hot")}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            filter === "hot" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"
          }`}
        >
          <Star className="h-3 w-3" />
          Hotspots ({PARKS.filter((p) => p.hot).length})
        </button>
        <button
          onClick={locateMe}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-full bg-card border border-border text-xs font-bold active:bg-muted transition-all"
        >
          <Navigation className="h-3.5 w-3.5 text-primary" />
          Me
        </button>
      </div>

      {/* Map container */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />

        {/* Park detail card */}
        {selected && (
          <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-background rounded-t-3xl border-t border-border shadow-2xl px-5 pt-4 pb-6">
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-display font-black text-base">{selected.name}</h3>
                  {selected.hot && (
                    <span className="text-[10px] font-black uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      🔥 Hotspot
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                  <span className="font-semibold">{selected.rating}</span>
                  <span>·</span>
                  <Users className="h-3 w-3" />
                  <span>{selected.momsHere} moms recently</span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-xl bg-muted active:bg-border transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <span className="inline-block text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full mb-3">
              {selected.playgroundType}
            </span>

            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{selected.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.bestFor.map((tag) => (
                <span key={tag} className="text-[11px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="bg-accent border border-border rounded-xl px-3 py-2.5 mb-4">
              <p className="text-xs font-semibold text-accent-foreground">💡 Mom tip: {selected.tip}</p>
            </div>

            <button
              onClick={() => navigate(`/playdates?park=${encodeURIComponent(selected.name)}`)}
              className="block w-full py-3 rounded-2xl gradient-primary text-white font-bold text-sm text-center active:scale-[0.98] transition-all"
            >
              Plan a Playdate Here 🛝
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
