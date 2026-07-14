import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { Transaction, TransactionStatus } from '../../domain/models';
import { formatDateTime } from '../../domain/format/date';
import { formatCOP } from '../../domain/format/money';
import { useAppSelector } from '../../application/store/hooks';
import { colors, radius, shadow, spacing } from '../theme/colors';

const STATUS_STYLE: Record<TransactionStatus, { fg: string; bg: string }> = {
  APPROVED: { fg: colors.success, bg: colors.successLight },
  DECLINED: { fg: colors.error, bg: colors.errorLight },
  ERROR: { fg: colors.error, bg: colors.errorLight },
  VOIDED: { fg: colors.textMuted, bg: colors.borderLight },
  PENDING: { fg: colors.warning, bg: colors.warningLight },
};

const HistoryRow = ({ transaction }: { transaction: Transaction }) => {
  const badge = STATUS_STYLE[transaction.status];
  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <View style={styles.leftCol}>
          <Text style={styles.amount}>
            {formatCOP(transaction.amountInCents)}
          </Text>
          <Text style={styles.meta}>
            {transaction.cardBrand} •••• {transaction.cardLastFour} · Qty{' '}
            {transaction.quantity}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.fg }]}>
            {transaction.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.rowBottom}>
        <Text style={styles.reference} numberOfLines={1}>
          {transaction.reference}
        </Text>
        <Text style={styles.date}>{formatDateTime(transaction.createdAt)}</Text>
      </View>
    </View>
  );
};

export const HistoryScreen = () => {
  const items = useAppSelector((state) => state.history.items);

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>🧾</Text>
        </View>
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
      style={styles.screen}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <HistoryRow transaction={item} />}
    />
  );
};

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  list: { padding: spacing.md },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  emptyIconText: { fontSize: 32 },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: colors.text },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftCol: { flex: 1 },
  amount: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 3 },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reference: { fontSize: 11, color: colors.textMuted, flex: 1 },
  date: { fontSize: 12, color: colors.textMuted, marginLeft: spacing.sm },
});
