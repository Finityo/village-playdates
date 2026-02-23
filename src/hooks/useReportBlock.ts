import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useReportBlock(targetUserId: string | undefined) {
  const { user } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !targetUserId || user.id === targetUserId) return;
    supabase
      .from("blocked_users")
      .select("id")
      .eq("blocker_id", user.id)
      .eq("blocked_id", targetUserId)
      .maybeSingle()
      .then(({ data }) => setIsBlocked(!!data));
  }, [user, targetUserId]);

  const blockUser = useCallback(async () => {
    if (!user || !targetUserId) return;
    setLoading(true);
    const { error } = await supabase
      .from("blocked_users")
      .insert({ blocker_id: user.id, blocked_id: targetUserId });
    setLoading(false);
    if (error) {
      toast.error("Failed to block user");
    } else {
      setIsBlocked(true);
      toast.success("User blocked. They won't appear in your feed.");
    }
  }, [user, targetUserId]);

  const unblockUser = useCallback(async () => {
    if (!user || !targetUserId) return;
    setLoading(true);
    const { error } = await supabase
      .from("blocked_users")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_id", targetUserId);
    setLoading(false);
    if (error) {
      toast.error("Failed to unblock user");
    } else {
      setIsBlocked(false);
      toast.success("User unblocked");
    }
  }, [user, targetUserId]);

  const reportUser = useCallback(async (reason: string, details?: string) => {
    if (!user || !targetUserId) return;
    setLoading(true);
    const { error } = await supabase
      .from("reports")
      .insert({ reporter_id: user.id, reported_user_id: targetUserId, reason, details });
    setLoading(false);
    if (error) {
      toast.error("Failed to submit report");
    } else {
      toast.success("Report submitted. Our safety team will review within 24 hours.");
    }
  }, [user, targetUserId]);

  return { isBlocked, loading, blockUser, unblockUser, reportUser };
}
