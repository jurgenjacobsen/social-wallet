import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'social_wallet_profiles';

export interface SocialProfile {
  networkId: string;
  username: string;
}

export function useSocialProfiles() {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfiles(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load profiles:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfiles = useCallback(async (newProfiles: SocialProfile[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
      setProfiles(newProfiles);
    } catch (e) {
      console.error('Failed to save profiles:', e);
    }
  }, []);

  const upsertProfile = useCallback(
    async (networkId: string, username: string) => {
      const trimmed = username.trim();
      let updated: SocialProfile[];

      if (trimmed === '') {
        updated = profiles.filter((p) => p.networkId !== networkId);
      } else {
        const exists = profiles.find((p) => p.networkId === networkId);
        if (exists) {
          updated = profiles.map((p) =>
            p.networkId === networkId ? { ...p, username: trimmed } : p,
          );
        } else {
          updated = [...profiles, { networkId, username: trimmed }];
        }
      }

      await saveProfiles(updated);
    },
    [profiles, saveProfiles],
  );

  const getUsername = useCallback(
    (networkId: string): string => {
      return profiles.find((p) => p.networkId === networkId)?.username ?? '';
    },
    [profiles],
  );

  const clearAll = useCallback(async () => {
    await saveProfiles([]);
  }, [saveProfiles]);

  const reorderProfiles = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= profiles.length ||
        toIndex >= profiles.length
      ) {
        return;
      }
      const updated = [...profiles];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      await saveProfiles(updated);
    },
    [profiles, saveProfiles],
  );

  return {
    profiles,
    loading,
    upsertProfile,
    getUsername,
    reload: loadProfiles,
    clearAll,
    reorderProfiles,
  };
}
