import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, Modal, Pressable, Vibration } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Text, View } from '@/components/Themed';
import SocialCard from '@/components/SocialCard';
import SOCIAL_NETWORKS from '@/constants/SocialNetworks';
import { useSocialProfiles } from '@/hooks/useSocialProfiles';

export default function WalletScreen() {
  const { profiles, loading, reload } = useSocialProfiles();
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Reload profiles when the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const activeNetworks = profiles
    .filter((p) => p.username)
    .map((p) => ({
      ...SOCIAL_NETWORKS.find((n) => n.id === p.networkId)!,
      username: p.username,
    }))
    .filter((n) => n.id);

  const expandedNetwork = activeNetworks.find((n) => n.id === expandedId);

  const handleCardPress = (id: string) => {
    Vibration.vibrate(10);
    setFocusedId((prev) => (prev === id ? null : id));
  };

  const handleCardLongPress = (id: string) => {
    Vibration.vibrate(50);
    setExpandedId(id);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (activeNetworks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyIcon}>👛</Text>
        <Text style={styles.emptyTitle}>Your wallet is empty</Text>
        <Text style={styles.emptySubtitle}>
          Go to the Preferences tab to add your social profiles
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.walletStack}
        showsVerticalScrollIndicator={false}>
        {activeNetworks.map((network, index) => (
          <View
            key={network.id}
            style={[
              styles.cardWrapper,
              { marginTop: index === 0 ? 0 : -30 },
            ]}>
            <SocialCard
              network={network}
              username={network.username}
              focused={focusedId === network.id}
              onPress={() => handleCardPress(network.id)}
              onLongPress={() => handleCardLongPress(network.id)}
            />
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={!!expandedNetwork}
        transparent
        animationType="fade"
        onRequestClose={() => setExpandedId(null)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setExpandedId(null)}>
          <View style={styles.modalContent}>
            {expandedNetwork && (
              <SocialCard
                network={expandedNetwork}
                username={expandedNetwork.username}
                expanded
                onPress={() => setExpandedId(null)}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  walletStack: {
    paddingTop: 30,
    paddingBottom: 60,
    alignItems: 'center',
  },
  cardWrapper: {
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
  },
});
