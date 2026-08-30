import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import type { NotificationResult } from '@/data/notification';

import { notificationKeys } from './notification.keys';
import {
  UNREAD_EXISTS_REFETCH_INTERVAL_MS,
  useNotifications,
  useUnreadNotificationsExist,
} from './use-notification-queries';

const mockListNotifications = jest.fn();
const mockGetUnreadExists = jest.fn();

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

jest.mock('./notification.use-cases', () => ({
  listNotificationsUseCase: (...args: unknown[]) =>
    mockListNotifications(...args),
  getUnreadNotificationsExistUseCase: (...args: unknown[]) =>
    mockGetUnreadExists(...args),
}));

function unreadNotification(): NotificationResult {
  return {
    id: 'notif-1',
    title: 'Conexão aceita',
    body: 'Dra. Marina aceitou sua solicitação',
    type: 'CONEXAO_ACEITA',
    referenceType: 'CONEXAO',
    referenceId: 'cx-1',
    senderId: 'u-adv',
    createdAt: '2026-08-30T12:00:00',
    readAt: null,
    isUnread: true,
    deliveryStatus: 'SKIPPED',
  };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
    },
  });

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return { queryClient, Wrapper };
}

describe('useUnreadNotificationsExist', () => {
  beforeEach(() => {
    mockGetUnreadExists.mockReset();
    mockListNotifications.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('polls unread existence so the tab badge updates while the app stays open', async () => {
    jest.useFakeTimers();
    mockGetUnreadExists.mockResolvedValue({ exists: false });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useUnreadNotificationsExist(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(mockGetUnreadExists).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual({ exists: false });
    });

    mockGetUnreadExists.mockResolvedValue({ exists: true });

    await act(async () => {
      jest.advanceTimersByTime(UNREAD_EXISTS_REFETCH_INTERVAL_MS);
    });

    await waitFor(() => {
      expect(mockGetUnreadExists).toHaveBeenCalledTimes(2);
      expect(result.current.data).toEqual({ exists: true });
    });
  });
});

describe('useNotifications', () => {
  beforeEach(() => {
    mockGetUnreadExists.mockReset();
    mockListNotifications.mockReset();
  });

  it('sets unread-exists from the inbox list so the badge appears after a refetch', async () => {
    mockListNotifications.mockResolvedValue([unreadNotification()]);

    const { queryClient, Wrapper } = createWrapper();
    renderHook(() => useNotifications(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(queryClient.getQueryData(notificationKeys.unreadExists())).toEqual({
        exists: true,
      });
    });
  });
});
