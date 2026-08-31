import { HttpError } from '@/data/http';

import { unregisterPushDeviceUseCase } from './unregister-push-device.use-case';

const mockUnregisterPushDevice = jest.fn();
const mockLoadPushDeviceToken = jest.fn();
const mockClearPushDeviceToken = jest.fn();

jest.mock('@/data/push-device', () => ({
  unregisterPushDevice: (...args: unknown[]) => mockUnregisterPushDevice(...args),
  loadPushDeviceToken: (...args: unknown[]) => mockLoadPushDeviceToken(...args),
  clearPushDeviceToken: (...args: unknown[]) => mockClearPushDeviceToken(...args),
}));

describe('unregisterPushDeviceUseCase', () => {
  beforeEach(() => {
    mockUnregisterPushDevice.mockReset();
    mockLoadPushDeviceToken.mockReset();
    mockClearPushDeviceToken.mockReset();
  });

  it('does nothing when no token was stored', async () => {
    mockLoadPushDeviceToken.mockResolvedValue(null);

    await unregisterPushDeviceUseCase();

    expect(mockUnregisterPushDevice).not.toHaveBeenCalled();
    expect(mockClearPushDeviceToken).not.toHaveBeenCalled();
  });

  it('deletes the device on the server and clears the stored token', async () => {
    mockLoadPushDeviceToken.mockResolvedValue('ExponentPushToken[abc]');
    mockUnregisterPushDevice.mockResolvedValue(undefined);

    await unregisterPushDeviceUseCase();

    expect(mockUnregisterPushDevice).toHaveBeenCalledWith({
      expoPushToken: 'ExponentPushToken[abc]',
    });
    expect(mockClearPushDeviceToken).toHaveBeenCalledTimes(1);
  });

  it('clears the stored token even when the server returns 404', async () => {
    mockLoadPushDeviceToken.mockResolvedValue('ExponentPushToken[abc]');
    mockUnregisterPushDevice.mockRejectedValue(
      new HttpError('Dispositivo não encontrado', 404),
    );

    await unregisterPushDeviceUseCase();

    expect(mockClearPushDeviceToken).toHaveBeenCalledTimes(1);
  });
});
