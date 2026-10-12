import { UserProfile, LifePathReading, IntakeSurvey } from '../types';
import { calculateLifePath, LIFE_PATH_DETAILS, formatMarkdownReading, CalculationTrace } from './numerology';

const PROFILES_STORAGE_KEY = 'cosmic_profiles_list_v2';
const ACTIVE_PROFILE_ID_KEY = 'cosmic_active_profile_id_v2';

// Legacy keys for migration
const LEGACY_PROFILE_KEY = 'cosmic_path_user_profile_v1';
const LEGACY_READING_KEY = 'cosmic_path_latest_reading_v1';

export function getSavedProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Migrate from legacy single-profile key if present
    const legacy = localStorage.getItem(LEGACY_PROFILE_KEY);
    if (legacy) {
      try {
        const parsedLegacy: UserProfile = JSON.parse(legacy);
        if (parsedLegacy && parsedLegacy.name) {
          const initialList = [{ ...parsedLegacy, relationship: 'self' as const }];
          localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(initialList));
          localStorage.setItem(ACTIVE_PROFILE_ID_KEY, parsedLegacy.id);
          return initialList;
        }
      } catch {}
    }

    return [];
  } catch (err) {
    console.warn('Failed to load saved profiles:', err);
    return [];
  }
}

export function saveProfilesList(profiles: UserProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    window.dispatchEvent(new CustomEvent('cosmic-profiles-changed', { detail: { profiles } }));
  } catch (err) {
    console.error('Failed to save profiles list:', err);
  }
}

export function getActiveProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
}

export function setActiveProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
  window.dispatchEvent(new CustomEvent('cosmic-active-profile-changed', { detail: { profileId: id } }));
}

export function getActiveProfile(): UserProfile | null {
  const profiles = getSavedProfiles();
  if (profiles.length === 0) return null;

  const activeId = getActiveProfileId();
  if (activeId) {
    const found = profiles.find((p) => p.id === activeId);
    if (found) return found;
  }

  // Fallback to first profile and persist
  setActiveProfileId(profiles[0].id);
  return profiles[0];
}

export function saveProfileRecord(profile: UserProfile): void {
  const profiles = getSavedProfiles();
  const existingIdx = profiles.findIndex((p) => p.id === profile.id);

  let updated: UserProfile[];
  if (existingIdx >= 0) {
    updated = [...profiles];
    updated[existingIdx] = profile;
  } else {
    updated = [profile, ...profiles];
  }

  saveProfilesList(updated);
  setActiveProfileId(profile.id);
}

export function deleteProfileRecord(id: string): boolean {
  const profiles = getSavedProfiles();
  const updated = profiles.filter((p) => p.id !== id);
  saveProfilesList(updated);

  // Clean profile reading cache
  try {
    localStorage.removeItem(`cosmic_reading_${id}`);
  } catch {}

  const activeId = getActiveProfileId();
  if (activeId === id) {
    if (updated.length > 0) {
      setActiveProfileId(updated[0].id);
    } else {
      localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
    }
  }

  return true;
}

export function getProfileReading(profileId: string): { reading: LifePathReading; trace: CalculationTrace } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`cosmic_reading_${profileId}`);
    if (raw) return JSON.parse(raw);

    // Fallback to legacy single reading key if active matches legacy
    const legacy = localStorage.getItem(LEGACY_READING_KEY);
    if (legacy) return JSON.parse(legacy);

    return null;
  } catch {
    return null;
  }
}

export function saveProfileReading(
  profileId: string,
  reading: LifePathReading,
  trace: CalculationTrace
): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({ reading, trace });
    localStorage.setItem(`cosmic_reading_${profileId}`, payload);
    localStorage.setItem(LEGACY_READING_KEY, payload); // Keep legacy in sync
  } catch (err) {
    console.error('Failed to save profile reading:', err);
  }
}

export function createNewUserProfile(
  name: string,
  birthDate: string,
  survey?: IntakeSurvey,
  relationship: UserProfile['relationship'] = 'self'
): UserProfile {
  const trace = calculateLifePath(birthDate);
  const newProfile: UserProfile = {
    id: `prof_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim() || 'Honored Soul',
    birthDate: trace.rawDate,
    relationship,
    primaryFocus: survey?.focusArea || 'spiritual',
    currentMood: survey?.energyLevel || 'balanced',
    lifePathNumber: trace.finalLifePath,
    createdAt: new Date().toISOString(),
    notes: survey?.intention || '',
  };

  // Generate deterministic base reading
  const detail = LIFE_PATH_DETAILS[trace.finalLifePath] || LIFE_PATH_DETAILS[1];
  const baseReading = formatMarkdownReading(newProfile.name, newProfile.birthDate, detail, trace, survey);
  saveProfileReading(newProfile.id, baseReading, trace);

  saveProfileRecord(newProfile);
  return newProfile;
}
