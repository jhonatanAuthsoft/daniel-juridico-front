import { fireEvent, render } from '@testing-library/react-native';

import type { ArquivoFinalidade } from '@/data/arquivo';
import type { ConfirmedSignupImage } from '@/hooks/use-image-edit-flow';

import { AccountProfilePhoto } from './account-profile-photo.component';

const mockPickEditedImage = jest.fn();
const mockMutatePhoto = jest.fn();
let capturedOnConfirm:
  | ((result: string | ConfirmedSignupImage) => void)
  | undefined;
let capturedFinalidade: ArquivoFinalidade | undefined;

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    user: { role: 'CLIENT', name: 'Maria', email: 'm@a.com' },
  }),
  useMe: () => ({
    data: { photoKey: null, pushNotificationsEnabled: true },
    isLoading: false,
  }),
  useUpdateProfilePhoto: () => ({
    mutate: mockMutatePhoto,
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
  useImageEditFlow: (
    onConfirm: (result: string | ConfirmedSignupImage) => void,
    options?: { uploadFinalidade?: ArquivoFinalidade },
  ) => {
    capturedOnConfirm = onConfirm;
    capturedFinalidade = options?.uploadFinalidade;
    return {
      pickEditedImage: mockPickEditedImage,
      editModal: null,
      isUploading: false,
    };
  },
}));

describe('AccountProfilePhoto', () => {
  beforeEach(() => {
    mockPickEditedImage.mockReset();
    mockMutatePhoto.mockReset();
    capturedOnConfirm = undefined;
    capturedFinalidade = undefined;
  });

  it('opens the image editor when the edit control is pressed', () => {
    const screen = render(<AccountProfilePhoto />);

    fireEvent.press(screen.getByLabelText('Editar foto de perfil'));

    expect(mockPickEditedImage).toHaveBeenCalledWith({ aspect: [1, 1] });
    expect(capturedFinalidade).toBe('CLIENTE_PERFIL');
  });

  it('saves the uploaded S3 key on the profile', () => {
    render(<AccountProfilePhoto />);

    capturedOnConfirm?.({
      uri: 'file://local.jpg',
      key: 'tmp/clientes/perfil/11111111-1111-1111-1111-111111111111.jpg',
    });

    expect(mockMutatePhoto).toHaveBeenCalledWith(
      {
        photoKey:
          'tmp/clientes/perfil/11111111-1111-1111-1111-111111111111.jpg',
      },
      expect.objectContaining({ onError: expect.any(Function) }),
    );
  });
});
