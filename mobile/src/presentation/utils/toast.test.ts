import { Alert, Platform, ToastAndroid } from 'react-native';
import { showErrorToast } from './toast';

describe('showErrorToast', () => {
  it('shows a native toast on Android', () => {
    const original = Platform.OS;
    Platform.OS = 'android';

    const spy = jest.spyOn(ToastAndroid, 'show').mockImplementation(() => {});
    showErrorToast('boom');

    expect(spy).toHaveBeenCalledWith('boom', ToastAndroid.LONG);
    spy.mockRestore();
    Platform.OS = original;
  });

  it('shows an Alert on iOS', () => {
    const original = Platform.OS;
    Platform.OS = 'ios';

    const spy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    showErrorToast('error');

    expect(spy).toHaveBeenCalledWith('Payment error', 'error');
    spy.mockRestore();
    Platform.OS = original;
  });
});
