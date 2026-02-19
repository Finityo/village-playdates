import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, MessageCircle, User } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Browse", icon: Search, href: "/browse" },
  { label: "Playdates", icon: Calendar, href: "/playdates" },
  { label: "Messages", icon: MessageCircle, href: "/messages" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 h-16">
        {tabs.map(({ label, icon: Icon, href }) => {
          const active = location.pathname === href || 
            (href === "/browse" && location.pathname.startsWith("/mom"));
          return (
            <Link
              key={href}
              to={href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-primary/10" : ""}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
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
