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

  return { profiles, loading, upsertProfile, getUsername, reload: loadProfiles };
}
