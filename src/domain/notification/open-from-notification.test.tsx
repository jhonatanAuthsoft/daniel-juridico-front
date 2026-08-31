import { render, waitFor } from '@testing-library/react-native';

import { OpenFromNotification } from './open-from-notification';

const mockNavigate = jest.fn();
const mockUseAuth = jest.fn();
const mockUseLastNotificationResponse = jest.fn();
const mockClearLastNotificationResponse = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ navigate: mockNavigate }),
}));

jest.mock('expo-notifications', () => ({
  DEFAULT_ACTION_IDENTIFIER: 'expo.modules.notifications.actions.DEFAULT',
  useLastNotificationResponse: () => mockUseLastNotificationResponse(),
  clearLastNotificationResponse: () => mockClearLastNotificationResponse(),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => mockUseAuth(),
}));

function tapResponse(identifier = 'push-1') {
  return {
    actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
    notification: {
      request: { identifier },
    },
  };
}

describe('OpenFromNotification', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseAuth.mockReset();
    mockUseLastNotificationResponse.mockReset();
    mockClearLastNotificationResponse.mockReset();
    mockUseLastNotificationResponse.mockReturnValue(null);
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: true,
      user: {
        role: 'LAWYER',
        termsAccepted: true,
      },
    });
  });

  it('does not navigate while the session is hydrating', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: true,
      isAuthenticated: true,
      user: { role: 'LAWYER', termsAccepted: true },
    });
    mockUseLastNotificationResponse.mockReturnValue(tapResponse());

    render(<OpenFromNotification />);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not navigate when the user is logged out', () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: false,
      user: null,
    });
    mockUseLastNotificationResponse.mockReturnValue(tapResponse());

    render(<OpenFromNotification />);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('opens the lawyer notifications tab after a notification tap', async () => {
    mockUseLastNotificationResponse.mockReturnValue(tapResponse());

    render(<OpenFromNotification />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/lawyer/notificacoes');
    });
    expect(mockClearLastNotificationResponse).toHaveBeenCalled();
  });

  it('opens the client notifications tab after a notification tap', async () => {
    mockUseAuth.mockReturnValue({
      isHydrating: false,
      isAuthenticated: true,
      user: { role: 'CLIENT', termsAccepted: true },
    });
    mockUseLastNotificationResponse.mockReturnValue(tapResponse());

    render(<OpenFromNotification />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/client/notificacoes');
    });
  });

  it('does not navigate when there is no notification tap', () => {
    render(<OpenFromNotification />);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
