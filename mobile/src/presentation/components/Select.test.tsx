import { fireEvent, render, screen } from '@testing-library/react-native';
import { Select } from './Select';

const options = [
  { label: '01', value: '01' },
  { label: '02', value: '02' },
];

describe('Select', () => {
  it('shows the placeholder and opens the options on press', () => {
    const onChange = jest.fn();
    render(
      <Select
        value=""
        placeholder="MM"
        options={options}
        onChange={onChange}
        testID="select"
      />,
    );

    expect(screen.getByText('MM')).toBeTruthy();

    fireEvent.press(screen.getByTestId('select'));
    fireEvent.press(screen.getByTestId('option-02'));

    expect(onChange).toHaveBeenCalledWith('02');
  });

  it('shows the selected label', () => {
    render(
      <Select
        value="01"
        placeholder="MM"
        options={options}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText('01')).toBeTruthy();
  });
});
