import { fireEvent, render } from '@testing-library/react-native';

import LawyerHistoricoScreen from '@/app/lawyer/(tabs)/historico';
import type { LawyerHistoryItem } from '@/components/lawyer-history';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const SAMPLE_HISTORY: LawyerHistoryItem[] = [
  {
    id: 'hist-1',
    clientName: 'Luiza Sampaio',
    urgency: 'urgente',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'accepted',
  },
  {
    id: 'hist-2',
    clientName: 'Maria Gomes',
    urgency: 'emergencia',
    description:
      'Preciso de orientacao sobre rescisao de contrato de aluguel com clausula de multa a...',
    decision: 'rejected',
  },
];

describe('LawyerHistoricoScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('shows the history title, filters and example cards', () => {
    const screen = render(<LawyerHistoricoScreen items={SAMPLE_HISTORY} />);

    expect(screen.getByText('Histórico')).toBeTruthy();
    expect(screen.getByText('Todas')).toBeTruthy();
    expect(screen.getByText('Aceitas')).toBeTruthy();
    expect(screen.getByText('Recusadas')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByText('Luiza Sampaio')).toBeTruthy();
    expect(screen.getByText('Maria Gomes')).toBeTruthy();
    expect(screen.getByText('Urgente')).toBeTruthy();
    expect(screen.getByText('Emergência')).toBeTruthy();
    expect(screen.getByText('Solicitação aceita.')).toBeTruthy();
    expect(screen.getByText('Solicitação recusada')).toBeTruthy();
  });

  it('filters accepted and rejected items', () => {
    const screen = render(<LawyerHistoricoScreen items={SAMPLE_HISTORY} />);

    fireEvent.press(screen.getByText('Aceitas'));
    expect(screen.getByText('Luiza Sampaio')).toBeTruthy();
    expect(screen.queryByText('Maria Gomes')).toBeNull();

    fireEvent.press(screen.getByText('Recusadas'));
    expect(screen.getByText('Maria Gomes')).toBeTruthy();
    expect(screen.queryByText('Luiza Sampaio')).toBeNull();
  });

  it('shows no-results for an empty search', () => {
    const screen = render(<LawyerHistoricoScreen items={SAMPLE_HISTORY} />);

    fireEvent.press(screen.getByRole('button', { name: 'Pesquisar' }));
    fireEvent.changeText(
      screen.getByPlaceholderText('Buscar no histórico'),
      'cliente inexistente',
    );

    expect(screen.getByText('Seus resultados')).toBeTruthy();
    expect(screen.getByText('Sem resultados compatíveis')).toBeTruthy();
  });

  it('opens solicitation details from a card', () => {
    const screen = render(<LawyerHistoricoScreen items={SAMPLE_HISTORY} />);

    fireEvent.press(screen.getByText('Luiza Sampaio'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/solicitacao/hist-1');
  });
});
