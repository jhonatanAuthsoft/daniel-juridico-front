import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import SignupSubscriptionScreen from '@/app/signup/subscription';
import type { IapProduct } from '@/data/subscription';

const mockReplace = jest.fn();
const mockPurchase = jest.fn().mockResolvedValue(undefined);
const mockRestore = jest.fn().mockResolvedValue(false);
const mockFetchProducts = jest.fn();
const mockUseMe = jest.fn();
const mockUseAuth = jest.fn();
const mockSignOut = jest.fn();

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>{`redirect:${href}`}</Text>;
  },
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  authKeys: {
    all: ['auth'],
    me: () => ['auth', 'me'],
  },
  useAuth: () => mockUseAuth(),
  useMe: () => mockUseMe(),
}));

jest.mock('@/domain/subscription', () => {
  const actual = jest.requireActual('@/domain/subscription');
  return {
    ...actual,
    getIapProvider: () => ({
      fetchProducts: mockFetchProducts,
    }),
    purchaseSubscriptionUseCase: (...args: unknown[]) => mockPurchase(...args),
    restoreSubscriptionUseCase: (...args: unknown[]) => mockRestore(...args),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

function product(overrides: Partial<IapProduct> = {}): IapProduct {
  return {
    productId: 'laweact_basic_mensal',
    title: 'Plano Basic',
    description: 'Mensal',
    localizedPrice: 'R$ 35,00',
    currency: 'BRL',
    hasFreeTrial: true,
    freeTrialLabel: '1 mês',
    offerToken: 'trial-token',
    ...overrides,
  };
}

function wrap(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('SignupSubscriptionScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPurchase.mockClear();
    mockRestore.mockClear();
    mockFetchProducts.mockReset();
    mockFetchProducts.mockResolvedValue([product()]);
    mockUseAuth.mockReturnValue({
      user: { id: 'lawyer-1', role: 'LAWYER' },
      signOut: mockSignOut,
    });
    mockUseMe.mockReturnValue({
      data: {
        subscription: {
          accessGranted: false,
          productId: 'laweact_basic_mensal',
        },
      },
      isPending: false,
    });
  });

  it('advertises the first free month when the store offer is eligible', async () => {
    const screen = wrap(<SignupSubscriptionScreen />);

    await waitFor(() => {
      expect(
        screen.getByText(
          '1º mês grátis, depois R$ 35,00/mês. Renova automaticamente. Cancele quando quiser.',
        ),
      ).toBeTruthy();
    });
  });

  it('hides the free month when the store user is not eligible', async () => {
    mockFetchProducts.mockResolvedValue([
      product({ hasFreeTrial: false, freeTrialLabel: null, offerToken: 'base-token' }),
    ]);

    const screen = wrap(<SignupSubscriptionScreen />);

    await waitFor(() => {
      expect(screen.getByText('R$ 35,00/mês. Renova automaticamente.')).toBeTruthy();
    });
    expect(screen.queryByText(/1º mês grátis/)).toBeNull();
  });

  it('sends the Android offer token when the lawyer subscribes', async () => {
    const screen = wrap(<SignupSubscriptionScreen />);

    await waitFor(() => {
      expect(screen.getByText('Assinar')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Assinar'));

    await waitFor(() => {
      expect(mockPurchase).toHaveBeenCalledWith({
        productId: 'laweact_basic_mensal',
        accountId: 'lawyer-1',
        offerToken: 'trial-token',
      });
    });
  });
});
