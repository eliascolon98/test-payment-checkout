import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { Transaction, TransactionStatus } from '../../domain/models';
import { formatDateTime } from '../../domain/format/date';
import { formatCOP } from '../../domain/format/money';
import { useAppSelector } from '../../application/store/hooks';
import { colors, radius, spacing } from '../theme/colors';

const STATUS_COLOR: Record<TransactionStatus, string> = {
  APPROVED: colors.success,
  DECLINED: colors.error,
  ERROR: colors.error,
  VOIDED: colors.textMuted,
  PENDING: colors.warning,
};

const HistoryRow = ({ transaction }: { transaction: Transaction }) => (
  <View style={styles.card}>
    <View style={styles.rowTop}>
      <Text style={styles.amount}>{formatCOP(transaction.amountInCents)}</Text>
      <View
        style={[
          styles.badge,
          { backgroundColor: STATUS_COLOR[transaction.status] },
        ]}
      >
        <Text style={styles.badgeText}>{transaction.status}</Text>
      </View>
    </View>
    <Text style={styles.meta}>
      {transaction.cardBrand} •••• {transaction.cardLastFour} · Qty{' '}
      {transaction.quantity}
    </Text>
    <Text style={styles.date}>{formatDateTime(transaction.createdAt)}</Text>
    <Text style={styles.reference}>{transaction.reference}</Text>
  </View>
);

export const HistoryScreen = () => {
  const items = useAppSelector((state) => state.history.items);

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No purchases yet</Text>
        <Text style={styles.emptySubtitle}>
          Your completed transactions will appear here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <HistoryRow transaction={item} />}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: spacing.md, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: { fontSize: 18, fontWeight: '800', color: colors.text },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.surface, fontSize: 11, fontWeight: '800' },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
  date: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  reference: { fontSize: 11, color: colors.textMuted, marginTop: spacing.xs },
});
