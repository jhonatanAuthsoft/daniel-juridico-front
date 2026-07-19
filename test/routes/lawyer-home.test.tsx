import { fireEvent, render } from '@testing-library/react-native';

import LawyerHomeScreen from '@/app/lawyer/(tabs)/index';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const ONE_URGENT_SOLICITATION = [
  {
    id: '1',
    clientName: 'Maria Gomes',
    status: 'urgente' as const,
    description: 'Demanda trabalhista',
    timeLabel: '2h atrás',
    timeKind: 'relative' as const,
    location: 'Salvador - Bahia',
  },
];

describe('LawyerHomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('shows the no-data state when no solicitations exist', () => {
    const screen = render(<LawyerHomeScreen solicitations={[]} />);

    expect(screen.getByText('Nenhuma solicitação encontrada')).toBeTruthy();
  });

  it('shows search results heading and no-results state for an empty search', () => {
    const screen = render(
      <LawyerHomeScreen solicitations={ONE_URGENT_SOLICITATION} />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Pesquisar' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar solicitação'),
      'cliente inexistente',
    );

    expect(screen.getByText('Seus resultados')).toBeTruthy();
    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
  });

  it('shows no-results without the search heading for an empty filter', () => {
    const screen = render(
      <LawyerHomeScreen solicitations={ONE_URGENT_SOLICITATION} />,
    );

    fireEvent.press(screen.getAllByText('Emergência')[0]);

    expect(screen.queryByText('Seus resultados')).toBeNull();
    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
  });

  it('opens a client solicitation from a card', () => {
    const screen = render(
      <LawyerHomeScreen solicitations={ONE_URGENT_SOLICITATION} />,
    );

    fireEvent.press(screen.getByText('Maria Gomes'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/solicitacao/1');
  });
});
