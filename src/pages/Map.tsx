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
    id: 1, name: "Landa Park", lat: 29.7085, lng: -98.1274,
    description: "New Braunfels' crown jewel — spring-fed pool, splash pad, miniature train, and multiple playgrounds along the Comal River.",
    rating: 4.9, playgroundType: "Splash Pad + Playground",
    bestFor: ["Toddlers", "Water play", "Stroller-friendly"],
    tip: "The splash pad area is perfect for under-5s on weekday mornings before the crowds arrive.",
    hot: true, momsHere: 14,
  },
  {
    id: 2, name: "Cypress Bend Park", lat: 29.7312, lng: -98.1056,
    description: "Gorgeous Guadalupe River access with shaded picnic areas, a boat ramp, and wide grassy fields for kids to run.",
    rating: 4.7, playgroundType: "Nature Park + River Access",
    bestFor: ["Nature walks", "Water play", "Big groups"],
    tip: "Bring water shoes — kids love wading in the shallow river edge on hot days.",
    hot: true, momsHere: 9,
  },
  {
    id: 3, name: "Wheatfield Park", lat: 29.6921, lng: -98.1189,
    description: "Neighbourhood gem with a shaded playground, walking path, and friendly community feel — great for toddler meetups.",
    rating: 4.5, playgroundType: "Community Playground",
    bestFor: ["Toddlers", "Stroller-friendly", "Coffee nearby ☕"],
    tip: "Moms group meets here Tuesday mornings at 9:30 AM — just show up!",
    hot: true, momsHere: 7,
  },
  {
    id: 4, name: "Community Park (Common St)", lat: 29.7015, lng: -98.1302,
    description: "Centrally located park with a covered pavilion, swings, and open lawn — perfect for birthday playdates.",
    rating: 4.4, playgroundType: "Playground + Pavilion",
    bestFor: ["All ages", "Big groups", "Outdoor play"],
    tip: "Reserve the pavilion through the city website for birthday parties — books up fast on weekends!",
    hot: false, momsHere: 5,
  },
  {
    id: 5, name: "Fischer Park", lat: 29.7198, lng: -98.1421,
    description: "Peaceful neighbourhood park with large oak trees, a jungle gym, and a sand area — a local favourite for morning walks.",
    rating: 4.6, playgroundType: "Natural Play Area",
    bestFor: ["Nature walks", "Sensory play", "Stroller-friendly"],
    tip: "Best visited in the morning — the big oaks keep it shady and cool.",
    hot: false, momsHere: 4,
  },
  {
    id: 6, name: "Purgatory Creek Natural Area", lat: 29.8721, lng: -97.9854,
    description: "Hill Country trail system with creek crossings and wildlife — older kids and active moms love this adventurous outing.",
    rating: 4.8, playgroundType: "Nature Trail",
    bestFor: ["Hiking", "Nature walks", "Older kids"],
    tip: "Bring a carrier for little ones — the trails are uneven but the creek crossings make it magical.",
    hot: true, momsHere: 6,
  },
  {
    id: 7, name: "Bicentennial Park (San Marcos)", lat: 29.8827, lng: -97.9414,
    description: "Beautiful San Marcos River park with a splash area, walking paths, and a duck pond kids adore.",
    rating: 4.9, playgroundType: "Splash Pad + River Park",
    bestFor: ["Water play", "Toddlers", "Summer hangouts"],
    tip: "Arrive early on summer weekends — the splash pad is wildly popular and parking fills fast.",
    hot: true, momsHere: 11,
  },
  {
    id: 8, name: "Max Starcke Park (Seguin)", lat: 29.5688, lng: -97.9641,
    description: "Spacious Guadalupe River park in Seguin with a free water park, playgrounds, and wide open green space.",
    rating: 4.5, playgroundType: "Water Park + Playground",
    bestFor: ["Water play", "Big groups", "Summer hangouts"],
    tip: "The free water park (open Memorial Day–Labor Day) is an incredible find — worth the short drive from NB.",
    hot: false, momsHere: 8,
  },
  {
    id: 9, name: "Veterans Park (Kyle)", lat: 29.9891, lng: -97.8772,
    description: "Modern inclusive playground in Kyle with poured-rubber surface, sensory panels, and covered picnic areas.",
    rating: 4.7, playgroundType: "Inclusive Playground",
    bestFor: ["All ages", "Sensory play", "Stroller-friendly"],
    tip: "One of the most accessible playgrounds in the area — the inclusive equipment is fantastic for mixed-age groups.",
    hot: false, momsHere: 6,
  },
  {
    id: 10, name: "Guadalupe River State Park", lat: 29.8607, lng: -98.4908,
    description: "Stunning Hill Country state park with spring-fed river swimming, camping, and miles of nature trails.",
    rating: 4.9, playgroundType: "State Park + River Swimming",
    bestFor: ["Hiking", "Water play", "Nature walks"],
    tip: "Book a day-use spot on the Texas State Parks app — it sells out on summer weekends!",
    hot: true, momsHere: 10,
  },
];

// "You are here" pulsing marker via CSS
const YOU_ARE_HERE_ICON = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:24px;height:24px">
      <div style="position:absolute;inset:0;border-radius:50%;background:hsl(204,80%,55%);opacity:0.35;animation:pulse-ring 1.8s ease-out infinite"></div>
      <div style="position:absolute;inset:4px;border-radius:50%;background:hsl(204,80%,55%);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
    </div>
    <style>
      @keyframes pulse-ring{0%{transform:scale(1);opacity:0.35}70%{transform:scale(2.4);opacity:0}100%{transform:scale(2.4);opacity:0}}
    </style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -16],
});

export default function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [selected, setSelected] = useState<Park | null>(null);
  const [filter, setFilter] = useState<"all" | "hot">("all");

  const flyToUser = (lat: number, lng: number) => {
    if (!leafletMap.current) return;
    leafletMap.current.flyTo([lat, lng], 10, { duration: 1.2 });
    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.marker([lat, lng], { icon: YOU_ARE_HERE_ICON })
      .addTo(leafletMap.current)
      .bindPopup("📍 You are here")
      .openPopup();
  };

  // Initialise the map once
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current, {
      center: [29.7030, -98.1245],
      zoom: 10,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap.current);

    L.control.zoom({ position: "bottomright" }).addTo(leafletMap.current);

    // Request location on mount — fly to user, or silently stay on NB default
    navigator.geolocation.getCurrentPosition(
      (pos) => flyToUser(pos.coords.latitude, pos.coords.longitude),
      () => { /* denied — stay on New Braunfels default */ },
      { timeout: 8000, maximumAge: 60000 }
    );

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      (pos) => flyToUser(pos.coords.latitude, pos.coords.longitude),
      () => { /* silently ignore if denied */ }
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
