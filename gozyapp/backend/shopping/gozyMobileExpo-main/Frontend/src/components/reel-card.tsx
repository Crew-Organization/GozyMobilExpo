import { useCallback, useEffect, useMemo, useRef } from 'react';
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
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, gradients, radius, spacing, typography } from '@/src/theme/tokens';
import type { Experience, SwipeDirection } from '@/src/types';

type ReelCardProps = {
  experience: Experience;
  active: boolean;
  onBook: (experience: Experience) => void;
  onSwipe: (experienceId: string, direction: SwipeDirection) => void;
};

const { width: screenWidth } = Dimensions.get('window');
const swipeThreshold = 90;

export function ReelCard({ experience, active, onBook, onSwipe }: ReelCardProps) {
  const translate = useRef(new Animated.ValueXY()).current;
  const videoRef = useRef<Video | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (active) {
      videoRef.current.playAsync().catch(() => undefined);
      return;
    }

    videoRef.current.pauseAsync().catch(() => undefined);
  }, [active]);

  const finishSwipe = useCallback((direction: SwipeDirection) => {
    Animated.timing(translate, {
      toValue: { x: direction === 'right' ? screenWidth : -screenWidth, y: 0 },
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      translate.setValue({ x: 0, y: 0 });
      onSwipe(experience.id, direction);
    });
  }, [experience.id, onSwipe, translate]);

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
            friction: 7,
          }).start();
        },
      }),
    [finishSwipe, translate],
  );

  const rotation = translate.x.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['-7deg', '0deg', '7deg'],
  });

  const likeOpacity = translate.x.interpolate({
    inputRange: [0, swipeThreshold, 170],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = translate.x.interpolate({
    inputRange: [-170, -swipeThreshold, 0],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.card,
        {
          transform: [{ translateX: translate.x }, { rotate: rotation }],
        },
      ]}>
      <Image source={experience.posterUrl} style={StyleSheet.absoluteFillObject} />
      <Video
        isLooping
        isMuted
        ref={videoRef}
        resizeMode={ResizeMode.COVER}
        shouldPlay={active}
        source={{ uri: experience.videoUrl }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFillObject} />
      <Animated.View style={[styles.swipePill, styles.likePill, { opacity: likeOpacity }]}>
        <Text style={styles.swipePillText}>Save</Text>
      </Animated.View>
      <Animated.View style={[styles.swipePill, styles.skipPill, { opacity: skipOpacity }]}>
        <Text style={styles.swipePillText}>Skip</Text>
      </Animated.View>

      <View style={styles.topMeta}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>AI reel</Text>
        </View>
        <Text style={styles.duration}>{experience.duration}</Text>
      </View>

      <View style={styles.bottomContent}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{experience.category}</Text>
        </View>
        <Text style={styles.title}>{experience.title}</Text>
        <Text style={styles.subtitle}>{experience.subtitle}</Text>
        <Text style={styles.description}>{experience.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <MaterialCommunityIcons color={colors.text} name="map-marker-outline" size={16} />
            <Text style={styles.infoText}>{experience.location}</Text>
          </View>
          <View style={styles.infoChip}>
            <MaterialCommunityIcons color={colors.text} name="star-four-points" size={16} />
            <Text style={styles.infoText}>{experience.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          {experience.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>{experience.priceLabel}</Text>
            <Text style={styles.brandCue}>{experience.brandCue}</Text>
          </View>
          <View style={styles.actionRow}>
            <Pressable onPress={() => onSwipe(experience.id, 'left')} style={styles.secondaryAction}>
              <MaterialCommunityIcons color={colors.text} name="close" size={22} />
            </Pressable>
            <Pressable onPress={() => onBook(experience)} style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>{experience.cta}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 600,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 20 },
  },
  topMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(7, 17, 31, 0.54)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  liveText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: typography.caption,
  },
  duration: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  bottomContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(84, 200, 255, 0.18)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  categoryText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
  subtitle: {
    color: colors.aqua,
    fontSize: typography.body,
    fontWeight: '700',
  },
  description: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  infoText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(7,17,31,0.52)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  tagText: {
    color: colors.text,
    fontSize: typography.caption,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  priceLabel: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  brandCue: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primaryAction: {
    minWidth: 118,
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  primaryActionText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  secondaryAction: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  swipePill: {
    position: 'absolute',
    top: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 2,
    zIndex: 2,
  },
  likePill: {
    right: spacing.lg,
    borderColor: colors.success,
    backgroundColor: 'rgba(61, 213, 152, 0.14)',
  },
  skipPill: {
    left: spacing.lg,
    borderColor: colors.coral,
    backgroundColor: 'rgba(255, 130, 104, 0.16)',
  },
  swipePillText: {
    color: colors.text,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
