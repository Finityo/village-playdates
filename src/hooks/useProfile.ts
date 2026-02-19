import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch profile (lat/lng are restricted by column-level security for other users,
    // so we fetch our own location separately via a secure server-side function).
    Promise.all([
      supabase
        .from("profiles")
        .select("id, created_at, updated_at, verified, bio, avatar_url, verification_status, display_name, neighborhood, kids_ages, interests")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.rpc("get_my_location"),
    ]).then(([{ data: profileData, error: profileError }, { data: locationData }]) => {
      if (!profileError && profileData) {
        const location = locationData?.[0] ?? { lat: null, lng: null };
        setProfile({ ...profileData, lat: location.lat, lng: location.lng } as Profile);
      }
      setLoading(false);
    });
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select("id, created_at, updated_at, verified, bio, avatar_url, verification_status, display_name, neighborhood, kids_ages, interests")
      .single();
    if (!error && data) {
      // Re-fetch own location separately (GPS columns are col-level restricted)
      const { data: locationData } = await supabase.rpc("get_my_location");
      const location = locationData?.[0] ?? { lat: null, lng: null };
      setProfile({ ...data, lat: location.lat, lng: location.lng } as Profile);
    }
    return { error };
  };

  return { profile, loading, updateProfile, setProfile };
}
