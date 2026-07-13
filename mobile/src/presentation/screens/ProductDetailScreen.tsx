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
import { colors, radius, spacing } from '../theme/colors';

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
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.body}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatCOP(product.price)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.stock}>{product.stock} units available</Text>

          <View style={styles.quantityRow}>
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
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCOP(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.cta}
          onPress={onContinue}
          testID="continue-checkout"
        >
          <Text style={styles.ctaText}>Continue</Text>
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
  muted: { color: colors.textMuted },
  image: { width: '100%', height: 260, backgroundColor: colors.border },
  body: { padding: spacing.lg },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  description: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  stock: { fontSize: 14, color: colors.success, marginTop: spacing.md },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  quantityLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontSize: 13, color: colors.textMuted },
  totalValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  ctaText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
