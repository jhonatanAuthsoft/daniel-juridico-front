import { useEffect, useRef } from 'react';

import { createExpoIapProviderFromHook, setRuntimeIapProvider } from './iap-provider';

type IapRuntimeProviderProps = {
  children: React.ReactNode;
};

function waitUntil(predicate: () => boolean, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (predicate()) {
        resolve();
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('A loja não conectou a tempo. Tente de novo.'));
        return;
      }
      setTimeout(tick, 100);
    };
    tick();
  });
}

function ExpoIapRuntimeProvider({ children }: IapRuntimeProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const expoIap = require('expo-iap') as typeof import('expo-iap');
  const iap = expoIap.useIAP();
  const connectedRef = useRef(iap.connected);
  connectedRef.current = iap.connected;

  useEffect(() => {
    setRuntimeIapProvider(
      createExpoIapProviderFromHook({
        ensureReady: () => waitUntil(() => connectedRef.current, 20_000),
        fetchProducts: (params) => expoIap.fetchProducts(params),
        requestPurchase: (params) => expoIap.requestPurchase(params),
        getAvailablePurchases: () =>
          expoIap.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true }),
        finishTransaction: (params) => expoIap.finishTransaction(params),
        subscribePurchases: ({ onPurchase, onError }) => {
          const purchaseSub = expoIap.purchaseUpdatedListener(onPurchase);
          const errorSub = expoIap.purchaseErrorListener((error) => {
            onError(new Error(error?.message ?? 'Falha na compra da loja'));
          });
          return () => {
            purchaseSub.remove();
            errorSub.remove();
          };
        },
      }),
    );
    return () => setRuntimeIapProvider(null);
  }, [expoIap]);

  return children;
}

/**
 * Registers the expo-iap store APIs as the active provider at runtime.
 * Skipped when EXPO_PUBLIC_IAP_PROVIDER=fake.
 */
export function IapRuntimeProvider({ children }: IapRuntimeProviderProps) {
  if (process.env.EXPO_PUBLIC_IAP_PROVIDER === 'fake') {
    return children;
  }

  return <ExpoIapRuntimeProvider>{children}</ExpoIapRuntimeProvider>;
}
