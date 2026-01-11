import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_PROFILES = 'pcursos:profiles';
const STORAGE_KEY_ACTIVE = 'pcursos:activeProfileId';
const MAX_PROFILES = 5;

export interface UserProfile {
  id: string;
  name: string;
  photo: string;
}

interface ProfilesState {
  profiles: UserProfile[];
  activeProfileId: string | null;
}

export function useProfile() {
  const [state, setState] = useState<ProfilesState>({
    profiles: [],
    activeProfileId: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Perfil ativo atual
  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId) || null;
  
  // Tem algum perfil cadastrado
  const hasProfiles = state.profiles.length > 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE);
    
    let profiles: UserProfile[] = [];
    
    if (storedProfiles) {
      try {
        profiles = JSON.parse(storedProfiles);
      } catch {
        profiles = [];
      }
    }
    
    setState({
      profiles,
      activeProfileId: storedActiveId || (profiles[0]?.id ?? null),
    });
    
    setIsLoaded(true);
  }, []);

  const saveProfiles = useCallback((profiles: UserProfile[], activeId: string | null) => {
    setState({ profiles, activeProfileId: activeId });
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
      if (activeId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, activeId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      }
    } catch {}
  }, []);

  const createProfile = useCallback((name: string, photo: string) => {
    if (state.profiles.length >= MAX_PROFILES) return null;
    
    const newProfile: UserProfile = {
      id: `profile_${Date.now()}`,
      name,
      photo,
    };
    
    const newProfiles = [...state.profiles, newProfile];
    saveProfiles(newProfiles, newProfile.id);
    return newProfile;
  }, [state.profiles, saveProfiles]);

  const updateProfile = useCallback((profileId: string, updates: Partial<Omit<UserProfile, 'id'>>) => {
    const newProfiles = state.profiles.map(p =>
      p.id === profileId ? { ...p, ...updates } : p
    );
    saveProfiles(newProfiles, state.activeProfileId);
  }, [state.profiles, state.activeProfileId, saveProfiles]);

  const deleteProfile = useCallback((profileId: string) => {
    const newProfiles = state.profiles.filter(p => p.id !== profileId);
    const newActiveId = state.activeProfileId === profileId 
      ? (newProfiles[0]?.id ?? null)
      : state.activeProfileId;
    saveProfiles(newProfiles, newActiveId);
  }, [state.profiles, state.activeProfileId, saveProfiles]);

  const switchProfile = useCallback((profileId: string) => {
    if (state.profiles.some(p => p.id === profileId)) {
      saveProfiles(state.profiles, profileId);
    }
  }, [state.profiles, saveProfiles]);

  return {
    profile: activeProfile,
    profiles: state.profiles,
    activeProfileId: state.activeProfileId,
    hasProfiles,
    isLoaded,
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile,
    canAddMore: state.profiles.length < MAX_PROFILES,
  };
}
