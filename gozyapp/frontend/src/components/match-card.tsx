import { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, gradients, radius, spacing, typography } from '@/src/theme/tokens';
import type { MatchProfile, SwipeDirection } from '@/src/types';

type MatchCardProps = {
  match: MatchProfile;
  onSwipe: (matchId: string, direction: SwipeDirection) => void;
};

const swipeThreshold = 80;
const { width: screenWidth } = Dimensions.get('window');

export function MatchCard({ match, onSwipe }: MatchCardProps) {
  const translate = useRef(new Animated.ValueXY()).current;

  const finishSwipe = useCallback((direction: SwipeDirection) => {
    Animated.timing(translate, {
      toValue: { x: direction === 'right' ? screenWidth : -screenWidth, y: 0 },
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      translate.setValue({ x: 0, y: 0 });
      onSwipe(match.id, direction);
    });
  }, [match.id, onSwipe, translate]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderMove: Animated.event([null, { dx: translate.x }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > swipeThreshold) {
            finishSwipe('right');
            return;
          }

          if (gestureState.dx < -swipeThreshold) {
            finishSwipe('left');
            return;
          }

          Animated.spring(translate, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        },
      }),
    [finishSwipe, translate],
  );

  const rotation = translate.x.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['-6deg', '0deg', '6deg'],
  });

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[styles.card, { transform: [{ translateX: translate.x }, { rotate: rotation }] }]}>
      <Image source={match.avatar} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFillObject} />
      <View style={styles.compatibility}>
        <Text style={styles.compatibilityText}>{match.compatibility}% match</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>
          {match.name}, {match.age}
        </Text>
        <Text style={styles.destination}>{match.destination}</Text>
        <Text style={styles.bio}>{match.bio}</Text>

        <View style={styles.metaWrap}>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons color={colors.text} name="map-marker-outline" size={16} />
            <Text style={styles.metaText}>{match.location}</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons color={colors.text} name="wallet-outline" size={16} />
            <Text style={styles.metaText}>{match.budget}</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons color={colors.text} name="airplane-takeoff" size={16} />
            <Text style={styles.metaText}>{match.nextTrip}</Text>
          </View>
        </View>

        <View style={styles.interests}>
          {match.interests.map((interest) => (
            <View key={interest} style={styles.interestChip}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => onSwipe(match.id, 'left')} style={styles.reject}>
            <MaterialCommunityIcons color={colors.text} name="close" size={22} />
          </Pressable>
          <Pressable onPress={() => onSwipe(match.id, 'right')} style={styles.accept}>
            <Text style={styles.acceptText}>Connect</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 520,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'space-between',
  },
  compatibility: {
    margin: spacing.md,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(84, 200, 255, 0.18)',
  },
  compatibilityText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  destination: {
    color: colors.aqua,
    fontSize: typography.body,
    fontWeight: '700',
  },
  bio: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  metaWrap: {
    gap: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  metaText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    backgroundColor: 'rgba(7,17,31,0.52)',
  },
  interestText: {
    color: colors.text,
    fontSize: typography.caption,
  },
  actions: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  reject: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  accept: {
    flex: 1,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint,
  },
  acceptText: {
    color: colors.canvas,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
