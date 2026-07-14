import { useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Product } from '../../domain/models';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import { loadProducts } from '../../application/usecases/load-products.usecase';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.greeting}>Discover</Text>
    <Text style={styles.title}>Featured products</Text>
  </View>
);

export const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { items, status, errorMessage } = useAppSelector(
    (state) => state.products,
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadProducts());
    }
  }, [dispatch, status]);

  const openProduct = useCallback(
    (product: Product) =>
      navigation.navigate('ProductDetail', { productId: product.id }),
    [navigation],
  );

  if (status === 'loading' && items.length === 0) {
    return (
      <View style={styles.screen}>
        <Header />
        <View style={styles.skeletonGrid}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </View>
    );
  }

  if (status === 'failed' && items.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>!</Text>
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.muted}>{errorMessage}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(loadProducts())}
          activeOpacity={0.85}
        >
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      style={styles.screen}
      contentContainerStyle={styles.list}
      ListHeaderComponent={Header}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={openProduct} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={status === 'loading'}
          onRefresh={() => dispatch(loadProducts())}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.muted}>No products available</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.sm, paddingBottom: spacing.lg },
  header: { paddingHorizontal: spacing.sm, paddingTop: spacing.md, paddingBottom: spacing.sm },
  greeting: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  muted: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  errorIconText: { fontSize: 32, fontWeight: '800', color: colors.error },
  errorTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  retryText: { color: colors.surface, fontWeight: '700', fontSize: 15 },
});
