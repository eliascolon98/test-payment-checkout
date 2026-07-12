import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Home'), 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Checkout</Text>
      <Text style={styles.tagline}>Fast & secure payments</Text>
      <ActivityIndicator
        color={colors.surface}
        style={styles.spinner}
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { fontSize: 40, fontWeight: '800', color: colors.surface },
  tagline: {
    fontSize: 16,
    color: colors.surface,
    marginTop: spacing.sm,
    opacity: 0.9,
  },
  spinner: { marginTop: spacing.xl },
});
