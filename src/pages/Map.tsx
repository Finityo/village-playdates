import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Users, Star, Navigation } from "lucide-react";

// Fix default Leaflet icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon factory
function makeIcon(color: string, size = 32) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="${size}" height="${Math.round(size * 1.25)}">
      <path d="M16 0C9.37 0 4 5.37 4 12c0 9 12 28 12 28S28 21 28 12C28 5.37 22.63 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="12" r="6" fill="white" opacity="0.9"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, Math.round(size * 1.25)],
    iconAnchor: [size / 2, Math.round(size * 1.25)],
    popupAnchor: [0, -Math.round(size * 1.25)],
  });
}

const PARK_ICON = makeIcon("hsl(142, 38%, 40%)");
const HOT_PARK_ICON = makeIcon("hsl(12, 82%, 65%)", 36);
const USER_ICON = makeIcon("hsl(204, 80%, 62%)");

// ── CURATED PLAYDATE PARKS ────────────────────────────────────────────────────
// A hand-picked mix of well-known family/toddler-friendly public spaces with
// the types of activities moms and dads typically report loving.
interface Park {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
  rating: number;
  playgroundType: string;
  bestFor: string[];
  tip: string;
  hot: boolean; // "known playdate hotspot"
  momsHere: number;
}

const PARKS: Park[] = [
  {
    id: 1,
    name: "Riverside Park",
    lat: 40.8004,
    lng: -73.9789,
    description: "Beloved waterfront park stretching along the Hudson. Wide paths, spray pad, and multiple playgrounds.",
    rating: 4.9,
    playgroundType: "Spray Pad + Playground",
    bestFor: ["Toddlers", "Water play", "Stroller-friendly"],
    tip: "The 91st St playground has the best toddler section and is never too crowded on weekday mornings.",
    hot: true,
    momsHere: 12,
  },
  {
    id: 2,
    name: "Oakwood Playground",
    lat: 40.7749,
    lng: -73.9654,
    description: "Community favourite with shaded benches, soft-surface play area, and a community garden.",
    rating: 4.7,
    playgroundType: "Inclusive Playground",
    bestFor: ["All ages", "Arts & Crafts", "Nature walks"],
    tip: "Moms group meets here every Tuesday at 10 AM — just show up!",
    hot: true,
    momsHere: 8,
  },
  {
    id: 3,
    name: "Sunfield Common",
    lat: 40.7580,
    lng: -73.9855,
    description: "Gorgeous open green space with a large sandbox, climbing structure, and café nearby.",
    rating: 4.6,
    playgroundType: "Natural Play Area",
    bestFor: ["Sensory play", "Outdoor play", "Coffee nearby ☕"],
    tip: "Bring sand toys — the sandbox here is enormous and kids love it.",
    hot: false,
    momsHere: 5,
  },
  {
    id: 4,
    name: "Maplewood Sports Park",
    lat: 40.7825,
    lng: -73.9501,
    description: "Spacious park with soccer fields, basketball courts, and a dedicated under-5 play zone.",
    rating: 4.5,
    playgroundType: "Sports + Playground",
    bestFor: ["Sports & Active play", "Older kids", "Big groups"],
    tip: "Saturday mornings are popular for informal parent kick-arounds while kids play nearby.",
    hot: false,
    momsHere: 6,
  },
  {
    id: 5,
    name: "Heritage Trail Park",
    lat: 40.7690,
    lng: -73.9720,
    description: "Tree-lined trail loop great for strollers, with a picnic area and small creek.",
    rating: 4.4,
    playgroundType: "Nature Trail + Picnic",
    bestFor: ["Nature walks", "Hiking", "Yoga & Wellness"],
    tip: "Morning yoga moms group uses the flat clearing near the north entrance.",
    hot: false,
    momsHere: 3,
  },
  {
    id: 6,
    name: "Lotus Park",
    lat: 40.7915,
    lng: -73.9610,
    description: "Peaceful park with a pond, ducks to feed, and a lovely toddler-fenced play corner.",
    rating: 4.8,
    playgroundType: "Fenced Toddler Area",
    bestFor: ["Toddlers", "Books & Storytime", "Sensory play"],
    tip: "The fenced area is perfect for 1-3 year olds — you can actually sit and chat!",
    hot: true,
    momsHere: 9,
  },
  {
    id: 7,
    name: "Harbor Splash Pad",
    lat: 40.7102,
    lng: -74.0134,
    description: "Free waterfront splash pad with incredible views. Running late May through September.",
    rating: 4.9,
    playgroundType: "Splash Pad",
    bestFor: ["Water play", "Toddlers", "Summer hangouts"],
    tip: "Arrive before 10 AM in summer — it fills up fast! Bring extra clothes.",
    hot: true,
    momsHere: 15,
  },
  {
    id: 8,
    name: "Bayfront Park",
    lat: 40.7260,
    lng: -74.0020,
    description: "Underrated gem with a climbing wall, swings over grass, and picnic tables.",
    rating: 4.3,
    playgroundType: "Adventure Playground",
    bestFor: ["Outdoor play", "Science & STEM", "Older kids"],
    tip: "Local dad group runs a weekend nature-scavenger hunt for 4-8 year olds — very chill.",
    hot: false,
    momsHere: 4,
  },
  {
    id: 9,
    name: "Cedarwood Green",
    lat: 40.7450,
    lng: -73.9870,
    description: "Shaded neighbourhood green with Montessori-style wooden play structures.",
    rating: 4.7,
    playgroundType: "Wooden / Montessori Play",
    bestFor: ["Montessori", "Arts & Crafts", "Nature walks"],
    tip: "The morning coffee walk group meets here every Saturday at 9 AM.",
    hot: true,
    momsHere: 10,
  },
  {
    id: 10,
    name: "Nature Discovery Park",
    lat: 40.8121,
    lng: -73.9435,
    description: "Semi-wild park with logs, mud kitchens, and a rain garden — perfect for curious kids.",
    rating: 4.6,
    playgroundType: "Nature Play",
    bestFor: ["Nature walks", "Sensory play", "Science & STEM"],
    tip: "Mud kitchen is a hit — pack old clothes and don't stress about mess!",
    hot: false,
    momsHere: 5,
  },
];

// Center map on a new marker
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1 });
  }, [lat, lng, map]);
  return null;
}

export default function MapPage() {
  const [selected, setSelected] = useState<Park | null>(null);
  const [filter, setFilter] = useState<"all" | "hot">("all");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);

  const visibleParks = filter === "hot" ? PARKS.filter((p) => p.hot) : PARKS;

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setFlyTarget({ lat: coords[0], lng: coords[1] });
      },
      () => alert("Location access denied. Enable it in your browser settings.")
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-5rem)] relative">

      {/* Filter + Locate bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-background border-b border-border flex-shrink-0 z-10">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            filter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
          }`}
        >
          All Parks ({PARKS.length})
        </button>
        <button
          onClick={() => setFilter("hot")}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            filter === "hot" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
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

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[40.758, -73.975]}
          zoom={13}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} />}

          {userLocation && (
            <Marker position={userLocation} icon={USER_ICON}>
              <Popup>📍 You are here</Popup>
            </Marker>
          )}

          {visibleParks.map((park) => (
            <Marker
              key={park.id}
              position={[park.lat, park.lng]}
              icon={park.hot ? HOT_PARK_ICON : PARK_ICON}
              eventHandlers={{
                click: () => {
                  setSelected(park);
                  setFlyTarget({ lat: park.lat, lng: park.lng });
                },
              }}
            >
              <Popup className="leaflet-popup-custom">
                <div className="text-sm font-bold">{park.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  👥 {park.momsHere} moms here lately
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Park Detail Card (slides up when a pin is tapped) */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 z-[500] bg-background rounded-t-3xl border-t border-border shadow-2xl px-5 pt-4 pb-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-black text-base">{selected.name}</h3>
                {selected.hot && (
                  <span className="text-[10px] font-black uppercase tracking-wide bg-primary text-white px-2 py-0.5 rounded-full flex-shrink-0">
                    🔥 Hotspot
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="h-3 w-3 text-primary fill-primary" />
                <span className="font-semibold">{selected.rating}</span>
                <span>·</span>
                <Users className="h-3 w-3" />
                <span>{selected.momsHere} moms seen here recently</span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-2 rounded-xl bg-muted active:bg-border transition-colors flex-shrink-0"
            >
              ✕
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
            onClick={() => {
              window.location.href = `/playdates`;
              setSelected(null);
            }}
            className="w-full py-3 rounded-2xl gradient-primary text-white font-bold text-sm active:scale-[0.98] transition-all"
          >
            Plan a Playdate Here 🛝
          </button>
        </div>
      )}
    </div>
  );
}
