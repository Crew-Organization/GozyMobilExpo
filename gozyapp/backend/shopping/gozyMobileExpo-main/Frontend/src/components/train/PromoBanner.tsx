import { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  trainResultsPalette,
  trainResultsRadius,
  trainResultsShadow,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

type PromoBannerProps =
  | {
      variant: 'refund' | 'freeCancellation';
    }
  | {
      variant: 'aadhaar';
    };

export const PromoBanner = memo(function PromoBanner(props: PromoBannerProps) {
  if (props.variant === 'aadhaar') {
    return (
      <View style={styles.aadhaarCard}>
        <View style={styles.aadhaarBadge}>
          <Text style={styles.aadhaarBadgeText}>AADHAAR</Text>
        </View>
        <Text style={styles.aadhaarBody}>Link your Aadhaar Card to IRCTC to book Tatkal tickets.</Text>
        <Pressable style={({ pressed }) => pressed && styles.pressed}>
          <Text style={styles.aadhaarLink}>Link Aadhaar</Text>
        </Pressable>
      </View>
    );
  }

  const config =
    props.variant === 'refund'
      ? {
          icon: 'ticket-confirmation-outline' as const,
          iconBackground: '#F2C5FF',
          title: 'Confirmed Ticket or 3x Refund',
          body: 'Trip Guarantee is now Alternate Trip Plan with same benefits',
        }
      : {
          icon: 'shield-check-outline' as const,
          iconBackground: '#D5EBFF',
          title: 'Free Cancellation',
          body: 'Zero cancellation fee on ticket cancellation',
        };

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, { backgroundColor: config.iconBackground }]}>
        <MaterialCommunityIcons color={trainResultsPalette.primaryBlue} name={config.icon} size={26} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.body}>{config.body}</Text>
      </View>
      <MaterialCommunityIcons color={trainResultsPalette.primaryBlue} name="chevron-right" size={22} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 292,
    minHeight: 84,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: trainResultsRadius.lg,
    borderWidth: 1,
    borderColor: '#D7EAFB',
    backgroundColor: trainResultsPalette.surface,
    flexDirection: 'row',
    alignItems: 'center',
    ...trainResultsShadow,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    ...trainResultsType.trainTitle,
    color: trainResultsPalette.textPrimary,
    fontSize: 14,
    lineHeight: 18,
  },
  body: {
    ...trainResultsType.caption,
    color: trainResultsPalette.textSecondary,
    marginTop: 4,
  },
  aadhaarCard: {
    marginHorizontal: trainResultsSpacing.sm,
    marginTop: trainResultsSpacing.sm,
    paddingHorizontal: trainResultsSpacing.sm,
    paddingVertical: trainResultsSpacing.sm,
    borderRadius: trainResultsRadius.sm,
    backgroundColor: '#FFF8E1',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aadhaarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#F4E3AA',
    backgroundColor: trainResultsPalette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  aadhaarBadgeText: {
    ...trainResultsType.tiny,
    color: '#D97706',
    fontFamily: trainResultsType.trainTitle.fontFamily,
    fontSize: 6.5,
  },
  aadhaarBody: {
    ...trainResultsType.body,
    flex: 1,
    color: '#4B5563',
    paddingRight: 8,
  },
  aadhaarLink: {
    ...trainResultsType.body,
    color: trainResultsPalette.primaryBlue,
    fontFamily: trainResultsType.trainTitle.fontFamily,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
