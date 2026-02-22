import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

/**
 * Subscribes to the notifications table via realtime.
 * When a new notification arrives (playdate_updated or playdate_deleted),
 * it fires a local notification (Capacitor) and shows a toast.
 */
export function usePlaydateNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { notifyPlaydateChange } = useNotifications();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notif = payload.new as {
            id: string;
            type: string;
            title: string;
            body: string;
            metadata: Record<string, string>;
          };

          // Show in-app toast
          toast({
            title: notif.title,
            description: notif.body,
          });

          // Fire local (Capacitor) notification
          notifyPlaydateChange(notif.title, notif.body);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, notifyPlaydateChange]);
}
