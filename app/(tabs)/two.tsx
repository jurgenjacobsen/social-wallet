import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { isLightColor } from '@/utils/colors';

export default function PreferencesScreen() {
  const { profiles, loading, upsertProfile, getUsername, clearAll, reorderProfiles } =
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

  const handleClearAll = () => {
    const doIt = async () => {
      await clearAll();
      if (Platform.OS === 'web') {
        window.alert('All cards cleared!');
      } else {
        Alert.alert('Done', 'All cards cleared!');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Remove all cards from your wallet?')) {
        doIt();
      }
    } else {
      Alert.alert(
        'Clear all cards',
        'Remove all cards from your wallet?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: doIt },
        ],
      );
    }
  };

  const activeProfiles = useMemo(
    () => profiles.filter((p) => p.username),
    [profiles],
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index > 0) {
        reorderProfiles(index, index - 1);
      }
    },
    [reorderProfiles],
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index < activeProfiles.length - 1) {
        reorderProfiles(index, index + 1);
      }
    },
    [reorderProfiles, activeProfiles.length],
  );

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

      {activeProfiles.length > 0 && (
        <View style={styles.orderSection}>
          <Text style={styles.sectionHeader}>Card order</Text>
          <Text style={styles.sectionSubtitle}>
            Reorder how cards appear in your wallet.
          </Text>
          {activeProfiles.map((profile, index) => {
            const network = SOCIAL_NETWORKS.find((n) => n.id === profile.networkId);
            if (!network) return null;
            return (
              <View key={profile.networkId} style={styles.orderRow}>
                <View
                  style={[styles.orderBadge, { backgroundColor: network.color }]}>
                  <FontAwesome
                    name={network.icon as any}
                    size={16}
                    color={isLightColor(network.color) ? '#000' : '#fff'}
                  />
                </View>
                <Text style={styles.orderName}>{network.name}</Text>
                <Pressable
                  style={[styles.arrowButton, index === 0 && styles.arrowDisabled]}
                  onPress={() => handleMoveUp(index)}
                  disabled={index === 0}>
                  <FontAwesome name="arrow-up" size={14} color={textColor} />
                </Pressable>
                <Pressable
                  style={[
                    styles.arrowButton,
                    index === activeProfiles.length - 1 && styles.arrowDisabled,
                  ]}
                  onPress={() => handleMoveDown(index)}
                  disabled={index === activeProfiles.length - 1}>
                  <FontAwesome name="arrow-down" size={14} color={textColor} />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {activeProfiles.length > 0 && (
        <Pressable style={styles.clearButton} onPress={handleClearAll}>
          <FontAwesome name="trash" size={16} color="#fff" />
          <Text style={styles.clearButtonText}>Clear all cards</Text>
        </Pressable>
      )}
    </ScrollView>
  );
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
  orderSection: {
    marginTop: 32,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 16,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  orderName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  arrowDisabled: {
    opacity: 0.25,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 32,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
