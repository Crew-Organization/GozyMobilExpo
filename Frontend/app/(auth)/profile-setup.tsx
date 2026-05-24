import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { AuthProgress } from '@/src/components/auth-progress';
import { Chip } from '@/src/components/chip';
import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { Category } from '@/src/types';

const interestOptions = [
  'Weekend trips',
  'Cafe hopping',
  'Premium movies',
  'Streetwear',
  'Backpacking',
  'Fitness',
];
const categoryOptions: Category[] = ['Travel', 'Food', 'Shopping', 'Entertainment'];

const previews = [
  {
    title: 'AI trip suggestions',
    body: 'Gozy learns the kind of trips and budgets you actually click.',
  },
  {
    title: 'Cleaner home feed',
    body: 'Travel, food, and shopping rows reorder around your top categories.',
  },
  {
    title: 'Smarter booking prompts',
    body: 'Wallet nudges, better offers, and near-you picks become more relevant.',
  },
];

export default function ProfileSetupScreen() {
  const { session, completeProfile } = useApp();
  const [name, setName] = useState('Sandeep');
  const [city, setCity] = useState(session?.user.city ?? 'Bengaluru');
  const [budget, setBudget] = useState(session?.user.budget ?? 'Rs 15k - 25k');
  const [interests, setInterests] = useState<string[]>([
    'Weekend trips',
    'Cafe hopping',
    'Streetwear',
  ]);
  const [categories, setCategories] = useState<Category[]>(['Travel', 'Food', 'Shopping']);

  const ready = useMemo(
    () =>
      Boolean(name.trim() && city.trim() && budget.trim() && interests.length && categories.length),
    [budget, categories.length, city, interests.length, name],
  );

  const toggleInterest = (value: string) => {
    setInterests((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const toggleCategory = (value: Category) => {
    setCategories((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const handleContinue = async () => {
    if (!ready) {
      return;
    }

    await completeProfile({
      name,
      city,
      budget,
      interests,
      preferredCategories: categories,
    });
    router.replace('/(home)');
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <AuthProgress currentStep={3} />

      <View style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>Profile setup</Text>
          <Text style={styles.title}>Tune the app so your feed, offers, and bookings feel personal from day one.</Text>
          <Text style={styles.subtitle}>
            These choices drive AI recommendations, category ordering, saved picks, and smarter prompts inside Gozy.
          </Text>
        </View>
        <Image
          contentFit="cover"
          source={{
            uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroImage}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
        {previews.map((preview) => (
          <View key={preview.title} style={styles.previewCard}>
            <Text style={styles.previewTitle}>{preview.title}</Text>
            <Text style={styles.previewBody}>{preview.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.card}>
        <TextInput
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={name}
        />
        <TextInput
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={city}
        />
        <TextInput
          onChangeText={setBudget}
          placeholder="Budget"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={budget}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.chips}>
            {interestOptions.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                onPress={() => toggleInterest(interest)}
                selected={interests.includes(interest)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority categories</Text>
          <View style={styles.chips}>
            {categoryOptions.map((category) => (
              <Chip
                key={category}
                label={category}
                onPress={() => toggleCategory(category)}
                selected={categories.includes(category)}
              />
            ))}
          </View>
        </View>

        <Pressable
          disabled={!ready}
          onPress={handleContinue}
          style={[styles.primaryButton, !ready && styles.disabled]}>
          <Text style={styles.primaryButtonText}>Launch Gozy</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  heroCopy: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  heroImage: {
    width: '100%',
    height: 150,
  },
  previewRow: {
    gap: spacing.md,
  },
  previewCard: {
    width: 220,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  previewBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
    gap: spacing.md,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: typography.body,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  primaryButton: {
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sky,
    marginTop: spacing.sm,
  },
  disabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
