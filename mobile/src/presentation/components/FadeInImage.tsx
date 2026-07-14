import { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  type ImageResizeMode,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  uri: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
};

/**
 * Image with a skeleton background and a fade-in once loaded, so remote
 * product photos never flash an empty box and feel fast to appear.
 * The passed `style` sizes the container (width/height/aspectRatio/radius).
 */
export const FadeInImage = ({ uri, style, resizeMode = 'cover' }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, { opacity }]}
        resizeMode={resizeMode}
        onLoad={onLoad}
        testID="fade-in-image"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.skeleton, overflow: 'hidden' },
});
