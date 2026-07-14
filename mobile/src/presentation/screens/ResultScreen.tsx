import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
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
import { colors, radius, shadow, spacing } from '../theme/colors';
import { showErrorToast } from '../utils/toast';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

type Visual = {
  icon: string;
  color: string;
  halo: string;
  title: string;
  subtitle: string;
};

const APPROVED: Visual = {
  icon: '✓',
  color: colors.success,
  halo: colors.successLight,
  title: 'Payment approved',
  subtitle: 'Your product is on its way.',
};
const DECLINED: Visual = {
  icon: '✕',
  color: colors.error,
  halo: colors.errorLight,
  title: 'Payment declined',
  subtitle: 'The card was declined. Please try another card.',
};
const PENDING: Visual = {
  icon: '…',
  color: colors.warning,
  halo: colors.warningLight,
  title: 'Payment pending',
  subtitle: 'We are still confirming your payment.',
};

export const ResultScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { status, transaction, errorMessage } = useAppSelector(
    (state) => state.checkout,
  );
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'processing') {
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      tension: 70,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [status, scale]);

  useEffect(() => {
    if (status === 'error') {
      showErrorToast(errorMessage ?? 'The payment could not be processed');
    } else if (status === 'success' && transaction?.status === 'DECLINED') {
      showErrorToast('Your card was declined. Please try another card.');
    }
  }, [status, transaction, errorMessage]);

  const backToProducts = () => {
    dispatch(clearCart());
    dispatch(resetCheckout());
    dispatch(loadProducts());
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  if (status === 'processing') {
    return (
      <View style={styles.center}>
        <View style={styles.spinnerHalo}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Text style={styles.processing}>Processing payment…</Text>
        <Text style={styles.processingSub}>This will only take a moment</Text>
      </View>
    );
  }

  const visual: Visual & { isError?: boolean } =
    status === 'error'
      ? {
          icon: '!',
          color: colors.error,
          halo: colors.errorLight,
          title: 'Something went wrong',
          subtitle: errorMessage ?? 'The payment could not be processed',
          isError: true,
        }
      : transaction?.status === 'APPROVED'
        ? APPROVED
        : transaction?.status === 'PENDING'
          ? PENDING
          : DECLINED;

  return (
    <View style={styles.center}>
      <Animated.View style={[styles.halo, { backgroundColor: visual.halo, transform: [{ scale }] }]}>
        <View style={[styles.badge, { backgroundColor: visual.color }]}>
          <Text style={styles.badgeIcon}>{visual.icon}</Text>
        </View>
      </Animated.View>

      <Text style={styles.title}>{visual.title}</Text>
      <Text style={styles.subtitle}>{visual.subtitle}</Text>

      {!visual.isError && transaction && (
        <View style={styles.card}>
          <Row label="Reference" value={transaction.reference} />
          <View style={styles.rowDivider} />
          <Row label="Amount" value={formatCOP(transaction.amountInCents)} />
          <View style={styles.rowDivider} />
          <Row
            label="Card"
            value={`${transaction.cardBrand} •••• ${transaction.cardLastFour}`}
          />
          <View style={styles.rowDivider} />
          <Row label="Status" value={transaction.status} highlight={visual.color} />
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={backToProducts}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>Back to products</Text>
      </TouchableOpacity>
    </View>
  );
};

const Row = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: string;
}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text
      style={[styles.rowValue, highlight ? { color: highlight } : null]}
      numberOfLines={1}
    >
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
  spinnerHalo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processing: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  processingSub: { marginTop: spacing.xs, color: colors.textMuted, fontSize: 14 },
  halo: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    lineHeight: 21,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    ...shadow.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rowDivider: { height: 1, backgroundColor: colors.borderLight },
  rowLabel: { fontSize: 14, color: colors.textMuted },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
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
    ...shadow.md,
  },
  buttonText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
