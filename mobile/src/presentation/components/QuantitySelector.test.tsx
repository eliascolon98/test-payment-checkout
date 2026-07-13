import { fireEvent, render, screen } from '@testing-library/react-native';
import { QuantitySelector } from './QuantitySelector';

describe('QuantitySelector', () => {
  it('increments and decrements within bounds', () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={2} max={5} onChange={onChange} />);

    fireEvent.press(screen.getByTestId('quantity-increase'));
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.press(screen.getByTestId('quantity-decrease'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('does not go below the minimum', () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={1} max={5} onChange={onChange} />);

    fireEvent.press(screen.getByTestId('quantity-decrease'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not exceed the max', () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={5} max={5} onChange={onChange} />);

    fireEvent.press(screen.getByTestId('quantity-increase'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
