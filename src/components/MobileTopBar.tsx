import { Link, useLocation } from "react-router-dom";
import { Bell, Settings } from "lucide-react";

export default function MobileTopBar({ title }: { title?: string }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 h-14">
        {isHome ? (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-black">
              MC
            </div>
            <span className="font-display font-black text-lg text-primary">MomCircle</span>
          </Link>
        ) : (
          <span className="font-display font-black text-lg">{title ?? "MomCircle"}</span>
        )}
        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
