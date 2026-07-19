import { fireEvent, render } from '@testing-library/react-native';

import { ConnectionError } from './connection-error.component';

describe('ConnectionError', () => {
  it('shows the offline message and retries when requested', () => {
    const onRetry = jest.fn();
    const screen = render(<ConnectionError onRetry={onRetry} />);

    expect(screen.getByText('Sem conexão com a internet')).toBeTruthy();
    expect(
      screen.getByText('Parece que você está offline. Verifique sua conexão e tente novamente.'),
    ).toBeTruthy();
    expect(screen.getByTestId('no-internet-icon')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Tente novamente' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
