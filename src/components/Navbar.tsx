import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Find Moms", href: "/browse" },
  { label: "How it Works", href: "/#how" },
  { label: "Safety", href: "/#safety" },
  { label: "Premium", href: "/#premium" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-black shadow-soft">
            MC
          </div>
          <span className="font-display font-black text-xl text-primary">MomCircle</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-bold text-primary hover:underline">Sign In</button>
          <Link
            to="/browse"
            className="px-5 py-2 rounded-full gradient-primary text-white text-sm font-bold shadow-soft hover:shadow-hover transition-all"
          >
            Join Free
          </Link>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link
            to="/browse"
            className="px-5 py-2.5 rounded-full gradient-primary text-white text-sm font-bold text-center shadow-soft"
            onClick={() => setOpen(false)}
          >
            Join Free
          </Link>
        </div>
      )}
    </header>
  );
}
