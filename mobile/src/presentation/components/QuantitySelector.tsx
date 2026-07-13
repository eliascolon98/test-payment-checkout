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
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  symbol: { fontSize: 22, fontWeight: '700', color: colors.primary },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    minWidth: 48,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
});
