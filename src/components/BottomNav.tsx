import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, MessageCircle, Map } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [newMomBadge, setNewMomBadge] = useState(false);
  const joinedAtRef = useRef<string | null>(null);

  // Subscribe to new profiles in the same neighborhood
  useEffect(() => {
    if (!user || !profile?.neighborhood) return;

    // Mark when we started listening — only flag profiles created after this
    joinedAtRef.current = new Date().toISOString();

    const channel = supabase
      .channel("new-nearby-moms")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "profiles",
          filter: `neighborhood=eq.${profile.neighborhood}`,
        },
        (payload) => {
          // Don't badge for our own profile
          if (payload.new.id === user.id) return;
          setNewMomBadge(true);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, profile?.neighborhood]);

  const tabs = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Browse", icon: Search, href: "/browse" },
    { label: "Playdates", icon: Calendar, href: "/playdates" },
    { label: "Map", icon: Map, href: "/map" },
    { label: "Messages", icon: MessageCircle, href: "/messages" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 h-16">
        {tabs.map(({ label, icon: Icon, href }) => {
          const active = location.pathname === href ||
            (href === "/browse" && location.pathname.startsWith("/mom"));
          const showBadge = label === "Home" && newMomBadge && !active;

          return (
            <Link
              key={href}
              to={href}
              onClick={() => { if (label === "Home") setNewMomBadge(false); }}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${active ? "bg-primary/10" : ""}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
                {showBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-coral border border-background animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
