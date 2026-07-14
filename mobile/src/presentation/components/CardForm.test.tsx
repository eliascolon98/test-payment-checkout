import { fireEvent, render, screen } from '@testing-library/react-native';
import { CardForm } from './CardForm';

describe('CardForm', () => {
  const fillValidCard = () => {
    fireEvent.changeText(
      screen.getByTestId('input-card-number'),
      '4242424242424242',
    );
    fireEvent.press(screen.getByTestId('select-exp-month'));
    fireEvent.press(screen.getByTestId('option-08'));
    fireEvent.changeText(screen.getByTestId('input-exp-year'), '30');
    fireEvent.changeText(screen.getByTestId('input-cvc'), '123');
    fireEvent.changeText(screen.getByTestId('input-card-holder'), 'JOHN DOE');
  };

  it('shows the VISA logo when a VISA number is typed', () => {
    render(<CardForm onSubmit={jest.fn()} />);
    fireEvent.changeText(
      screen.getByTestId('input-card-number'),
      '4242424242424242',
    );
    expect(screen.getByTestId('brand-visa')).toBeTruthy();
  });

  it('does not submit with an invalid form and shows errors', () => {
    const onSubmit = jest.fn();
    render(<CardForm onSubmit={onSubmit} />);

    fireEvent.press(screen.getByTestId('submit-card'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid card number')).toBeTruthy();
  });

  it('rejects a cardholder name shorter than 5 characters', () => {
    const onSubmit = jest.fn();
    render(<CardForm onSubmit={onSubmit} />);

    fireEvent.changeText(
      screen.getByTestId('input-card-number'),
      '4242424242424242',
    );
    fireEvent.press(screen.getByTestId('select-exp-month'));
    fireEvent.press(screen.getByTestId('option-08'));
    fireEvent.changeText(screen.getByTestId('input-exp-year'), '30');
    fireEvent.changeText(screen.getByTestId('input-cvc'), '123');
    fireEvent.changeText(screen.getByTestId('input-card-holder'), 'ANN');

    fireEvent.press(screen.getByTestId('submit-card'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the sanitized card data when the form is valid', () => {
    const onSubmit = jest.fn();
    render(<CardForm onSubmit={onSubmit} />);

    fillValidCard();
    fireEvent.press(screen.getByTestId('submit-card'));

    expect(onSubmit).toHaveBeenCalledWith({
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '30',
      cardHolder: 'JOHN DOE',
    });
  });
});
