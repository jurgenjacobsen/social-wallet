import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';
import { useThemeColor } from '@/components/Themed';
import SOCIAL_NETWORKS from '@/constants/SocialNetworks';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';

export default function PreferencesScreen() {
  const { profiles, loading, upsertProfile, getUsername } =
    useSocialProfiles();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const textColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');

  useEffect(() => {
    const initial: Record<string, string> = {};
    SOCIAL_NETWORKS.forEach((n) => {
      initial[n.id] = getUsername(n.id);
    });
    setDrafts(initial);
  }, [profiles, getUsername]);

  const handleSave = async (networkId: string) => {
    const value = drafts[networkId] ?? '';
    await upsertProfile(networkId, value);
    const message = value.trim()
      ? 'Profile saved!'
      : 'Profile removed from wallet.';
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Done', message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: bgColor }]}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Set up your socials</Text>
      <Text style={styles.subtitle}>
        Add your usernames below. They'll appear as cards in your wallet.
      </Text>

      {SOCIAL_NETWORKS.map((network) => {
        const isActive = !!(drafts[network.id] ?? '').trim();

        return (
          <View key={network.id} style={styles.row}>
            <View
              style={[styles.iconBadge, { backgroundColor: network.color }]}>
              <FontAwesome
                name={network.icon as any}
                size={20}
                color={isLightColor(network.color) ? '#000' : '#fff'}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.networkName}>{network.name}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: isActive ? network.color : '#ccc',
                  },
                ]}
                placeholder={network.placeholder}
                placeholderTextColor="#999"
                value={drafts[network.id] ?? ''}
                onChangeText={(text) =>
                  setDrafts((prev) => ({ ...prev, [network.id]: text }))
                }
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Pressable
              style={[styles.saveButton, { backgroundColor: network.color }]}
              onPress={() => handleSave(network.id)}>
              <FontAwesome
                name="check"
                size={16}
                color={isLightColor(network.color) ? '#000' : '#fff'}
              />
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputGroup: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  networkName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
