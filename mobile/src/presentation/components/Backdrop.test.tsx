import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Backdrop } from './Backdrop';

describe('Backdrop', () => {
  it('renders nothing when not visible', () => {
    render(
      <Backdrop visible={false} title="Card" onClose={jest.fn()}>
        <Text>content</Text>
      </Backdrop>,
    );
    expect(screen.queryByTestId('backdrop')).toBeNull();
  });

  it('renders the title and content when visible and closes', () => {
    const onClose = jest.fn();
    render(
      <Backdrop visible title="Card" onClose={onClose}>
        <Text>content</Text>
      </Backdrop>,
    );

    expect(screen.getByText('Card')).toBeTruthy();
    expect(screen.getByText('content')).toBeTruthy();

    fireEvent.press(screen.getByTestId('backdrop-close'));
    expect(onClose).toHaveBeenCalled();
  });
});
