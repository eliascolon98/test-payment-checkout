import { fireEvent, render, screen } from '@testing-library/react-native';
import { FadeInImage } from './FadeInImage';

describe('FadeInImage', () => {
  it('renders the image and fades it in on load', () => {
    render(<FadeInImage uri="https://img/1.jpg" />);
    const image = screen.getByTestId('fade-in-image');
    expect(image).toBeTruthy();
    // Simulate the image finishing loading (triggers the fade animation).
    fireEvent(image, 'load');
    expect(image.props.source).toEqual({ uri: 'https://img/1.jpg' });
  });
});
