import { fireEvent, render } from '@testing-library/react-native';

import ClientPerfilScreen from '@/app/client/(tabs)/perfil';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockPickEditedImage = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => mockUseAuth(),
  useMe: () => ({
    data: { photoKey: null, pushNotificationsEnabled: true },
    isLoading: false,
  }),
  useUpdatePreferences: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useUpdateProfilePhoto: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('@/domain/arquivo', () => ({
  useObjectReadUrl: () => ({
    data: undefined,
    isLoading: false,
  }),
}));

jest.mock('@/hooks/use-image-edit-flow', () => ({
  useImageEditFlow: () => ({
    pickEditedImage: mockPickEditedImage,
    editModal: null,
    isUploading: false,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

describe('ClientPerfilScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockSignOut.mockClear();
    mockPickEditedImage.mockClear();
    mockUseAuth.mockReturnValue({
      user: {
        id: 'mock-client',
        name: 'Maria Silva Lima',
        email: 'maria_silvalima@gmail.com',
        role: 'CLIENT',
      },
      isAuthenticated: true,
      signOut: mockSignOut,
    });
  });

  it('shows the account identity and edit photo control', () => {
    const screen = render(<ClientPerfilScreen />);

    expect(screen.getByText('Conta')).toBeTruthy();
    expect(screen.getByText('Maria Silva Lima')).toBeTruthy();
    expect(screen.getByText('maria_silvalima@gmail.com')).toBeTruthy();
    expect(screen.getByLabelText('Editar foto de perfil')).toBeTruthy();
    expect(screen.getByText('Editar Dados')).toBeTruthy();
    expect(screen.getByText('Alterar Senha')).toBeTruthy();
    expect(screen.getByText('Termos e condições')).toBeTruthy();
    expect(screen.getByText('Suporte')).toBeTruthy();
    expect(screen.queryByText('Assinatura e plano')).toBeNull();
    expect(screen.queryByText('Tornar Perfil indisponível')).toBeNull();
  });

  it('does not show placeholder name or email when the user is missing', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      signOut: mockSignOut,
    });

    const screen = render(<ClientPerfilScreen />);

    expect(screen.queryByText('Maria Silva Lima')).toBeNull();
    expect(screen.queryByText('maria_silvalima@gmail.com')).toBeNull();
  });

  it('opens edit data from the account menu', () => {
    const screen = render(<ClientPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Editar Dados'));

    expect(mockPush).toHaveBeenCalledWith('/client/perfil/editar-dados');
  });

  it('opens change password from the account menu', () => {
    const screen = render(<ClientPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Alterar Senha'));

    expect(mockPush).toHaveBeenCalledWith('/client/perfil/alterar-senha');
  });

  it('opens terms from the account menu', () => {
    const screen = render(<ClientPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Termos e condições'));

    expect(mockPush).toHaveBeenCalledWith('/client/perfil/termos');
  });

  it('opens the image editor from the profile photo', () => {
    const screen = render(<ClientPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Editar foto de perfil'));

    expect(mockPickEditedImage).toHaveBeenCalledWith({ aspect: [1, 1] });
  });

  it('signs out and returns to login', () => {
    const screen = render(<ClientPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Sair da conta'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
