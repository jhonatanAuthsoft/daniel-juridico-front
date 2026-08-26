import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ClientEditAddressScreen } from '@/components/client-edit-data/client-edit-address-screen.component';
import { ClientEditDataHubScreen } from '@/components/client-edit-data/client-edit-data-hub.component';
import { ClientEditGeneralDataScreen } from '@/components/client-edit-data/client-edit-general-data-screen.component';
import { ClientEditPersonalProfileScreen } from '@/components/client-edit-data/client-edit-personal-profile-screen.component';
import type { ClientEditProfile } from '@/data/auth';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockUseMe = jest.fn();
const mockUpdateGeneralData = jest.fn().mockResolvedValue({});
const mockUpdateAddress = jest.fn().mockResolvedValue({});
const mockUpdatePersonalProfile = jest.fn().mockResolvedValue({});

const clientProfile: ClientEditProfile = {
  fullName: 'Maria Silva Lima',
  email: 'maria_silvalima@gmail.com',
  documentType: 'cpf',
  documentNumber: '111.444.777-35',
  rg: '12.345.67',
  cep: '01310-100',
  state: 'SP',
  city: 'São Paulo',
  neighborhood: 'Bela Vista',
  street: 'Av. Paulista',
  number: '1000',
  complement: 'Apto 12',
  pronouns: 'ELA',
  profession: 'Analista',
  maritalStatus: 'casado',
  monthlyIncome: '1.500,00',
};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    user: {
      id: 'mock-client',
      name: 'Maria Silva Lima',
      email: 'maria_silvalima@gmail.com',
      role: 'CLIENT',
    },
  }),
  useMe: () => mockUseMe(),
}));

jest.mock('@/domain/client', () => ({
  useUpdateClientGeneralData: () => ({
    mutateAsync: mockUpdateGeneralData,
    isPending: false,
  }),
  useUpdateClientAddress: () => ({
    mutateAsync: mockUpdateAddress,
    isPending: false,
  }),
  useUpdateClientPersonalProfile: () => ({
    mutateAsync: mockUpdatePersonalProfile,
    isPending: false,
  }),
}));

jest.mock('@/hooks/use-address-cep-autofill', () => ({
  useAddressCepAutofill: () => ({
    isFetchingCep: false,
    cepErrorMessage: undefined,
    cityOptions: [{ value: 'São Paulo', label: 'São Paulo' }],
    isLoadingCities: false,
    isCitiesError: false,
    hasCep: true,
    hasState: true,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

describe('ClientEditDataHubScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockUseMe.mockReturnValue({
      data: { photoKey: null, pushNotificationsEnabled: true, clientProfile },
      isLoading: false,
    });
  });

  it('lists the three edit sections with data from /me', () => {
    const screen = render(<ClientEditDataHubScreen />);

    expect(screen.getByText('Editar Dados Básicos')).toBeTruthy();
    expect(screen.getByText('Maria Silva Lima')).toBeTruthy();
    expect(screen.getByText('maria_silvalima@gmail.com')).toBeTruthy();
    expect(screen.getByText('Endereço')).toBeTruthy();
    expect(screen.getByText('Av. Paulista, Bela Vista, São Paulo - SP')).toBeTruthy();
    expect(screen.getByText('Perfil Pessoal')).toBeTruthy();
    expect(screen.getByText('R$ 1.500,00, Analista, Casado(a)')).toBeTruthy();
  });

  it('navigates to general data from the first card', () => {
    const screen = render(<ClientEditDataHubScreen />);

    fireEvent.press(screen.getByLabelText('Editar dados gerais'));

    expect(mockPush).toHaveBeenCalledWith('/client/perfil/dados-gerais');
  });

  it('navigates to address and personal profile', () => {
    const screen = render(<ClientEditDataHubScreen />);

    fireEvent.press(screen.getByLabelText('Editar endereço'));
    expect(mockPush).toHaveBeenCalledWith('/client/perfil/endereco');

    fireEvent.press(screen.getByLabelText('Editar perfil pessoal'));
    expect(mockPush).toHaveBeenCalledWith('/client/perfil/perfil-pessoal');
  });
});

describe('ClientEditGeneralDataScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
    mockUpdateGeneralData.mockClear();
    mockUseMe.mockReturnValue({
      data: { photoKey: null, pushNotificationsEnabled: true, clientProfile },
      isLoading: false,
    });
  });

  it('lets the client edit only the name and fills documents from /me', () => {
    const screen = render(<ClientEditGeneralDataScreen />);

    expect(screen.getByText('Alterar dados gerais')).toBeTruthy();
    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('CPF')).toBeTruthy();
    expect(screen.getByText('RG')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
    expect(screen.getByLabelText('Apagar conta')).toBeTruthy();

    expect(screen.getByDisplayValue('Maria Silva Lima').props.editable).not.toBe(false);
    expect(screen.getByDisplayValue('111.444.777-35').props.editable).toBe(false);
    expect(screen.getByDisplayValue('12.345.67').props.editable).toBe(false);
    expect(screen.getByDisplayValue('maria_silvalima@gmail.com').props.editable).toBe(
      false,
    );
  });

  it('saves the name and goes back', async () => {
    const screen = render(<ClientEditGeneralDataScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateGeneralData).toHaveBeenCalledWith({
        fullName: 'Maria Silva Lima',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it('opens delete account from general data', () => {
    const screen = render(<ClientEditGeneralDataScreen />);

    fireEvent.press(screen.getByLabelText('Apagar conta'));

    expect(mockPush).toHaveBeenCalledWith('/client/perfil/apagar-conta');
  });

  it('shows CNPJ instead of CPF and RG when the client is PJ', () => {
    mockUseMe.mockReturnValue({
      data: {
        photoKey: null,
        pushNotificationsEnabled: true,
        clientProfile: {
          ...clientProfile,
          fullName: 'Empresa Exemplo LTDA',
          documentType: 'cnpj',
          documentNumber: '11.222.333/0001-81',
          rg: '',
        },
      },
      isLoading: false,
    });

    const screen = render(<ClientEditGeneralDataScreen />);

    expect(screen.getByText('CNPJ')).toBeTruthy();
    expect(screen.queryByText('CPF')).toBeNull();
    expect(screen.queryByText('RG')).toBeNull();
    expect(screen.getByDisplayValue('11.222.333/0001-81').props.editable).toBe(false);
  });
});

describe('ClientEditAddressScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateAddress.mockClear();
    mockUseMe.mockReturnValue({
      data: { photoKey: null, pushNotificationsEnabled: true, clientProfile },
      isLoading: false,
    });
  });

  it('shows the address fields filled from /me', () => {
    const screen = render(<ClientEditAddressScreen />);

    expect(screen.getByText('Alterar endereço')).toBeTruthy();
    expect(screen.getByDisplayValue('01310-100')).toBeTruthy();
    expect(screen.getByDisplayValue('Av. Paulista')).toBeTruthy();
    expect(screen.getByDisplayValue('1000')).toBeTruthy();
    expect(screen.getByDisplayValue('Apto 12')).toBeTruthy();
    expect(screen.getByDisplayValue('Bela Vista')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('saves the address and goes back', async () => {
    const screen = render(<ClientEditAddressScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateAddress).toHaveBeenCalledWith({
        cep: '01310-100',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Bela Vista',
        street: 'Av. Paulista',
        number: '1000',
        complement: 'Apto 12',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('ClientEditPersonalProfileScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdatePersonalProfile.mockClear();
    mockUseMe.mockReturnValue({
      data: { photoKey: null, pushNotificationsEnabled: true, clientProfile },
      isLoading: false,
    });
  });

  it('shows personal profile fields filled from /me', () => {
    const screen = render(<ClientEditPersonalProfileScreen />);

    expect(screen.getByText('Editar perfil pessoal')).toBeTruthy();
    expect(screen.getByText('Pronomes de tratamento')).toBeTruthy();
    expect(screen.getByText('Ela/Dela')).toBeTruthy();
    expect(screen.getByDisplayValue('Analista')).toBeTruthy();
    expect(screen.getByText('Casado(a)')).toBeTruthy();
    expect(screen.getByDisplayValue('1.500,00')).toBeTruthy();
    expect(
      screen.getByLabelText('Tornar essas informações públicas para os advogados'),
    ).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('saves the personal profile and goes back', async () => {
    const screen = render(<ClientEditPersonalProfileScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdatePersonalProfile).toHaveBeenCalledWith({
        documentType: 'cpf',
        pronouns: 'ELA',
        profession: 'Analista',
        maritalStatus: 'casado',
        monthlyIncome: '1.500,00',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});
