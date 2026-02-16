import React, { useEffect } from 'react';
import { StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { View, Text } from './Themed';
import { SocialNetwork } from '@/constants/SocialNetworks';
import { isLightColor } from '@/utils/colors';

const CREDIT_CARD_RATIO = 1.586; // standard credit card aspect ratio (w/h)
const ANIMATION_DURATION = 300;

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
  const collapsedHeight = 64; // approximate row height
  const focusedHeight = cardWidth / CREDIT_CARD_RATIO;
  const url = network.urlTemplate.replace('{username}', username);

  const textColor = isLightColor(network.color) ? '#000' : '#fff';

  // Animation shared values
  const animatedHeight = useSharedValue(focused ? focusedHeight : collapsedHeight);
  const animatedPadding = useSharedValue(focused ? 24 : 20);
  const animatedOpacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    const timingConfig = { duration: ANIMATION_DURATION, easing: Easing.out(Easing.cubic) };
    animatedHeight.value = withTiming(focused ? focusedHeight : collapsedHeight, timingConfig);
    animatedPadding.value = withTiming(focused ? 24 : 20, timingConfig);
    animatedOpacity.value = withTiming(focused ? 1 : 0, timingConfig);
  }, [focused, focusedHeight]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    paddingVertical: animatedPadding.value,
  }));

  const animatedHintStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
  }));

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
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: network.color,
            width: cardWidth,
          },
          animatedCardStyle,
        ]}>
        <View style={styles.animatedInner}>
          <View style={styles.cardRow}>
            <FontAwesome
              name={network.icon as any}
              size={focused ? 32 : 24}
              color={textColor}
            />
            <Text
              style={[
                focused ? styles.focusedName : styles.cardName,
                { color: textColor },
              ]}>
              {network.name}
            </Text>
            {!focused && (
              <Text style={[styles.cardUsername, { color: textColor }]}>
                @{username}
              </Text>
            )}
          </View>
          {focused && (
            <Animated.View style={[styles.focusedBottom, animatedHintStyle]}>
              <Text style={[styles.focusedUsername, { color: textColor }]}>
                @{username}
              </Text>
              <Text style={[styles.focusedHint, { color: textColor }]}>
                Hold for QR code
              </Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  animatedInner: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
