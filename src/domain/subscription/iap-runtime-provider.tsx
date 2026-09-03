import { useEffect } from 'react';

import { createExpoIapProviderFromHook, setRuntimeIapProvider } from './iap-provider';

type IapRuntimeProviderProps = {
  children: React.ReactNode;
};

function ExpoIapRuntimeProvider({ children }: IapRuntimeProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useIAP } = require('expo-iap') as typeof import('expo-iap');
  const iap = useIAP();

  useEffect(() => {
    setRuntimeIapProvider(createExpoIapProviderFromHook(iap));
    return () => setRuntimeIapProvider(null);
  }, [iap]);

  return children;
}

/**
 * Registers the expo-iap hook as the active provider at runtime.
 * Skipped when EXPO_PUBLIC_IAP_PROVIDER=fake.
 */
export function IapRuntimeProvider({ children }: IapRuntimeProviderProps) {
  if (process.env.EXPO_PUBLIC_IAP_PROVIDER === 'fake') {
    return children;
  }

  return <ExpoIapRuntimeProvider>{children}</ExpoIapRuntimeProvider>;
}
