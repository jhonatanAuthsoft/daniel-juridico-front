import { fireEvent, render, waitFor } from '@testing-library/react-native';

import LawyerSubscriptionRoute from '@/app/lawyer/(tabs)/perfil/assinatura';
import type { IapProduct } from '@/data/subscription';

const mockBack = jest.fn();
const mockUseMe = jest.fn();
const mockFetchProducts = jest.fn();
const mockOpenSubscriptionManagement = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('@/domain/auth', () => ({
  useMe: () => mockUseMe(),
}));

jest.mock('@/domain/subscription', () => ({
  getIapProvider: () => ({
    fetchProducts: mockFetchProducts,
  }),
}));

jest.mock('@/utils/open-subscription-management', () => ({
  openSubscriptionManagement: () => mockOpenSubscriptionManagement(),
}));

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
    hasFreeTrial: false,
    freeTrialLabel: null,
    offerToken: null,
    ...overrides,
  };
}

function activeSubscription() {
  return {
    status: 'ATIVA',
    accessGranted: true,
    periodEndsAt: '2026-10-08T12:00:00',
    platform: 'FAKE',
    productId: 'laweact_basic_mensal',
    autoRenewing: true,
  };
}

describe('LawyerSubscriptionRoute', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockOpenSubscriptionManagement.mockClear();
    mockFetchProducts.mockReset();
    mockFetchProducts.mockResolvedValue([product()]);
    mockUseMe.mockReturnValue({
      data: { subscription: activeSubscription() },
      isPending: false,
    });
  });

  it('shows the plan name, price, validity and renewal', async () => {
    const screen = render(<LawyerSubscriptionRoute />);

    expect(screen.getByText('Assinatura')).toBeTruthy();
    expect(screen.getByText('Básico')).toBeTruthy();
    expect(screen.getByText('Data de validade')).toBeTruthy();
    expect(screen.getAllByText('08/10/2026')).toHaveLength(2);
    expect(screen.getByText('Próxima renovação')).toBeTruthy();
    expect(screen.getByText('Cancelar assinatura')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('R$ 35 /mês')).toBeTruthy();
    });
    expect(mockFetchProducts).toHaveBeenCalledWith(['laweact_basic_mensal']);
  });

  it('does not call the store until the cancel link is pressed', async () => {
    const screen = render(<LawyerSubscriptionRoute />);

    await waitFor(() => {
      expect(screen.getByText('R$ 35 /mês')).toBeTruthy();
    });
    expect(mockOpenSubscriptionManagement).not.toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText('Cancelar assinatura'));

    expect(mockOpenSubscriptionManagement).toHaveBeenCalledTimes(1);
  });

  it('shows that a cancelled plan will not renew and opens the store to view it', async () => {
    mockUseMe.mockReturnValue({
      data: {
        subscription: {
          ...activeSubscription(),
          status: 'CANCELADA',
          autoRenewing: false,
        },
      },
      isPending: false,
    });

    const screen = render(<LawyerSubscriptionRoute />);

    expect(screen.getByText('08/10/2026')).toBeTruthy();
    expect(screen.getByText('Não será renovada')).toBeTruthy();
    expect(screen.queryByText('Cancelar assinatura')).toBeNull();

    fireEvent.press(screen.getByLabelText('Ver na loja'));

    expect(mockOpenSubscriptionManagement).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText('R$ 35 /mês')).toBeTruthy();
    });
  });

  it('keeps the fallback price when the store is unavailable', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Loja indisponível'));

    const screen = render(<LawyerSubscriptionRoute />);

    await waitFor(() => {
      expect(screen.getByText('R$ 50 /mês')).toBeTruthy();
    });
    expect(screen.getByText('Básico')).toBeTruthy();
  });
});
