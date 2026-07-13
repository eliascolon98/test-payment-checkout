import { Alert, Platform, ToastAndroid } from 'react-native';

/**
 * Shows a short error toast. Uses the native Android toast on Android
 * (the target platform for the APK) and falls back to an alert elsewhere.
 */
export const showErrorToast = (message: string): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
    return;
  }
  Alert.alert('Payment error', message);
};
