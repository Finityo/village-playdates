import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Shield, MoreVertical, Bell, Settings, Home, Search, Calendar, MessageCircle, User } from "lucide-react";

interface Thread {
  id: number;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  verified: boolean;
  online: boolean;
}

interface Message {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
}

const THREADS: Thread[] = [
  { id: 1, name: "Jessica M.", avatar: "JM", avatarColor: "hsl(142 38% 40%)", lastMessage: "That sounds perfect! See you at Riverside at 10?", timestamp: "2m ago", unread: 2, verified: true, online: true },
  { id: 2, name: "Priya T.", avatar: "PT", avatarColor: "hsl(42 90% 60%)", lastMessage: "Yes! Our kids would love that morning walk 🌿", timestamp: "1h ago", unread: 1, verified: true, online: true },
  { id: 3, name: "Amara K.", avatar: "AK", avatarColor: "hsl(12 82% 65%)", lastMessage: "I'm new here — would love to explore together!", timestamp: "3h ago", unread: 0, verified: true, online: false },
  { id: 4, name: "Sofia R.", avatar: "SR", avatarColor: "hsl(204 80% 62%)", lastMessage: "The Saturday park group is at 9am this week 🌳", timestamp: "Yesterday", unread: 0, verified: false, online: false },
  { id: 5, name: "Lauren B.", avatar: "LB", avatarColor: "hsl(133 45% 50%)", lastMessage: "Did you catch the butterfly exhibit at the museum?", timestamp: "2d ago", unread: 0, verified: true, online: false },
];

const MOCK_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, from: "them", text: "Hey! Loved your profile — our kids are almost the same age 🌸", time: "10:04 AM" },
    { id: 2, from: "me", text: "Aw thank you! Your bio made me laugh — muddy boots are our vibe too 😂", time: "10:06 AM" },
    { id: 3, from: "them", text: "Ha! Okay so we HAVE to do a playdate. How's your week looking?", time: "10:07 AM" },
    { id: 4, from: "me", text: "Wednesday morning works! We love Riverside Park.", time: "10:09 AM" },
    { id: 5, from: "them", text: "That sounds perfect! See you at Riverside at 10?", time: "10:10 AM" },
  ],
  2: [
    { id: 1, from: "them", text: "Hi! I saw you're into yoga & wellness — me too! 🧘", time: "9:12 AM" },
    { id: 2, from: "me", text: "Yes! Do you ever do morning walks at Cedarwood Green?", time: "9:14 AM" },
    { id: 3, from: "them", text: "Yes! Our kids would love that morning walk 🌿", time: "9:15 AM" },
  ],
};

const ICEBREAKERS = [
  "Coffee at the park this week? ☕",
  "Our kids seem like a perfect match! 🛝",
  "What's your little one's favourite park? 🌳",
  "Want to join our playdate group? 👋",
];

export default function Messages() {
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeThread) {
      setMessages(MOCK_MESSAGES[activeThread.id] ?? []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [activeThread]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  // ── CHAT VIEW ─────────────────────────────────────────────
  if (activeThread) {
    return (
      <div className="flex flex-col h-[100dvh] bg-background">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-3 bg-card border-b border-border shadow-card flex-shrink-0">
          <button
            onClick={() => setActiveThread(null)}
            className="p-2 -ml-2 rounded-xl active:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{ backgroundColor: activeThread.avatarColor }}
            >
              {activeThread.avatar}
            </div>
            {activeThread.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm truncate">{activeThread.name}</span>
              {activeThread.verified && <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" fill="currentColor" />}
            </div>
            <span className="text-xs text-muted-foreground">{activeThread.online ? "Online" : "Offline"}</span>
          </div>
          <button className="p-2 rounded-xl active:bg-muted transition-colors">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Icebreaker chips — shown at top of fresh chats */}
          {messages.length === 0 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-black text-white mb-3 shadow-soft"
                style={{ backgroundColor: activeThread.avatarColor }}
              >
                {activeThread.avatar}
              </div>
              <p className="font-bold mb-1">{activeThread.name}</p>
              <p className="text-xs text-muted-foreground mb-5">Start the conversation with an icebreaker 👇</p>
              <div className="flex flex-col gap-2 items-center">
                {ICEBREAKERS.map((ice) => (
                  <button
                    key={ice}
                    onClick={() => sendMessage(ice)}
                    className="px-4 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 active:scale-[0.97] transition-all"
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] ${msg.from === "me" ? "order-2" : ""}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "me"
                      ? "gradient-primary text-white rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className={`text-[10px] text-muted-foreground mt-1 block ${msg.from === "me" ? "text-right" : "text-left"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Icebreaker chips (for existing conversations) */}
        {messages.length > 0 && (
          <div className="flex gap-2 px-4 pb-2 overflow-x-auto hide-scrollbar flex-shrink-0">
            {ICEBREAKERS.slice(0, 3).map((ice) => (
              <button
                key={ice}
                onClick={() => sendMessage(ice)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 active:scale-[0.97] transition-all"
              >
                {ice}
              </button>
            ))}
          </div>
        )}

        {/* Input bar — pinned above keyboard */}
        <div className="flex items-center gap-2 px-4 py-3 bg-card border-t border-border safe-area-bottom flex-shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type a message…"
            className="flex-1 h-11 rounded-2xl bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 active:scale-[0.95] transition-all disabled:opacity-40"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  // ── THREAD LIST ──────────────────────────────────────────
  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Self-managed top bar */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="font-display font-black text-lg">Messages</span>
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm text-muted-foreground">
            {THREADS.reduce((n, t) => n + t.unread, 0)} unread
          </p>
        </div>

        <div className="divide-y divide-border">
          {THREADS.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveThread(thread)}
              className="w-full flex items-center gap-3 px-4 py-4 bg-card active:bg-muted transition-colors text-left"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white"
                  style={{ backgroundColor: thread.avatarColor }}
                >
                  {thread.avatar}
                </div>
                {thread.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-card" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm ${thread.unread > 0 ? "text-foreground" : "text-foreground/80"}`}>
                      {thread.name}
                    </span>
                    {thread.verified && <Shield className="h-3 w-3 text-primary flex-shrink-0" fill="currentColor" />}
                  </div>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{thread.timestamp}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs truncate ${thread.unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                    {thread.lastMessage}
                  </p>
                  {thread.unread > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full gradient-primary text-white text-[10px] font-black flex items-center justify-center">
                      {thread.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty-ish state nudge */}
        <div className="mx-4 mt-6 mb-6 p-5 rounded-2xl bg-primary/8 border border-primary/20 text-center">
          <div className="text-2xl mb-2">💬</div>
          <p className="font-bold text-sm mb-1">Connect with more moms</p>
          <p className="text-xs text-muted-foreground">Browse nearby moms and send your first message!</p>
        </div>
      </div>

      {/* Self-managed bottom nav */}
      <BottomNavBar active="/messages" />
    </div>
  );
}

const NAV_TABS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Browse", icon: Search, href: "/browse" },
  { label: "Playdates", icon: Calendar, href: "/playdates" },
  { label: "Messages", icon: MessageCircle, href: "/messages" },
  { label: "Profile", icon: User, href: "/profile" },
];

function BottomNavBar({ active }: { active: string }) {
  return (
    <nav className="flex-shrink-0 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 h-16">
        {NAV_TABS.map(({ label, icon: Icon, href }) => {
          const isActive = active === href;
          return (
            <Link
              key={href}
              to={href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
