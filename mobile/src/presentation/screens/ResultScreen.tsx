import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatCOP } from '../../domain/format/money';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import { clearCart } from '../../application/store/slices/cart.slice';
import { resetCheckout } from '../../application/store/slices/checkout.slice';
import { loadProducts } from '../../application/usecases/load-products.usecase';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

type Visual = { icon: string; color: string; title: string; subtitle: string };

const APPROVED: Visual = {
  icon: '✓',
  color: colors.success,
  title: 'Payment approved',
  subtitle: 'Your product is on its way.',
};
const DECLINED: Visual = {
  icon: '✕',
  color: colors.error,
  title: 'Payment declined',
  subtitle: 'The card was declined. Please try another card.',
};
const PENDING: Visual = {
  icon: '…',
  color: colors.warning,
  title: 'Payment pending',
  subtitle: 'We are still confirming your payment.',
};

export const ResultScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { status, transaction, errorMessage } = useAppSelector(
    (state) => state.checkout,
  );

  const backToProducts = () => {
    dispatch(clearCart());
    dispatch(resetCheckout());
    dispatch(loadProducts());
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  if (status === 'processing') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.processing}>Processing payment…</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <View style={[styles.badge, { backgroundColor: colors.error }]}>
          <Text style={styles.badgeIcon}>!</Text>
        </View>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>{errorMessage}</Text>
        <TouchableOpacity style={styles.button} onPress={backToProducts}>
          <Text style={styles.buttonText}>Back to products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const visual =
    transaction?.status === 'APPROVED'
      ? APPROVED
      : transaction?.status === 'PENDING'
        ? PENDING
        : DECLINED;

  return (
    <View style={styles.center}>
      <View style={[styles.badge, { backgroundColor: visual.color }]}>
        <Text style={styles.badgeIcon}>{visual.icon}</Text>
      </View>
      <Text style={styles.title}>{visual.title}</Text>
      <Text style={styles.subtitle}>{visual.subtitle}</Text>

      {transaction && (
        <View style={styles.card}>
          <Row label="Reference" value={transaction.reference} />
          <Row label="Amount" value={formatCOP(transaction.amountInCents)} />
          <Row
            label="Card"
            value={`${transaction.cardBrand} •••• ${transaction.cardLastFour}`}
          />
          <Row label="Status" value={transaction.status} />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={backToProducts}>
        <Text style={styles.buttonText}>Back to products</Text>
      </TouchableOpacity>
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  processing: { marginTop: spacing.md, color: colors.textMuted, fontSize: 16 },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { fontSize: 44, color: colors.surface, fontWeight: '800' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  rowLabel: { fontSize: 14, color: colors.textMuted },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
    marginLeft: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
