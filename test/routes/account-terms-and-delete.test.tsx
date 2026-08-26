import { fireEvent, render } from '@testing-library/react-native';

import ClientTermsRoute from '@/app/client/(tabs)/perfil/termos';
import LawyerTermsRoute from '@/app/lawyer/(tabs)/perfil/termos';
import { AccountTermsScreen } from '@/components/account-terms';
import { DeleteAccountScreen } from '@/components/delete-account';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

describe('AccountTermsScreen', () => {
  it('shows the terms headline and placeholder copy', () => {
    const screen = render(<AccountTermsScreen />);

    expect(screen.getByText('Termos e condições')).toBeTruthy();
    expect(
      screen.getByText('Termos de uso e Política de Privacidade'),
    ).toBeTruthy();
    expect(screen.getAllByText(/Lorem Ipsum is simply dummy text/).length).toBeGreaterThan(0);
  });

  it('uses the same copy for client and lawyer profile routes', () => {
    const client = render(<ClientTermsRoute />);
    const lawyer = render(<LawyerTermsRoute />);

    expect(client.getByText('Termos de uso e Política de Privacidade')).toBeTruthy();
    expect(lawyer.getByText('Termos de uso e Política de Privacidade')).toBeTruthy();
  });
});

describe('DeleteAccountScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it('shows the confirmation copy, input and actions', () => {
    const screen = render(<DeleteAccountScreen />);

    expect(screen.getAllByText('Apagar conta').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Tem certeza de que deseja excluir sua conta/)).toBeTruthy();
    expect(screen.getByText(/EXCLUIR MINHA CONTA/)).toBeTruthy();
    expect(screen.getByText('Digite "Excluir minha conta"')).toBeTruthy();
    expect(screen.getByPlaceholderText('Digite a confirmação')).toBeTruthy();
    expect(screen.getByText('Desistir')).toBeTruthy();
    expect(screen.getByLabelText('Fechar')).toBeTruthy();
  });

  it('goes back when Desistir is pressed', () => {
    const screen = render(<DeleteAccountScreen />);

    fireEvent.press(screen.getByText('Desistir'));

    expect(mockBack).toHaveBeenCalled();
  });
});
