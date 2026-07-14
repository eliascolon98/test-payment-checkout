import { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatCOP } from '../../domain/format/money';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import { selectItem } from '../../application/store/slices/cart.slice';
import { QuantitySelector } from '../components/QuantitySelector';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, shadow, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen = ({ route, navigation }: Props) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) =>
    state.products.items.find((p) => p.id === route.params.productId),
  );
  const [quantity, setQuantity] = useState(1);

  const total = useMemo(
    () => (product ? product.price * quantity : 0),
    [product, quantity],
  );

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Product not found</Text>
      </View>
    );
  }

  const onContinue = () => {
    dispatch(selectItem({ product, quantity }));
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.body}>
          <View style={styles.stockPill}>
            <View style={styles.stockDot} />
            <Text style={styles.stockPillText}>
              {product.stock} units available
            </Text>
          </View>

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatCOP(product.price)}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.quantityCard}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <QuantitySelector
              value={quantity}
              max={product.stock}
              onChange={setQuantity}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCOP(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.cta}
          onPress={onContinue}
          activeOpacity={0.9}
          testID="continue-checkout"
        >
          <Text style={styles.ctaText}>Continue</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.lg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  muted: { color: colors.textMuted, fontSize: 15 },
  imageWrap: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    maxHeight: 280,
    backgroundColor: colors.borderLight,
  },
  body: { padding: spacing.lg },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  stockPillText: { fontSize: 12, fontWeight: '700', color: colors.success },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginTop: spacing.xs,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 23,
  },
  quantityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    ...shadow.sm,
  },
  quantityLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadow.lg,
  },
  footerInfo: { flex: 1 },
  totalLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    ...shadow.md,
  },
  ctaText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  ctaArrow: { color: colors.surface, fontWeight: '700', fontSize: 18, marginLeft: spacing.sm },
});
