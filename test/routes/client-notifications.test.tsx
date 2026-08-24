import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import ClientNotificacoesScreen from '@/app/client/(tabs)/notificacoes';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockListNotifications = jest.fn();
const mockMarkRead = jest.fn();
const mockMarkAllRead = jest.fn();
const mockResolveHref = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    signOut: jest.fn(),
    isAuthenticated: true,
    user: { id: 'u-1', role: 'CLIENT', name: 'Maria', email: 'a@b.com', termsAccepted: true },
  }),
}));

jest.mock('@/components/splash-guard', () => ({
  useSplashGate: () => ({ markContentReady: jest.fn() }),
}));

jest.mock('@/domain/notification', () => ({
  useNotifications: () => ({
    data: mockListNotifications(),
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    isFetched: true,
  }),
  useMarkNotificationRead: () => ({
    mutate: mockMarkRead,
    isPending: false,
  }),
  useMarkAllNotificationsRead: () => ({
    mutate: mockMarkAllRead,
    isPending: false,
  }),
  resolveNotificationHrefUseCase: (...args: unknown[]) =>
    mockResolveHref(...args),
}));

function wrap(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe('ClientNotificacoesScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockMarkRead.mockClear();
    mockMarkAllRead.mockClear();
    mockResolveHref.mockReset();
    mockResolveHref.mockResolvedValue('/client/solicitacao/sol-9');
    mockListNotifications.mockReturnValue([
      {
        id: 'notif-1',
        title: 'Conexão aceita',
        body: 'Dra. Mariana aceitou sua solicitação',
        type: 'CONEXAO_ACEITA',
        referenceType: 'CONEXAO',
        referenceId: 'cx-1',
        senderId: 'u-1',
        createdAt: '2026-08-06T12:00:00',
        readAt: null,
        isUnread: true,
        deliveryStatus: 'ENVIADA',
      },
    ]);
  });

  it('renders inbox from API data instead of development guard', async () => {
    const screen = wrap(<ClientNotificacoesScreen />);

    await waitFor(() => {
      expect(screen.getByText('Caixa de entrada')).toBeTruthy();
    });
    expect(screen.getByText('Conexão aceita')).toBeTruthy();
    expect(screen.queryByLabelText('Aplicativo em desenvolvimento')).toBeNull();
  });

  it('marks as read and navigates to the solicitation on press', async () => {
    const screen = wrap(<ClientNotificacoesScreen />);

    fireEvent.press(screen.getByLabelText('Conexão aceita'));

    await waitFor(() => {
      expect(mockMarkRead).toHaveBeenCalledWith('notif-1');
      expect(mockPush).toHaveBeenCalledWith('/client/solicitacao/sol-9');
    });
  });
});
