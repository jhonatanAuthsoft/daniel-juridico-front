import { fireEvent, render, waitFor } from '@testing-library/react-native';

import LawyerChangePasswordRoute from '@/app/lawyer/(tabs)/perfil/alterar-senha';
import { ChangePasswordScreen } from '@/components/change-password';

const mockBack = jest.fn();
const mockUpdatePassword = jest.fn().mockResolvedValue({});

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('@/domain/auth', () => ({
  useUpdatePassword: () => ({
    mutateAsync: mockUpdatePassword,
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

describe('ChangePasswordScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdatePassword.mockClear();
  });

  it('shows current password, new password and the strength rules', () => {
    const screen = render(<ChangePasswordScreen />);

    expect(screen.getByText('Alterar senha')).toBeTruthy();
    expect(screen.getByText('Senha atual')).toBeTruthy();
    expect(screen.getByText('Nova Senha')).toBeTruthy();
    expect(screen.getByPlaceholderText('Digite uma nova senha')).toBeTruthy();
    expect(screen.getByText('Mínimo de 8 caracteres')).toBeTruthy();
    expect(screen.getByText('Pelo menos um número')).toBeTruthy();
    expect(screen.getByText('Pelo menos uma letra maiúscula')).toBeTruthy();
    expect(screen.getByText('Pelo menos uma letra minúscula')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
    expect(screen.getAllByLabelText('Mostrar senha')).toHaveLength(2);
  });

  it('saves the new password and goes back', async () => {
    const screen = render(<ChangePasswordScreen />);

    fireEvent.changeText(screen.getByLabelText('Senha atual'), 'Secret12');
    fireEvent.changeText(
      screen.getByPlaceholderText('Digite uma nova senha'),
      'NovaSenha1',
    );
    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        currentPassword: 'Secret12',
        newPassword: 'NovaSenha1',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it('saves from the lawyer route via the shared password mutation', async () => {
    const screen = render(<LawyerChangePasswordRoute />);

    fireEvent.changeText(screen.getByLabelText('Senha atual'), 'Secret12');
    fireEvent.changeText(
      screen.getByPlaceholderText('Digite uma nova senha'),
      'NovaSenha1',
    );
    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        currentPassword: 'Secret12',
        newPassword: 'NovaSenha1',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});
