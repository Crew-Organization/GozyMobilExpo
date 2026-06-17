import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type MediaCardProps = {
  image: string;
  title: string;
  subtitle?: string;
  meta?: string;
  priceLabel?: string;
  badge?: string;
  width?: number;
  compact?: boolean;
  onPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MediaCard({
  image,
  title,
  subtitle,
  meta,
  priceLabel,
  badge,
  width = 240,
  compact = false,
  onPress,
}: MediaCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, { width }, animatedStyle]}
    >
      <View style={styles.imageWrap}>
        <Image 
          contentFit="cover" 
          source={{ uri: image }} 
          style={[styles.image, compact ? styles.imageCompact : null]} 
          transition={400}
        />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.mainInfo}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        
        <View style={styles.footerRow}>
          <View style={styles.metaWrap}>
            {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          </View>
          {priceLabel ? (
            <View style={styles.priceTag}>
              <Text style={styles.price}>{priceLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  imageCompact: {
    height: 110,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    borderRadius: radius.xs,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeText: {
    color: colors.text,
    fontSize: typography.tiny,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  mainInfo: {
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  metaWrap: {
    flex: 1,
  },
  meta: {
    color: colors.textLight,
    fontSize: typography.tiny,
    fontWeight: '600',
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.xs,
  },
  price: {
    color: colors.sky,
    fontSize: typography.tiny,
    fontWeight: '800',
  },
});
