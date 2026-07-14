import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
};

export const QuantitySelector = ({ value, min = 1, max, onChange }: Props) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canDecrease && styles.buttonDisabled]}
        onPress={() => canDecrease && onChange(value - 1)}
        disabled={!canDecrease}
        activeOpacity={0.7}
        testID="quantity-decrease"
      >
        <Text style={styles.symbol}>−</Text>
      </TouchableOpacity>

      <Text style={styles.value} testID="quantity-value">
        {value}
      </Text>

      <TouchableOpacity
        style={[styles.button, !canIncrease && styles.buttonDisabled]}
        onPress={() => canIncrease && onChange(value + 1)}
        disabled={!canIncrease}
        activeOpacity={0.7}
        testID="quantity-increase"
      >
        <Text style={styles.symbol}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 4,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.35 },
  symbol: { fontSize: 22, fontWeight: '700', color: colors.primary },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
  },
});
