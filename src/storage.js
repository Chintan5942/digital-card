const STORAGE_KEY = "digital-profile:profiles";

export function loadProfiles() {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Could not parse profiles from storage", error);
    return [];
  }
}

export function saveProfile(profile) {
  if (typeof localStorage === "undefined") return [];
  const profiles = loadProfiles();
  const existingIndex = profiles.findIndex((p) => p.slug === profile.slug);
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return profiles;
}

export function getProfile(slug) {
  return loadProfiles().find((profile) => profile.slug === slug);
}
