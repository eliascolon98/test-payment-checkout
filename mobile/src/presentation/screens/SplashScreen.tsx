import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen = ({ navigation }: Props) => {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(dotScale, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Home'), 1900);
    return () => clearTimeout(timer);
  }, [navigation, logoScale, logoOpacity, tagOpacity, dotScale]);

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoBadge}>
          <View style={styles.logoMark} />
        </View>
        <Animated.Text style={styles.logo}>
          Pay<Animated.Text style={styles.logoBold}>Check</Animated.Text>
        </Animated.Text>
      </Animated.View>

      <Animated.View
        style={[styles.dotRow, { transform: [{ scale: dotScale }] }]}
      >
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Fast & secure payments
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: colors.primaryLight,
    opacity: 0.16,
    top: -120,
    right: -110,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primaryDark,
    opacity: 0.3,
    bottom: -90,
    left: -80,
  },
  logoWrap: { alignItems: 'center' },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 6,
    borderColor: colors.primary,
  },
  logo: {
    fontSize: 40,
    fontWeight: '300',
    color: colors.surface,
    letterSpacing: -1,
  },
  logoBold: { fontWeight: '900' },
  dotRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    opacity: 0.35,
  },
  dotActive: { opacity: 1, width: 24, borderRadius: 4 },
  tagline: {
    fontSize: 16,
    color: colors.surface,
    marginTop: spacing.lg,
    opacity: 0.85,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
