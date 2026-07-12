import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product detail</Text>
      <Text style={styles.subtitle}>Screen placeholder — select quantity</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Checkout')}
      >
        <Text style={styles.buttonText}>Go to checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: spacing.xs },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  buttonText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
