import { syncPushDeviceUseCase } from './sync-push-device.use-case';

const mockGetExpoPushToken = jest.fn();
const mockRegisterPushDevice = jest.fn();
const mockSavePushDeviceToken = jest.fn();
const mockMapOsToPushPlatform = jest.fn();

jest.mock('./get-expo-push-token', () => ({
  getExpoPushToken: (...args: unknown[]) => mockGetExpoPushToken(...args),
}));

jest.mock('@/data/push-device', () => ({
  registerPushDevice: (...args: unknown[]) => mockRegisterPushDevice(...args),
  savePushDeviceToken: (...args: unknown[]) => mockSavePushDeviceToken(...args),
  mapOsToPushPlatform: (...args: unknown[]) => mockMapOsToPushPlatform(...args),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

describe('syncPushDeviceUseCase', () => {
  beforeEach(() => {
    mockGetExpoPushToken.mockReset();
    mockRegisterPushDevice.mockReset();
    mockSavePushDeviceToken.mockReset();
    mockMapOsToPushPlatform.mockReset();
    mockMapOsToPushPlatform.mockReturnValue('IOS');
  });

  it('does not call the API when there is no Expo token', async () => {
    mockGetExpoPushToken.mockResolvedValue(null);

    await syncPushDeviceUseCase();

    expect(mockRegisterPushDevice).not.toHaveBeenCalled();
    expect(mockSavePushDeviceToken).not.toHaveBeenCalled();
  });

  it('persists the token and registers the device with the server', async () => {
    mockGetExpoPushToken.mockResolvedValue('ExponentPushToken[abc]');
    mockRegisterPushDevice.mockResolvedValue({
      id: 'dev-1',
      expoPushToken: 'ExponentPushToken[abc]',
      platform: 'IOS',
      active: true,
      lastRegisteredAt: '2026-08-30T23:00:00',
    });

    await syncPushDeviceUseCase();

    expect(mockSavePushDeviceToken).toHaveBeenCalledWith('ExponentPushToken[abc]');
    expect(mockRegisterPushDevice).toHaveBeenCalledWith({
      expoPushToken: 'ExponentPushToken[abc]',
      platform: 'IOS',
    });
  });
});
