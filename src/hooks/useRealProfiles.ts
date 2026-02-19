import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RealProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
  kids_ages: string[] | null;
  interests: string[] | null;
  bio: string | null;
}

/**
 * Fetches all public profiles from the database so Browse can show real
 * user data (avatars, neighborhoods, interests) instead of mock data.
 */
export function useRealProfiles() {
  const [profiles, setProfiles] = useState<RealProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, display_name, avatar_url, neighborhood, kids_ages, interests, bio")
      .not("display_name", "is", null)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProfiles((data as RealProfile[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { profiles, loading };
}
