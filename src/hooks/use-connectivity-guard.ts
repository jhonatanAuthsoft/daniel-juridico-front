import NetInfo from '@react-native-community/netinfo';
import { useCallback, useState } from 'react';

export function useConnectivityGuard(onConnected: () => void) {
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsCheckingConnection(true);

    try {
      const connection = await NetInfo.fetch();
      const isOnline =
        connection.isConnected === true && connection.isInternetReachable !== false;

      setHasConnectionError(!isOnline);
      if (isOnline) {
        onConnected();
      }
    } catch {
      setHasConnectionError(true);
    } finally {
      setIsCheckingConnection(false);
    }
  }, [onConnected]);

  return {
    checkConnection,
    hasConnectionError,
    isCheckingConnection,
  };
}
