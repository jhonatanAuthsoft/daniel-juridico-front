import { fireEvent, render, screen } from '@testing-library/react-native';

import { ConnectionError } from './connection-error.component';

describe('ConnectionError', () => {
  it('shows the offline message and retries when requested', () => {
    const onRetry = jest.fn();
    render(<ConnectionError onRetry={onRetry} />);

    expect(screen.getByText('Sem conexão com a internet')).toBeTruthy();
    expect(
      screen.getByText(
        'Parece que você está offline. Verifique sua conexão e tente novamente.',
      ),
    ).toBeTruthy();
    expect(screen.getByTestId('no-internet-icon')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Tente novamente' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders optional header with close action', () => {
    const onClose = jest.fn();
    render(
      <ConnectionError
        headerTitle="Nova solicitação"
        onClose={onClose}
        onRetry={jest.fn()}
      />,
    );

    expect(screen.getByText('Nova solicitação')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
