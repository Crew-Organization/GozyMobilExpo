import React from "react";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, gradients, radius, spacing, typography } from '@/src/theme/tokens';

type WalletCardProps = {
  balance: number;
  onAddMoney: (amount: number) => void;
};

export function WalletCard({ balance, onAddMoney }: WalletCardProps) {
  return (
    <LinearGradient colors={gradients.sky} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Gozy Wallet</Text>
          <Text style={styles.balance}>Rs {balance.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons color={colors.text} name="wallet-bifold" size={22} />
        </View>
      </View>
      <Text style={styles.subtitle}>
        One tap to fund bookings, food orders, ticket holds, and last-minute ride splits.
      </Text>
      <View style={styles.actions}>
        {[500, 1000, 2500].map((amount) => (
          <Pressable key={amount} onPress={() => onAddMoney(amount)} style={styles.actionButton}>
            <Text style={styles.actionText}>+Rs {amount}</Text>
          </Pressable>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  balance: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: typography.body,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
  },
  actionText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
