import { StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HistoryHeaderButton = ({ onPress }: { onPress: () => void }) => (
  <Text style={styles.headerButton} onPress={onPress}>
    History
  </Text>
);

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Products',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <HistoryHeaderButton
              onPress={() => navigation.navigate('History')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Result', headerBackVisible: false }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Purchase history' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});
