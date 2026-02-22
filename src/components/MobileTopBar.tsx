import { Link, useLocation } from "react-router-dom";
import { Bell, Settings } from "lucide-react";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export default function MobileTopBar({ title }: { title?: string }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const unreadCount = useUnreadNotifications();

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
          <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-coral flex items-center justify-center text-[9px] font-black text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
