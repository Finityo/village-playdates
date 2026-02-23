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
 * Fetches all public profiles from the database (excluding current user)
 * so Browse can show real user data instead of mock data.
 */
export function useRealProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<RealProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase
      .from("profiles")
      .select("id, display_name, avatar_url, neighborhood, kids_ages, interests, bio, verified")
      .not("display_name", "is", null)
      .order("created_at", { ascending: false });

    if (user) {
      query = query.neq("id", user.id);
    }

    query.then(({ data }) => {
      setProfiles((data as RealProfile[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  return { profiles, loading };
}
