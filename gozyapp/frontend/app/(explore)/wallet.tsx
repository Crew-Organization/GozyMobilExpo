import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { MetricCard } from '@/src/components/metric-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { WalletCard } from '@/src/components/wallet-card';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function WalletScreen() {
  const { walletBalance, transactions, addMoney } = useApp();

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Payments and rewards"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        subtitle="Mock payment rails, cashback history, and one wallet for every booking flow."
        title="Gozy Wallet"
      />

      <WalletCard balance={walletBalance} onAddMoney={(amount) => void addMoney(amount)} />

      <View style={styles.metricsRow}>
        <MetricCard
          helper="Live balance for bookings and group splits"
          label="Available"
          tone={colors.aqua}
          value={`Rs ${walletBalance}`}
        />
        <MetricCard
          helper="Reward engine across retail and food"
          label="Cashback"
          tone={colors.mint}
          value="Rs 240"
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionRow}>
            <View>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionMeta}>{transaction.createdAt.slice(0, 10)}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === 'credit' ? styles.credit : styles.debit,
              ]}>
              {transaction.type === 'credit' ? '+' : '-'}Rs {transaction.amount}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Checkout ready</Text>
        <Text style={styles.checkoutBody}>
          The backend contract includes wallet top-up, transaction history, and mock payment
          confirmation endpoints so the mobile flow can be swapped to a live gateway later.
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sectionCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
  },
  transactionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  transactionMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 3,
  },
  transactionAmount: {
    fontSize: typography.body,
    fontWeight: '800',
  },
  credit: {
    color: colors.mint,
  },
  debit: {
    color: colors.coral,
  },
  checkoutBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
