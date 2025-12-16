import { supabase } from "./supabaseClient";

const TABLE = "profiles";

export async function loadProfiles() {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) {
    console.error("Could not load profiles from Supabase", error);
    return [];
  }
  return data || [];
}

export async function saveProfile(profile) {
  const { data, error } = await supabase.from(TABLE).upsert(profile, { onConflict: "slug" }).select();
  if (error) {
    console.error("Could not save profile to Supabase", error);
    throw error;
  }
  return data?.[0] || profile;
}

export async function getProfile(slug) {
  const { data, error } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("Could not fetch profile from Supabase", error);
    return null;
  }
  return data || null;
}
