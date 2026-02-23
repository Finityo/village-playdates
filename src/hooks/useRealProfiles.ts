import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface RealProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
  kids_ages: string[] | null;
  interests: string[] | null;
  bio: string | null;
  verified: boolean;
}

/**
 * Fetches all public profiles from the database (excluding current user and blocked users)
 * so Browse can show real user data instead of mock data.
 */
export function useRealProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<RealProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      // Get blocked user IDs first
      let blockedIds: string[] = [];
      if (user) {
        const { data: blocks } = await supabase
          .from("blocked_users")
          .select("blocked_id")
          .eq("blocker_id", user.id);
        blockedIds = (blocks ?? []).map((b) => b.blocked_id);
      }

      let query = supabase
        .from("profiles")
        .select("id, display_name, avatar_url, neighborhood, kids_ages, interests, bio, verified")
        .not("display_name", "is", null)
        .order("created_at", { ascending: false });

      if (user) {
        query = query.neq("id", user.id);
      }

      const { data } = await query;
      const allProfiles = (data as RealProfile[]) ?? [];
      
      // Filter out blocked users
      const filtered = blockedIds.length > 0
        ? allProfiles.filter((p) => !blockedIds.includes(p.id))
        : allProfiles;

      setProfiles(filtered);
      setLoading(false);
    }

    fetchProfiles();
  }, [user]);

  return { profiles, loading };
}
