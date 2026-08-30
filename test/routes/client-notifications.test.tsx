import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { RefreshControl } from 'react-native';

import ClientNotificacoesScreen from '@/app/client/(tabs)/notificacoes';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockListNotifications = jest.fn();
const mockMarkRead = jest.fn();
const mockMarkAllRead = jest.fn();
const mockResolveHref = jest.fn();
const mockRefetch = jest.fn().mockResolvedValue(undefined);

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
    refetch: mockRefetch,
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
    mockRefetch.mockClear();
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

  it('refetches from the list on pull-to-refresh without swapping to the loading screen', async () => {
    const screen = wrap(<ClientNotificacoesScreen />);

    expect(screen.getByText('Conexão aceita')).toBeTruthy();

    await act(async () => {
      fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Conexão aceita')).toBeTruthy();
    expect(screen.getByText('Caixa de entrada')).toBeTruthy();
  });

  it('refetches from the empty state on pull-to-refresh without swapping to the loading screen', async () => {
    mockListNotifications.mockReturnValue([]);
    const screen = wrap(<ClientNotificacoesScreen />);

    expect(screen.getByText('Nenhuma notificação')).toBeTruthy();

    await act(async () => {
      fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Nenhuma notificação')).toBeTruthy();
    expect(screen.getByText('Caixa de entrada')).toBeTruthy();
  });
});
