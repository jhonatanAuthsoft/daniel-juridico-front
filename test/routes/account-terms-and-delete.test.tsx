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
const mockBanner = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
  useDeleteAccount: () => ({
    mutateAsync: mockDeleteAccount,
    isPending: false,
  }),
  useLogScreenAccess: jest.fn(),
}));

jest.mock('@/atomic/feedback-banner', () => ({
  useBanner: () => mockBanner,
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

describe('AccountTermsScreen', () => {
  it('shows the terms headline and the 13 legal sections', () => {
    const screen = render(<AccountTermsScreen />);

    expect(screen.getByText('Termos e condições')).toBeTruthy();
    expect(
      screen.getByText('Termos de uso e Política de Privacidade'),
    ).toBeTruthy();
    expect(screen.getByText('1. Partes, objeto e definições')).toBeTruthy();
    expect(screen.getByText('2. Formação e prova do contrato eletrônico')).toBeTruthy();
    expect(screen.getByText('3. Licença de uso e propriedade intelectual')).toBeTruthy();
    expect(screen.getByText('4. Solicitações de conexão e contratação externa')).toBeTruthy();
    expect(screen.getByText('5. Deveres profissionais e regras da OAB')).toBeTruthy();
    expect(screen.getByText('6. Deveres de todos os USUÁRIOs')).toBeTruthy();
    expect(screen.getByText('7. Comentários, moderação e denúncias')).toBeTruthy();
    expect(screen.getByText('8. Segurança, privacidade e confidencialidade')).toBeTruthy();
    expect(screen.getByText('9. Suspensão e encerramento')).toBeTruthy();
    expect(screen.getByText('10. Responsabilidades')).toBeTruthy();
    expect(
      screen.getByText('11. Comunicações, alterações, vigência e prevalência'),
    ).toBeTruthy();
    expect(screen.getByText('12. Lei aplicável e solução de controvérsias')).toBeTruthy();
    expect(screen.getByText('13. Disposições finais')).toBeTruthy();
    expect(
      screen.getByText(/A LAWEACT não é escritório de advocacia/),
    ).toBeTruthy();
    expect(screen.queryByText(/Lorem Ipsum/)).toBeNull();
  });

  it('uses the same copy for client and lawyer profile routes', () => {
    const client = render(<ClientTermsRoute />);
    const lawyer = render(<LawyerTermsRoute />);

    expect(client.getByText('Termos de uso e Política de Privacidade')).toBeTruthy();
    expect(lawyer.getByText('Termos de uso e Política de Privacidade')).toBeTruthy();
  });
});

async function goToPasswordStep(
  screen: ReturnType<typeof render>,
  phrase = 'EXCLUIR MINHA CONTA',
) {
  fireEvent.changeText(
    screen.getByPlaceholderText('Digite a confirmação'),
    phrase,
  );
  fireEvent.press(screen.getByLabelText('Apagar conta'));
  await waitFor(() => {
    expect(screen.getByText('Confirme sua senha')).toBeTruthy();
  });
}

describe('DeleteAccountScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockReplace.mockClear();
    mockSignOut.mockClear();
    mockDeleteAccount.mockClear();
    mockBanner.mockClear();
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

  it('does not call the server when the confirmation phrase is wrong', async () => {
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
    expect(screen.queryByText('Confirme sua senha')).toBeNull();
    expect(mockDeleteAccount).not.toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('asks for the password after the confirmation phrase, without calling the server', async () => {
    const screen = render(<DeleteAccountScreen />);

    await goToPasswordStep(screen);

    expect(screen.getByText(/digite sua senha para concluir a exclusão/i)).toBeTruthy();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeTruthy();
    expect(screen.getByText('Continuar')).toBeTruthy();
    expect(mockDeleteAccount).not.toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('shows an error and keeps the account when the password is wrong', async () => {
    mockDeleteAccount.mockRejectedValueOnce(new Error('A senha está incorreta'));
    const screen = render(<DeleteAccountScreen />);

    await goToPasswordStep(screen);
    fireEvent.changeText(
      screen.getByPlaceholderText('Digite sua senha'),
      'SenhaErrada1',
    );
    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(screen.getByText('A senha está incorreta')).toBeTruthy();
    });
    expect(mockDeleteAccount).toHaveBeenCalledWith({ password: 'SenhaErrada1' });
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('deletes the account, signs out and goes to login after the correct password', async () => {
    const screen = render(<DeleteAccountScreen />);

    await goToPasswordStep(screen);
    fireEvent.changeText(
      screen.getByPlaceholderText('Digite sua senha'),
      'Secret12',
    );
    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalledWith({ password: 'Secret12' });
    });
    expect(mockBanner).toHaveBeenCalledWith('Conta deletada com sucesso.', 'success');
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('deletes from the lawyer route via the shared mutation', async () => {
    const screen = render(<LawyerDeleteAccountRoute />);

    await goToPasswordStep(screen, 'Excluir minha conta');
    fireEvent.changeText(
      screen.getByPlaceholderText('Digite sua senha'),
      'Secret12',
    );
    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalledWith({ password: 'Secret12' });
    });
    expect(mockBanner).toHaveBeenCalledWith('Conta deletada com sucesso.', 'success');
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
