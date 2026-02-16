import React from 'react';
import { StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import { View, Text } from './Themed';
import { SocialNetwork } from '@/constants/SocialNetworks';
import { isLightColor } from '@/utils/colors';

interface SocialCardProps {
  network: SocialNetwork;
  username: string;
  expanded?: boolean;
  onPress?: () => void;
}

export default function SocialCard({
  network,
  username,
  expanded,
  onPress,
}: SocialCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 40, 360);
  const url = network.urlTemplate.replace('{username}', username);

  // Use white text for dark backgrounds, dark text for light ones
  const textColor = isLightColor(network.color) ? '#000' : '#fff';

  if (expanded) {
    return (
      <Pressable onPress={onPress}>
        <View
          style={[
            styles.expandedCard,
            { backgroundColor: network.color, width: cardWidth },
          ]}>
          <View style={styles.expandedHeader}>
            <FontAwesome
              name={network.icon as any}
              size={36}
              color={textColor}
            />
            <Text style={[styles.expandedName, { color: textColor }]}>
              {network.name}
            </Text>
          </View>
          <Text style={[styles.username, { color: textColor }]}>
            @{username}
          </Text>
          <View style={styles.qrContainer}>
            <QRCode value={url} size={180} backgroundColor="#fff" />
          </View>
          <Text style={[styles.urlText, { color: textColor }]}>{url}</Text>
          <Text style={[styles.tapHint, { color: textColor }]}>
            Tap to close
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.card,
          { backgroundColor: network.color, width: cardWidth },
        ]}>
        <FontAwesome
          name={network.icon as any}
          size={24}
          color={textColor}
        />
        <Text style={[styles.cardName, { color: textColor }]}>
          {network.name}
        </Text>
        <Text style={[styles.cardUsername, { color: textColor }]}>
          @{username}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 14,
    flex: 1,
  },
  cardUsername: {
    fontSize: 14,
    opacity: 0.85,
  },
  expandedCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  expandedName: {
    fontSize: 28,
    fontWeight: '800',
    marginLeft: 14,
  },
  username: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  urlText: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 12,
  },
  tapHint: {
    fontSize: 12,
    opacity: 0.5,
  },
});
