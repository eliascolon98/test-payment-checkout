import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CardData, CartItem } from '../../domain/models';
import { formatCOP } from '../../domain/format/money';
import { detectCardBrand } from '../../domain/rules/card';
import { colors, radius, shadow, spacing } from '../theme/colors';
import { CardBrandLogo } from './CardBrandLogo';

type Props = {
  item: CartItem;
  card: CardData;
  total: number;
  loading: boolean;
  onPay: () => void;
};

export const PaymentSummary = ({ item, card, total, loading, onPay }: Props) => {
  const brand = detectCardBrand(card.number);

  return (
    <View>
      <View style={styles.detailCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Product</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.product.name}
          </Text>
        </View>
        <View style={styles.rowDivider} />
        <View style={styles.row}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.value}>{item.quantity}</Text>
        </View>
        <View style={styles.rowDivider} />
        <View style={styles.row}>
          <Text style={styles.label}>Card</Text>
          <View style={styles.cardValue}>
            <CardBrandLogo brand={brand} />
            <Text style={styles.value}> •••• {card.number.slice(-4)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total to pay</Text>
        <Text style={styles.totalValue}>{formatCOP(total)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onPay}
        disabled={loading}
        activeOpacity={0.9}
        testID="confirm-payment"
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <Text style={styles.buttonText}>Pay {formatCOP(total)}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  detailCard: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowDivider: { height: 1, backgroundColor: colors.border },
  label: { fontSize: 15, color: colors.textSecondary },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  cardValue: { flexDirection: 'row', alignItems: 'center' },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryGhost,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    ...shadow.md,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
