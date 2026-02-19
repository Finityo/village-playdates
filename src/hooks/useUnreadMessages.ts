import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Returns `hasUnread: true` whenever there's at least one message in any of
 * the current user's conversations that arrived after they opened the app.
 * Clears when the user navigates to /messages.
 */
export function useUnreadMessages() {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const joinedAtRef = useRef(new Date().toISOString());

  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages in any conversation the user is part of
    const channel = supabase
      .channel("unread-messages-badge")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const msg = payload.new as { sender_id: string; conversation_id: string; created_at: string };

          // Ignore own messages
          if (msg.sender_id === user.id) return;

          // Verify this message belongs to one of the user's conversations
          const { data: conv } = await supabase
            .from("conversations")
            .select("id")
            .eq("id", msg.conversation_id)
            .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
            .maybeSingle();

          if (conv) setHasUnread(true);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const clearUnread = () => setHasUnread(false);

  return { hasUnread, clearUnread };
}
