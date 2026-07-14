import { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CardData } from '../../domain/models';
import { formatCOP } from '../../domain/format/money';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import { processPayment } from '../../application/usecases/process-payment.usecase';
import { Backdrop } from '../components/Backdrop';
import { CardForm } from '../components/CardForm';
import { PaymentSummary } from '../components/PaymentSummary';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadow, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const CheckoutScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.cart.item);
  const [email, setEmail] = useState('');
  const [card, setCard] = useState<CardData | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const total = useMemo(
    () => (item ? item.product.price * item.quantity : 0),
    [item],
  );

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Your cart is empty</Text>
      </View>
    );
  }

  const emailOk = isValidEmail(email);

  const onCardSubmit = (submitted: CardData) => {
    setCard(submitted);
    setShowCardForm(false);
    setShowSummary(true);
  };

  const onPay = () => {
    if (!card) {
      return;
    }
    setShowSummary(false);
    dispatch(
      processPayment({
        productId: item.product.id,
        quantity: item.quantity,
        customerEmail: email,
        installments: 1,
        card,
      }),
    );
    navigation.navigate('Result');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Your order</Text>
      <View style={styles.card}>
        <Image source={{ uri: item.product.imageUrl }} style={styles.image} />
        <View style={styles.itemInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {item.product.name}
          </Text>
          <Text style={styles.unit}>{formatCOP(item.product.price)} each</Text>
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyBadgeText}>Qty {item.quantity}</Text>
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCOP(total)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryFree}>Free</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCOP(total)}</Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email for the receipt</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          placeholderTextColor={colors.textMuted}
          testID="input-email"
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, !emailOk && styles.payButtonDisabled]}
        onPress={() => setShowCardForm(true)}
        disabled={!emailOk}
        activeOpacity={0.9}
        testID="pay-with-card"
      >
        <Text style={styles.payIcon}>💳</Text>
        <Text style={styles.payText}>Pay with credit card</Text>
      </TouchableOpacity>

      <Backdrop
        visible={showCardForm}
        title="Credit card"
        onClose={() => setShowCardForm(false)}
      >
        <CardForm onSubmit={onCardSubmit} />
      </Backdrop>

      <Backdrop
        visible={showSummary}
        title="Payment summary"
        onClose={() => setShowSummary(false)}
      >
        {card && (
          <PaymentSummary
            item={item}
            card={card}
            total={total}
            loading={false}
            onPay={onPay}
          />
        )}
      </Backdrop>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  muted: { color: colors.textMuted, fontSize: 15 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
  },
  itemInfo: { flex: 1, marginLeft: spacing.md, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  unit: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  qtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryGhost,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  qtyBadgeText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadow.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  summaryLabel: { fontSize: 15, color: colors.textSecondary },
  summaryValue: { fontSize: 15, color: colors.text, fontWeight: '600' },
  summaryFree: { fontSize: 15, color: colors.success, fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  totalLabel: { fontSize: 17, fontWeight: '800', color: colors.text },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  field: { marginTop: spacing.lg },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  payButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    ...shadow.md,
  },
  payButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
    ...shadow.sm,
  },
  payIcon: { fontSize: 16 },
  payText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
