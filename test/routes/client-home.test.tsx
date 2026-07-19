import { fireEvent, render } from '@testing-library/react-native';

import ClientHomeScreen from '@/app/client/(tabs)/index';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('ClientHomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('opens the new solicitation form from the CTA', () => {
    const screen = render(<ClientHomeScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Nova solicitação' }));

    expect(mockPush).toHaveBeenCalledWith('/client/nova-solicitacao');
  });

  it('opens the client solicitation details from a card', () => {
    const screen = render(<ClientHomeScreen />);

    fireEvent.press(screen.getAllByText('Pensão Alimentícia')[0]);

    expect(mockPush).toHaveBeenCalledWith('/client/solicitacao/sol-1');
  });

  it('shows the empty state and replaces the floating CTA when there are no results', () => {
    const screen = render(<ClientHomeScreen solicitations={[]} />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
    expect(
      screen.getByText(
        'Quando houver novas solicitações, elas aparecerão aqui para você acompanhar.',
      ),
    ).toBeTruthy();
    expect(screen.getByTestId('inbox-empty-icon')).toBeTruthy();
    expect(
      screen.getAllByRole('button', { name: 'Nova solicitação' }),
    ).toHaveLength(1);
  });

  it('shows the no-results state and heading for an empty search', () => {
    const screen = render(<ClientHomeScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Pesquisar' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar solicitação'),
      'solicitação inexistente',
    );

    expect(screen.getByText('Seus resultados')).toBeTruthy();
    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
    expect(screen.getByTestId('search-list-icon')).toBeTruthy();
  });

  it('shows the no-results state without the heading for an empty filter', () => {
    const screen = render(<ClientHomeScreen />);

    fireEvent.press(screen.getByText('Canceladas'));

    expect(screen.queryByText('Seus resultados')).toBeNull();
    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
  });
});
