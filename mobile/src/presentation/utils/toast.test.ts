import { ToastAndroid } from 'react-native';
import { showErrorToast } from './toast';

describe('showErrorToast', () => {
  it('shows a native toast on Android', () => {
    const spy = jest.spyOn(ToastAndroid, 'show').mockImplementation(() => {});

    showErrorToast('boom');

    expect(spy).toHaveBeenCalledWith('boom', ToastAndroid.LONG);
    spy.mockRestore();
  });
});
