import { fireEvent, render, screen } from '@testing-library/react-native';
import type { CardData, CartItem } from '../../domain/models';
import { PaymentSummary } from './PaymentSummary';

const item: CartItem = {
  product: {
    id: 'p1',
    name: 'Headphones',
    description: 'Wireless',
    price: 100000,
    imageUrl: 'https://img/1.jpg',
    stock: 5,
  },
  quantity: 2,
};

const card: CardData = {
  number: '4242424242424242',
  cvc: '123',
  expMonth: '08',
  expYear: '30',
  cardHolder: 'JOHN DOE',
};

describe('PaymentSummary', () => {
  it('shows the summary and triggers payment', () => {
    const onPay = jest.fn();
    render(
      <PaymentSummary
        item={item}
        card={card}
        total={200000}
        loading={false}
        onPay={onPay}
      />,
    );

    expect(screen.getByText('Headphones')).toBeTruthy();
    expect(screen.getByText('•••• 4242')).toBeTruthy();

    fireEvent.press(screen.getByTestId('confirm-payment'));
    expect(onPay).toHaveBeenCalled();
  });

  it('disables the button while loading', () => {
    const onPay = jest.fn();
    render(
      <PaymentSummary
        item={item}
        card={card}
        total={200000}
        loading
        onPay={onPay}
      />,
    );

    fireEvent.press(screen.getByTestId('confirm-payment'));
    expect(onPay).not.toHaveBeenCalled();
  });
});
