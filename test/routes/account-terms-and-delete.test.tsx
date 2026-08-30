import { fireEvent, render, waitFor } from '@testing-library/react-native';

import ClientTermsRoute from '@/app/client/(tabs)/perfil/termos';
import LawyerDeleteAccountRoute from '@/app/lawyer/(tabs)/perfil/apagar-conta';
import LawyerTermsRoute from '@/app/lawyer/(tabs)/perfil/termos';
import { AccountTermsScreen } from '@/components/account-terms';
import { DeleteAccountScreen } from '@/components/delete-account';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockDeleteAccount = jest.fn().mockResolvedValue({
  message: 'Conta excluída com sucesso',
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
  useDeleteAccount: () => ({
    mutateAsync: mockDeleteAccount,
    isPending: false,
  }),
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
    mockReplace.mockClear();
    mockSignOut.mockClear();
    mockDeleteAccount.mockClear();
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

  it('does not delete the account when the confirmation phrase is wrong', async () => {
    const screen = render(<DeleteAccountScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Digite a confirmação'),
      'apagar',
    );
    fireEvent.press(screen.getByLabelText('Apagar conta'));

    await waitFor(() => {
      expect(
        screen.getByText('Digite EXCLUIR MINHA CONTA para confirmar.'),
      ).toBeTruthy();
    });
    expect(mockDeleteAccount).not.toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('deletes the account, signs out and goes to login', async () => {
    const screen = render(<DeleteAccountScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Digite a confirmação'),
      'EXCLUIR MINHA CONTA',
    );
    fireEvent.press(screen.getByLabelText('Apagar conta'));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalled();
    });
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('deletes from the lawyer route via the shared mutation', async () => {
    const screen = render(<LawyerDeleteAccountRoute />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Digite a confirmação'),
      'Excluir minha conta',
    );
    fireEvent.press(screen.getByLabelText('Apagar conta'));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalled();
    });
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
