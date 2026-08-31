import { render } from '@testing-library/react-native';

import { PushDeviceSync } from './use-push-device-sync';

const mockSync = jest.fn().mockResolvedValue(undefined);
const mockUnregister = jest.fn().mockResolvedValue(undefined);
const mockUseAuth = jest.fn();
const mockUseMe = jest.fn();

jest.mock('./sync-push-device.use-case', () => ({
  syncPushDeviceUseCase: (...args: unknown[]) => mockSync(...args),
}));

jest.mock('./unregister-push-device.use-case', () => ({
  unregisterPushDeviceUseCase: (...args: unknown[]) => mockUnregister(...args),
}));

jest.mock('@/domain/auth/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/domain/auth/use-me', () => ({
  useMe: () => mockUseMe(),
}));

describe('PushDeviceSync', () => {
  beforeEach(() => {
    mockSync.mockClear();
    mockUnregister.mockClear();
    mockUseAuth.mockReset();
    mockUseMe.mockReset();
    mockUseMe.mockReturnValue({
      data: { pushNotificationsEnabled: true },
    });
  });

  it('registers the device after an authenticated session is ready', () => {
    mockUseAuth.mockReturnValue({
      token: 'access-token',
      isHydrating: false,
    });

    render(<PushDeviceSync />);

    expect(mockSync).toHaveBeenCalledTimes(1);
    expect(mockUnregister).not.toHaveBeenCalled();
  });

  it('does not register while hydrating or logged out', () => {
    mockUseAuth.mockReturnValue({
      token: null,
      isHydrating: true,
    });

    render(<PushDeviceSync />);

    expect(mockSync).not.toHaveBeenCalled();
  });

  it('unregisters when push preference is disabled', () => {
    mockUseAuth.mockReturnValue({
      token: 'access-token',
      isHydrating: false,
    });
    mockUseMe.mockReturnValue({
      data: { pushNotificationsEnabled: false },
    });

    render(<PushDeviceSync />);

    expect(mockSync).not.toHaveBeenCalled();
    expect(mockUnregister).toHaveBeenCalledTimes(1);
  });
});
