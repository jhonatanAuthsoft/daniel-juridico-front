import NetInfo from '@react-native-community/netinfo';
import { act, renderHook } from '@testing-library/react-native';

import { useConnectivityGuard } from './use-connectivity-guard';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

const fetchConnection = NetInfo.fetch as jest.MockedFunction<typeof NetInfo.fetch>;

describe('useConnectivityGuard', () => {
  beforeEach(() => {
    fetchConnection.mockReset();
  });

  it('shows the connection error when the device is offline', async () => {
    fetchConnection.mockResolvedValue({ isConnected: false } as never);
    const onConnected = jest.fn();
    const { result } = renderHook(() => useConnectivityGuard(onConnected));

    await act(result.current.checkConnection);

    expect(result.current.hasConnectionError).toBe(true);
    expect(onConnected).not.toHaveBeenCalled();
  });

  it('shows the connection error when the network has no internet access', async () => {
    fetchConnection.mockResolvedValue({
      isConnected: true,
      isInternetReachable: false,
    } as never);
    const onConnected = jest.fn();
    const { result } = renderHook(() => useConnectivityGuard(onConnected));

    await act(result.current.checkConnection);

    expect(result.current.hasConnectionError).toBe(true);
    expect(onConnected).not.toHaveBeenCalled();
  });

  it('continues after a retry reconnects', async () => {
    fetchConnection
      .mockResolvedValueOnce({ isConnected: false } as never)
      .mockResolvedValueOnce({ isConnected: true } as never);
    const onConnected = jest.fn();
    const { result } = renderHook(() => useConnectivityGuard(onConnected));

    await act(result.current.checkConnection);
    await act(result.current.checkConnection);

    expect(result.current.hasConnectionError).toBe(false);
    expect(onConnected).toHaveBeenCalledTimes(1);
  });
});
