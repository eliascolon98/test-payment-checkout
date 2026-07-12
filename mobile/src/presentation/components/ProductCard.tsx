import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCOP } from '../../domain/format/money';
import type { Product } from '../../domain/models';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  product: Product;
  onPress: (product: Product) => void;
};

export const ProductCard = ({ product, onPress }: Props) => {
  const outOfStock = product.stock === 0;

  return (
    <TouchableOpacity
      style={[styles.card, outOfStock && styles.cardDisabled]}
      onPress={() => onPress(product)}
      disabled={outOfStock}
      testID={`product-card-${product.id}`}
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.price}>{formatCOP(product.price)}</Text>
        <Text style={[styles.stock, outOfStock && styles.stockOut]}>
          {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    margin: spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDisabled: { opacity: 0.5 },
  image: { width: '100%', height: 120, backgroundColor: colors.border },
  info: { padding: spacing.sm },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  description: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    minHeight: 32,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  stock: { fontSize: 12, color: colors.success, marginTop: 2 },
  stockOut: { color: colors.error },
});
