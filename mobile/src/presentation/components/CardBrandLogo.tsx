import { StyleSheet, Text, View } from 'react-native';
import type { CardBrand } from '../../domain/rules/card';

type Props = { brand: CardBrand };

export const CardBrandLogo = ({ brand }: Props) => {
  if (brand === 'VISA') {
    return (
      <View style={styles.container} testID="brand-visa">
        <Text style={styles.visa}>VISA</Text>
      </View>
    );
  }

  if (brand === 'MASTERCARD') {
    return (
      <View style={[styles.container, styles.mcContainer]} testID="brand-mc">
        <View style={[styles.circle, styles.mcRed]} />
        <View style={[styles.circle, styles.mcYellow, styles.mcOverlap]} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    height: 28,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  visa: {
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#1A1F71',
    letterSpacing: 1,
  },
  mcContainer: { flexDirection: 'row' },
  circle: { width: 20, height: 20, borderRadius: 10 },
  mcRed: { backgroundColor: '#EB001B' },
  mcYellow: { backgroundColor: '#F79E1B', opacity: 0.9 },
  mcOverlap: { marginLeft: -8 },
});
