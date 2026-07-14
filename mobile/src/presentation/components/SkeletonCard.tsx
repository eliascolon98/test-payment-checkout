import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/colors';

/** Placeholder card shown while products load (animated pulse). */
export const SkeletonCard = () => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.card} testID="skeleton-card">
      <Animated.View style={[styles.image, { opacity: pulse }]} />
      <View style={styles.info}>
        <Animated.View style={[styles.line, styles.lineWide, { opacity: pulse }]} />
        <Animated.View style={[styles.line, styles.lineNarrow, { opacity: pulse }]} />
        <Animated.View style={[styles.line, styles.linePrice, { opacity: pulse }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '46%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    margin: spacing.xs,
    overflow: 'hidden',
    ...shadow.sm,
  },
  image: { width: '100%', height: 130, backgroundColor: colors.skeleton },
  info: { padding: spacing.md },
  line: { height: 12, borderRadius: 6, backgroundColor: colors.skeleton },
  lineWide: { width: '80%' },
  lineNarrow: { width: '55%', marginTop: spacing.sm },
  linePrice: { width: '40%', height: 16, marginTop: spacing.md },
});
