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
import { colors, radius, spacing } from '../theme/colors';
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
      <View style={styles.row}>
        <Text style={styles.label}>Product</Text>
        <Text style={styles.value} numberOfLines={1}>
          {item.product.name}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Quantity</Text>
        <Text style={styles.value}>{item.quantity}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Card</Text>
        <View style={styles.cardValue}>
          <CardBrandLogo brand={brand} />
          <Text style={styles.value}> •••• {card.number.slice(-4)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total to pay</Text>
        <Text style={styles.totalValue}>{formatCOP(total)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onPay}
        disabled={loading}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: { fontSize: 15, color: colors.textMuted },
  value: { fontSize: 15, fontWeight: '600', color: colors.text, flexShrink: 1 },
  cardValue: { flexDirection: 'row', alignItems: 'center' },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: { fontSize: 17, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
