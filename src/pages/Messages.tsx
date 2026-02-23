import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Shield, MoreVertical, Bell, Settings, Home, Search, Calendar, MessageCircle, User, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/UserAvatar";

interface Thread {
  id: string;
  profileId: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  timestamp: string;
  unread: number;
  verified: boolean;
  online: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

const ICEBREAKERS = [
  "Coffee at the park this week? ☕",
  "Our kids seem like a perfect match! 🛝",
  "What's your little one's favourite park? 🌳",
  "Want to join our playdate group? 👋",
];

// ── CHAT VIEW ──────────────────────────────────────────────────────────────
function ChatView({ thread, onBack }: { thread: Thread; onBack: () => void }) {
  const { user } = useAuth();
  const { notifyNewMessage } = useNotifications();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);

  useEffect(() => {
    if (!thread.id) return;
    setLoading(true);
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", thread.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages((data as Message[]) ?? []);
        setLoading(false);
        scrollToBottom();
      });
  }, [thread.id, scrollToBottom]);

  useEffect(() => {
    if (!thread.id) return;
    const channel = supabase
      .channel(`messages:${thread.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${thread.id}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          scrollToBottom();
          if (newMsg.sender_id !== user?.id) {
            notifyNewMessage(thread.name, newMsg.text);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [thread.id, thread.name, user?.id, notifyNewMessage, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !user || !thread.id) return;
      setInput("");
      const { error } = await supabase.from("messages").insert({
        conversation_id: thread.id,
        sender_id: user.id,
        text: text.trim(),
      });
      if (error) console.error("Send message error:", error);
    },
    [user, thread.id]
  );

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <div className="flex items-center gap-3 px-4 pt-3 pb-3 bg-card border-b border-border shadow-card flex-shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl active:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <UserAvatar avatarUrl={thread.avatarUrl} displayName={thread.name} userId={thread.profileId} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm truncate">{thread.name}</span>
            {thread.verified && <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" fill="currentColor" />}
          </div>
          <span className="text-xs text-muted-foreground">{thread.online ? "Online" : "Offline"}</span>
        </div>
        <button className="p-2 rounded-xl active:bg-muted transition-colors">
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex justify-center pt-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-6">
            <UserAvatar avatarUrl={thread.avatarUrl} displayName={thread.name} userId={thread.profileId} size="lg" className="mx-auto mb-3" />
            <p className="font-bold mb-1">{thread.name}</p>
            <p className="text-xs text-muted-foreground mb-5">Start the conversation with an icebreaker 👇</p>
            <div className="flex flex-col gap-2 items-center">
              {ICEBREAKERS.map((ice) => (
                <button key={ice} onClick={() => sendMessage(ice)} className="px-4 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 active:scale-[0.97] transition-all">
                  {ice}
                </button>
              ))}
            </div>
          </div>
        )}
        {!loading && messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] ${isMe ? "order-2" : ""}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "gradient-primary text-white rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"}`}>
                  {msg.text}
                </div>
                <span className={`text-[10px] text-muted-foreground mt-1 block ${isMe ? "text-right" : "text-left"}`}>{formatTime(msg.created_at)}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {!loading && messages.length > 0 && (
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto hide-scrollbar flex-shrink-0">
          {ICEBREAKERS.slice(0, 3).map((ice) => (
            <button key={ice} onClick={() => sendMessage(ice)} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 active:scale-[0.97] transition-all">
              {ice}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-3 bg-card border-t border-border safe-area-bottom flex-shrink-0">
        <input
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

// ── THREAD LIST ────────────────────────────────────────────────────────────
export default function Messages() {
  const { user } = useAuth();
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      setLoadingThreads(true);

      // Fetch all conversations for current user
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, participant_a, participant_b, updated_at")
        .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (!convs || convs.length === 0) {
        setThreads([]);
        setLoadingThreads(false);
        return;
      }

      // Get all other participant IDs
      const otherIds = convs.map((c) => c.participant_a === user.id ? c.participant_b : c.participant_a);

      // Fetch profiles for all other participants
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, verified")
        .in("id", otherIds);

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      const threadList: Thread[] = [];
      for (const conv of convs) {
        const otherId = conv.participant_a === user.id ? conv.participant_b : conv.participant_a;
        const profile = profileMap.get(otherId);

        const { data: lastMsgs } = await supabase
          .from("messages")
          .select("text, created_at, sender_id")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const last = lastMsgs?.[0];

        threadList.push({
          id: conv.id,
          profileId: otherId,
          name: profile?.display_name ?? "Mom",
          avatarUrl: profile?.avatar_url ?? null,
          lastMessage: last?.text ?? "Start the conversation 👋",
          timestamp: getRelativeTime(last?.created_at ?? conv.updated_at),
          unread: 0,
          verified: profile?.verified ?? false,
          online: false,
        });
      }

      setThreads(threadList);
      setLoadingThreads(false);
    };

    loadConversations();
  }, [user]);

  // Realtime: refresh on conversation updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        // Trigger re-render
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (activeThread) {
    return <ChatView thread={activeThread} onBack={() => setActiveThread(null)} />;
  }

  const totalUnread = threads.reduce((n, t) => n + t.unread, 0);

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="font-display font-black text-lg">Messages</span>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition" aria-label="Notifications">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link to="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition" aria-label="Profile">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm text-muted-foreground">{threads.length} conversation{threads.length !== 1 ? "s" : ""}</p>
        </div>

        {loadingThreads ? (
          <div className="flex justify-center pt-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : threads.length === 0 ? (
          <div className="mx-4 mt-10 p-6 rounded-2xl bg-primary/8 border border-primary/20 text-center">
            <div className="text-3xl mb-3">💬</div>
            <p className="font-bold text-sm mb-1">No conversations yet</p>
            <p className="text-xs text-muted-foreground mb-4">Browse nearby moms and tap "Connect" to start chatting!</p>
            <Link to="/browse" className="inline-block px-5 py-2.5 rounded-full gradient-primary text-white text-sm font-bold">
              Browse Moms
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className="w-full flex items-center gap-3 px-4 py-4 bg-card active:bg-muted transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
                  <UserAvatar avatarUrl={thread.avatarUrl} displayName={thread.name} userId={thread.profileId} size="md" />
                  {thread.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm truncate">{thread.name}</span>
                      {thread.verified && <Shield className="h-3 w-3 text-primary flex-shrink-0" fill="currentColor" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{thread.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs truncate text-muted-foreground">{thread.lastMessage}</p>
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
        )}

        {threads.length > 0 && (
          <div className="mx-4 mt-6 mb-6 p-5 rounded-2xl bg-primary/8 border border-primary/20 text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="font-bold text-sm mb-1">Connect with more moms</p>
            <p className="text-xs text-muted-foreground">Browse nearby moms and send your first message!</p>
          </div>
        )}
      </div>

      <BottomNavBar active="/messages" />
    </div>
  );
}

function getRelativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
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
              <span className={`text-[10px] font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
