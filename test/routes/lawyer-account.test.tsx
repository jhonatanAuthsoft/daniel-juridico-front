import { fireEvent, render } from '@testing-library/react-native';

import LawyerPerfilScreen from '@/app/lawyer/(tabs)/perfil';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockPickEditedImage = jest.fn();
const mockUseAuth = jest.fn();
const mockUseMe = jest.fn();
const mockUpdateAvailability = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => mockUseAuth(),
  useMe: () => mockUseMe(),
  useUpdatePreferences: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useUpdateProfilePhoto: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('@/domain/lawyer', () => ({
  useUpdateLawyerAvailability: () => ({
    mutate: mockUpdateAvailability,
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

describe('LawyerPerfilScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockSignOut.mockClear();
    mockPickEditedImage.mockClear();
    mockUpdateAvailability.mockClear();
    mockUseMe.mockReturnValue({
      data: {
        photoKey: null,
        pushNotificationsEnabled: true,
        profileUnavailable: false,
      },
      isLoading: false,
    });
    mockUseAuth.mockReturnValue({
      user: {
        id: 'mock-lawyer',
        name: 'Luiza Bittencourt',
        email: 'luizabitt@gmail.com',
        role: 'LAWYER',
      },
      isAuthenticated: true,
      signOut: mockSignOut,
    });
  });

  it('shows the account identity and edit photo control', () => {
    const screen = render(<LawyerPerfilScreen />);

    expect(screen.getByText('Conta')).toBeTruthy();
    expect(screen.getByText('Luiza Bittencourt')).toBeTruthy();
    expect(screen.getByText('luizabitt@gmail.com')).toBeTruthy();
    expect(screen.getByLabelText('Editar foto de perfil')).toBeTruthy();
    expect(screen.getByText('Editar Dados')).toBeTruthy();
    expect(screen.getByText('Alterar Senha')).toBeTruthy();
    expect(screen.getByText('Assinatura e plano')).toBeTruthy();
    expect(screen.getByText('Termos e condições')).toBeTruthy();
    expect(screen.getByText('Suporte')).toBeTruthy();
    expect(screen.getByText('Tornar Perfil indisponível')).toBeTruthy();
  });

  it('does not show placeholder name or email when the user is missing', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      signOut: mockSignOut,
    });

    const screen = render(<LawyerPerfilScreen />);

    expect(screen.queryByText('Luiza Bittencourt')).toBeNull();
    expect(screen.queryByText('luizabitt@gmail.com')).toBeNull();
  });

  it('opens edit data from the account menu', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Editar Dados'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/editar-dados');
  });

  it('opens change password from the account menu', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Alterar Senha'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/alterar-senha');
  });

  it('opens terms from the account menu', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Termos e condições'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/termos');
  });

  it('opens the image editor from the profile photo', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Editar foto de perfil'));

    expect(mockPickEditedImage).toHaveBeenCalledWith({ aspect: [1, 1] });
  });

  it('reflects stored availability on the profile toggle', () => {
    const available = render(<LawyerPerfilScreen />);

    expect(available.getByLabelText('Tornar Perfil indisponível').props.value).toBe(
      false,
    );
    available.unmount();

    mockUseMe.mockReturnValue({
      data: {
        photoKey: null,
        pushNotificationsEnabled: true,
        profileUnavailable: true,
      },
      isLoading: false,
    });

    const unavailable = render(<LawyerPerfilScreen />);

    expect(
      unavailable.getByLabelText('Tornar Perfil indisponível').props.value,
    ).toBe(true);
  });

  it('persists the profile availability toggle', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent(screen.getByLabelText('Tornar Perfil indisponível'), 'valueChange', true);

    expect(mockUpdateAvailability).toHaveBeenCalledWith({ profileUnavailable: true });
  });

  it('signs out and returns to login', () => {
    const screen = render(<LawyerPerfilScreen />);

    fireEvent.press(screen.getByLabelText('Sair da conta'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
