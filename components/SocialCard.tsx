import React from 'react';
import { StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import { View, Text } from './Themed';
import { SocialNetwork } from '@/constants/SocialNetworks';
import { isLightColor } from '@/utils/colors';

const CREDIT_CARD_RATIO = 1.586; // standard credit card aspect ratio (w/h)

interface SocialCardProps {
  network: SocialNetwork;
  username: string;
  expanded?: boolean;
  focused?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function SocialCard({
  network,
  username,
  expanded,
  focused,
  onPress,
  onLongPress,
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

  if (focused) {
    const focusedHeight = cardWidth / CREDIT_CARD_RATIO;
    return (
      <Pressable onPress={onPress} onLongPress={onLongPress}>
        <View
          style={[
            styles.focusedCard,
            {
              backgroundColor: network.color,
              width: cardWidth,
              height: focusedHeight,
            },
          ]}>
          <View style={styles.focusedTop}>
            <FontAwesome
              name={network.icon as any}
              size={32}
              color={textColor}
            />
            <Text style={[styles.focusedName, { color: textColor }]}>
              {network.name}
            </Text>
          </View>
          <View style={styles.focusedBottom}>
            <Text style={[styles.focusedUsername, { color: textColor }]}>
              @{username}
            </Text>
            <Text style={[styles.focusedHint, { color: textColor }]}>
              Hold for QR code
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
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
  focusedCard: {
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  focusedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  focusedName: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 12,
  },
  focusedBottom: {
    backgroundColor: 'transparent',
  },
  focusedUsername: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.9,
  },
  focusedHint: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
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
