import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCOP } from '../../domain/format/money';
import type { Product } from '../../domain/models';
import { colors, radius, shadow, spacing } from '../theme/colors';
import { FadeInImage } from './FadeInImage';

type Props = {
  product: Product;
  onPress: (product: Product) => void;
};

export const ProductCard = ({ product, onPress }: Props) => {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const dotColor = outOfStock
    ? colors.error
    : lowStock
      ? colors.warning
      : colors.success;

  return (
    <TouchableOpacity
      style={[styles.card, outOfStock && styles.cardDisabled]}
      onPress={() => onPress(product)}
      disabled={outOfStock}
      activeOpacity={0.85}
      testID={`product-card-${product.id}`}
    >
      <View style={styles.imageWrap}>
        <FadeInImage uri={product.imageUrl} style={styles.image} />
        <View style={styles.imageOverlay} />
        <View style={styles.stockBadge}>
          <View style={[styles.stockDot, { backgroundColor: dotColor }]} />
          <Text style={styles.stockBadgeText}>
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.price}>{formatCOP(product.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    margin: spacing.xs,
    overflow: 'hidden',
    ...shadow.md,
  },
  cardDisabled: { opacity: 0.55 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 130, backgroundColor: colors.borderLight },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  stockBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  stockBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  info: { padding: spacing.md },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  description: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
    minHeight: 32,
    lineHeight: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginTop: spacing.sm,
    letterSpacing: -0.3,
  },
});
