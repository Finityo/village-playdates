import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix broken bundler icon paths
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function makeParkIcon() {
  const color = "hsl(142,38%,40%)";
  const size = 28;
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

interface MiniMapProps {
  lat: number;
  lng: number;
  parkName: string;
}

export function MiniMap({ lat, lng, parkName }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    markerRef.current = L.marker([lat, lng], { icon: makeParkIcon() })
      .addTo(map)
      .bindPopup(parkName, { closeButton: false })
      .openPopup();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update position when park changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.setView([lat, lng], 15, { animate: true });
    markerRef.current.setLatLng([lat, lng]);
    markerRef.current.setPopupContent(parkName).openPopup();
  }, [lat, lng, parkName]);

  return (
    <div
      ref={containerRef}
      className="w-full h-36 rounded-2xl overflow-hidden border border-border"
      style={{ zIndex: 0 }}
    />
  );
}
