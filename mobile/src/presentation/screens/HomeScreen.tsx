import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
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
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.muted}>Loading products…</Text>
      </View>
    );
  }

  if (status === 'failed' && items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.muted}>{errorMessage}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(loadProducts())}
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
      contentContainerStyle={styles.list}
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
  list: { padding: spacing.sm, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  muted: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorTitle: { fontSize: 18, fontWeight: '700', color: colors.error },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  retryText: { color: colors.surface, fontWeight: '700' },
});
