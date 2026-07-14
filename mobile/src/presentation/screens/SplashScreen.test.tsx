import { render } from '@testing-library/react-native';
import { SplashScreen } from './SplashScreen';
import { mockNavigation } from '../../test/test-utils';

describe('SplashScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('navigates to Home after the timeout', () => {
    const navigation = mockNavigation();
    render(<SplashScreen navigation={navigation} route={{} as never} />);

    jest.advanceTimersByTime(2000);

    expect((navigation as { replace: jest.Mock }).replace).toHaveBeenCalledWith(
      'Home',
    );
  });
});
