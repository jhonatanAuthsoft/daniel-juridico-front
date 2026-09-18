import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Image } from 'react-native';

import { LawyerEditAddressScreen } from '@/components/lawyer-edit-data/lawyer-edit-address-screen.component';
import { LawyerEditBillingScreen } from '@/components/lawyer-edit-data/lawyer-edit-billing-screen.component';
import { LawyerEditBioScreen } from '@/components/lawyer-edit-data/lawyer-edit-bio-screen.component';
import { LawyerEditDataHubScreen } from '@/components/lawyer-edit-data/lawyer-edit-data-hub.component';
import { LawyerEditDocumentationScreen } from '@/components/lawyer-edit-data/lawyer-edit-documentation-screen.component';
import { LawyerEditEducationScreen } from '@/components/lawyer-edit-data/lawyer-edit-education-screen.component';
import { LawyerEditNameEmailScreen } from '@/components/lawyer-edit-data/lawyer-edit-name-email-screen.component';
import { LawyerEditPracticeAreasScreen } from '@/components/lawyer-edit-data/lawyer-edit-practice-areas-screen.component';
import { LawyerEditServiceRadiusScreen } from '@/components/lawyer-edit-data/lawyer-edit-service-radius-screen.component';
import { LawyerEditSpecialtiesScreen } from '@/components/lawyer-edit-data/lawyer-edit-specialties-screen.component';
import type { LawyerEditProfile } from '@/data/auth';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockUseMe = jest.fn();
const mockUpdateGeneralData = jest.fn().mockResolvedValue({});
const mockUpdateAddress = jest.fn().mockResolvedValue({});
const mockUpdateBilling = jest.fn().mockResolvedValue({});
const mockUpdateBiography = jest.fn().mockResolvedValue({});
const mockUpdateDocumentation = jest.fn().mockResolvedValue({});
const mockUpdateGraduation = jest.fn().mockResolvedValue({});
const mockUpdateServiceAreas = jest.fn().mockResolvedValue({});
const mockUpdatePracticeAreas = jest.fn().mockResolvedValue({});
const mockUpdateSpecialties = jest.fn().mockResolvedValue({});

const lawyerProfile: LawyerEditProfile = {
  fullName: 'Luiza Bittencourt',
  email: 'luizabitt@gmail.com',
  phone: '(11) 98888-7777',
  birthDate: '20/05/1990',
  cep: '01310-100',
  state: 'SP',
  city: 'São Paulo',
  neighborhood: 'Bolivia',
  street: 'Rua Flamingos',
  number: '12',
  complement: '',
  billingMethods: ['contractual', 'percentage', 'court_awarded'],
  biography: 'Porem ipsum dolor sit amet, consectetur adipiscing elit.',
  pronouns: 'DOUTORA',
  oabNumber: '127.583',
  oabUf: 'BA',
  oabIssueDate: '15/03/2016',
  oabPhotoUris: ['https://cdn.example/oab-front.jpg', 'https://cdn.example/oab-back.jpg'],
  oabPhotoKeys: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
  supplementalOabs: [
    { number: '484752004401', uf: 'BA', issueDate: '10/01/2018', photoUris: [], photoKeys: [] },
  ],
  university: 'Faculdade Gétulio Vargas',
  course: 'Direito',
  graduationYear: '2015',
  postgraduates: [{ university: 'FGV', course: 'LLM Direito Digital', year: '2020' }],
  serviceAreas: [{ state: 'SP', cities: ['Adamantina', 'Avaré'] }],
  practiceAreas: ['generalista', 'consultor'],
  specialties: ['CIVIL:CONTRATOS'],
  specialtyLabels: ['Contratos'],
};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

jest.mock('@/domain/arquivo', () => ({
  useResolvedImageUri: (keyOrUri?: string | null) => {
    const value = keyOrUri?.trim() ?? '';
    if (!value) {
      return { uri: '', isResolving: false, isError: false };
    }
    if (/^(https?:|file:)/i.test(value)) {
      return { uri: value, isResolving: false, isError: false };
    }
    return {
      uri: `https://signed.example/${value}`,
      isResolving: false,
      isError: false,
    };
  },
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    user: {
      id: 'mock-lawyer',
      name: 'Luiza Bittencourt',
      email: 'luizabitt@gmail.com',
      role: 'LAWYER',
    },
  }),
  useMe: () => mockUseMe(),
}));

jest.mock('@/domain/lawyer', () => ({
  useUpdateLawyerGeneralData: () => ({
    mutateAsync: mockUpdateGeneralData,
    isPending: false,
  }),
  useUpdateLawyerAddress: () => ({
    mutateAsync: mockUpdateAddress,
    isPending: false,
  }),
  useUpdateLawyerBilling: () => ({
    mutateAsync: mockUpdateBilling,
    isPending: false,
  }),
  useUpdateLawyerBiography: () => ({
    mutateAsync: mockUpdateBiography,
    isPending: false,
  }),
  useUpdateLawyerDocumentation: () => ({
    mutateAsync: mockUpdateDocumentation,
    isPending: false,
  }),
  useUpdateLawyerGraduation: () => ({
    mutateAsync: mockUpdateGraduation,
    isPending: false,
  }),
  useUpdateLawyerServiceAreas: () => ({
    mutateAsync: mockUpdateServiceAreas,
    isPending: false,
  }),
  useUpdateLawyerPracticeAreas: () => ({
    mutateAsync: mockUpdatePracticeAreas,
    isPending: false,
  }),
  useUpdateLawyerSpecialties: () => ({
    mutateAsync: mockUpdateSpecialties,
    isPending: false,
  }),
}));

jest.mock('@/domain/catalog', () => ({
  useSpecialtiesCatalog: () => ({
    data: {
      categories: [
        {
          id: 'CIVIL',
          code: 'CIVIL',
          label: 'Direito Civil',
          children: [
            { id: 'CIVIL:CONTRATOS', code: 'CONTRATOS', label: 'Contratos' },
            { id: 'CIVIL:FAMILIA', code: 'FAMILIA', label: 'Família' },
          ],
        },
      ],
    },
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

jest.mock('@/domain/address', () => ({
  useCitiesByUf: (uf: string) => ({
    data:
      uf === 'SP'
        ? [
            { value: 'Adamantina', label: 'Adamantina' },
            { value: 'Avaré', label: 'Avaré' },
            { value: 'Campinas', label: 'Campinas' },
          ]
        : uf === 'BA'
          ? [{ value: 'Salvador', label: 'Salvador' }]
          : [],
    isFetching: false,
    isError: false,
  }),
}));

jest.mock('@/hooks/use-address-cep-autofill', () => ({
  useAddressCepAutofill: () => ({
    isFetchingCep: false,
    cepErrorMessage: undefined,
    cityOptions: [{ value: 'São Paulo', label: 'São Paulo' }],
    isLoadingCities: false,
    isCitiesError: false,
    hasCep: false,
    hasState: true,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaView: View,
    SafeAreaInsetsContext: React.createContext(insets),
    useSafeAreaInsets: () => insets,
  };
});

beforeEach(() => {
  mockUseMe.mockReturnValue({
    data: {
      photoKey: null,
      pushNotificationsEnabled: true,
      clientProfile: null,
      lawyerProfile,
    },
    isLoading: false,
  });
});

describe('LawyerEditDataHubScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
  });

  it('lists the lawyer edit sections matching the hub', () => {
    const screen = render(<LawyerEditDataHubScreen />);

    expect(screen.getByText('Editar Dados Básicos')).toBeTruthy();
    expect(screen.getByText('Luiza Bittencourt')).toBeTruthy();
    expect(screen.getByText('luizabitt@gmail.com')).toBeTruthy();
    expect(screen.getByText('Endereço')).toBeTruthy();
    expect(screen.getByText('Rua Flamingos, Bolivia, São Paulo - SP')).toBeTruthy();
    expect(screen.getByText('Método de cobrança')).toBeTruthy();
    expect(
      screen.getByText('Honorários Contratuais, Percentuais, Arbitrados judicialmente'),
    ).toBeTruthy();
    expect(screen.getByText('Biografia')).toBeTruthy();
    expect(
      screen.getByText('Porem ipsum dolor sit amet, consectetur adipiscing elit.'),
    ).toBeTruthy();
    expect(screen.getByText('Doutora/(Dra)')).toBeTruthy();
    expect(screen.getByText('Documentação')).toBeTruthy();
    expect(screen.getByText('OAB/BA 127.583')).toBeTruthy();
    expect(screen.getByText('Formação')).toBeTruthy();
    expect(screen.getByText('Faculdade Gétulio Vargas')).toBeTruthy();
    expect(screen.getByText('Raio de atuação')).toBeTruthy();
    expect(screen.getByText('SP: Adamantina; Avaré')).toBeTruthy();
    expect(screen.getByText('Atuação')).toBeTruthy();
    expect(screen.getByText('Generalista, Consultor')).toBeTruthy();
    expect(screen.getByText('Especialização')).toBeTruthy();
    expect(screen.getByText('Contratos')).toBeTruthy();
    expect(screen.getByLabelText('Apagar conta')).toBeTruthy();
  });

  it('navigates to the edit screens from the hub cards', () => {
    const screen = render(<LawyerEditDataHubScreen />);

    fireEvent.press(screen.getByLabelText('Editar nome e email'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/nome-email');

    fireEvent.press(screen.getByLabelText('Editar endereço'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/endereco');

    fireEvent.press(screen.getByLabelText('Editar métodos de cobrança'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/metodos-cobranca');

    fireEvent.press(screen.getByLabelText('Editar biografia e pronome'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/biografia');

    fireEvent.press(screen.getByLabelText('Editar documentação'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/documentacao');

    fireEvent.press(screen.getByLabelText('Editar formação'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/graduacao');

    fireEvent.press(screen.getByLabelText('Editar raio de atuação'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/raio-atuacao');

    fireEvent.press(screen.getByLabelText('Editar atuação'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/atuacao');

    fireEvent.press(screen.getByLabelText('Editar especialização'));
    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/especializacao');
  });

  it('opens delete account from the hub footer', () => {
    const screen = render(<LawyerEditDataHubScreen />);

    fireEvent.press(screen.getByLabelText('Apagar conta'));

    expect(mockPush).toHaveBeenCalledWith('/lawyer/perfil/apagar-conta');
  });
});

describe('LawyerEditNameEmailScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateGeneralData.mockClear();
  });

  it('lets the lawyer edit the name and birth date', () => {
    const screen = render(<LawyerEditNameEmailScreen />);

    expect(screen.getByText('Alterar nome e email')).toBeTruthy();
    expect(screen.getByText('Nome Completo (Nome Social)')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Telefone')).toBeTruthy();
    expect(screen.getByText('Data de Nascimento')).toBeTruthy();
    expect(screen.getByDisplayValue('Luiza Bittencourt').props.editable).not.toBe(false);
    expect(screen.getByDisplayValue('luizabitt@gmail.com').props.editable).toBe(false);
    expect(screen.getByDisplayValue('(11) 98888-7777').props.editable).not.toBe(false);
    expect(screen.getByDisplayValue('20/05/1990').props.editable).not.toBe(false);
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('saves the name and birth date and goes back', async () => {
    const screen = render(<LawyerEditNameEmailScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateGeneralData).toHaveBeenCalledWith({
        fullName: 'Luiza Bittencourt',
        phone: '(11) 98888-7777',
        birthDate: '20/05/1990',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('LawyerEditAddressScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateAddress.mockClear();
  });

  it('shows the address fields', () => {
    const screen = render(<LawyerEditAddressScreen />);

    expect(screen.getByText('Alterar endereço')).toBeTruthy();
    expect(screen.getByText('CEP')).toBeTruthy();
    expect(screen.getByPlaceholderText('Digite seu CEP')).toBeTruthy();
    expect(screen.getByText('Estado')).toBeTruthy();
    expect(screen.getByText('Cidade')).toBeTruthy();
    expect(screen.getByText('Bairro')).toBeTruthy();
    expect(screen.getByPlaceholderText('Digite o bairro')).toBeTruthy();
    expect(screen.getByDisplayValue('Bolivia')).toBeTruthy();
    expect(screen.getByText('Logradouro')).toBeTruthy();
    expect(screen.getByDisplayValue('Rua Flamingos')).toBeTruthy();
    expect(screen.getByText('Número')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ex 12')).toBeTruthy();
    expect(screen.getByText('Complemento (opcional)')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ex. Casa')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('saves the address and goes back', async () => {
    const screen = render(<LawyerEditAddressScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateAddress).toHaveBeenCalledWith({
        cep: '01310-100',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Bolivia',
        street: 'Rua Flamingos',
        number: '12',
        complement: '',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('LawyerEditBillingScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateBilling.mockClear();
  });

  it('shows the billing methods checklist', () => {
    const screen = render(<LawyerEditBillingScreen />);

    expect(screen.getByText('Alterar Métodos de Cobrança')).toBeTruthy();
    expect(
      screen.getByText('Escolha suas especialidades para receber demandas compatíveis.'),
    ).toBeTruthy();
    expect(screen.getByText('Honorários contratuais')).toBeTruthy();
    expect(screen.getByText('Honorários percentuais')).toBeTruthy();
    expect(screen.getByText('Honorários arbitrados judicialmente')).toBeTruthy();
    expect(screen.getByText('A combinar')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();

    const options = screen.getAllByRole('checkbox');
    expect(options).toHaveLength(4);
    expect(options[0].props.accessibilityState).toEqual({ checked: true });
    expect(options[1].props.accessibilityState).toEqual({ checked: true });
    expect(options[2].props.accessibilityState).toEqual({ checked: true });
    expect(options[3].props.accessibilityState).toEqual({ checked: false });
  });

  it('saves billing methods and goes back', async () => {
    const screen = render(<LawyerEditBillingScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateBilling).toHaveBeenCalledWith({
        billingMethods: ['contractual', 'percentage', 'court_awarded'],
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('LawyerEditBioScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateBiography.mockClear();
  });

  it('shows biography and treatment pronoun fields', () => {
    const screen = render(<LawyerEditBioScreen />);

    expect(screen.getByText('Alterar biografia e pronome')).toBeTruthy();
    expect(screen.getByText('Pronome de tratamento')).toBeTruthy();
    expect(screen.getByText('Doutora (Dra.)')).toBeTruthy();
    expect(screen.getByText('Biografia')).toBeTruthy();
    expect(
      screen.getByDisplayValue('Porem ipsum dolor sit amet, consectetur adipiscing elit.'),
    ).toBeTruthy();
    expect(screen.getByText('800 caracteres')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('saves biography and goes back', async () => {
    const screen = render(<LawyerEditBioScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateBiography).toHaveBeenCalledWith({
        pronouns: 'DOUTORA',
        biography: 'Porem ipsum dolor sit amet, consectetur adipiscing elit.',
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('LawyerEditEducationScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateGraduation.mockClear();
  });

  it('shows graduation fields and saved postgraduates', () => {
    const screen = render(<LawyerEditEducationScreen />);

    expect(screen.getByText('Formação')).toBeTruthy();
    expect(screen.getByText('Universidade de Formação')).toBeTruthy();
    expect(screen.getByDisplayValue('Faculdade Gétulio Vargas')).toBeTruthy();
    expect(screen.getByText('Curso')).toBeTruthy();
    expect(screen.getByText('Ano de formação')).toBeTruthy();
    expect(screen.getByText('Pós-graduação')).toBeTruthy();
    expect(screen.getByText('LLM Direito Digital')).toBeTruthy();
    expect(screen.getByText('FGV - 2020')).toBeTruthy();
    expect(screen.getByText('+ Adicionar Pós-Graduação')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('adds a postgraduate to the list', async () => {
    const screen = render(<LawyerEditEducationScreen />);

    fireEvent.press(screen.getByText('+ Adicionar Pós-Graduação'));
    fireEvent.changeText(screen.getAllByPlaceholderText('Digite o nome da universidade')[1], 'USP');
    fireEvent.changeText(screen.getAllByPlaceholderText('Digite o curso')[1], 'Mestrado em Direito');
    fireEvent.changeText(screen.getAllByPlaceholderText('Digite o ano de formação')[1], '2022');
    fireEvent.press(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('Mestrado em Direito')).toBeTruthy();
    });
    expect(screen.getByText('USP - 2022')).toBeTruthy();
  });

  it('deletes a saved postgraduate', () => {
    const screen = render(<LawyerEditEducationScreen />);

    fireEvent.press(screen.getByLabelText('Excluir pós-graduação'));

    expect(screen.queryByText('LLM Direito Digital')).toBeNull();
    expect(screen.queryByText('FGV - 2020')).toBeNull();
  });

  it('saves graduation with postgraduates and goes back', async () => {
    const screen = render(<LawyerEditEducationScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateGraduation).toHaveBeenCalledWith({
        university: 'Faculdade Gétulio Vargas',
        course: 'Direito',
        graduationYear: '2015',
        postgraduates: [{ university: 'FGV', course: 'LLM Direito Digital', year: '2020' }],
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('LawyerEditDocumentationScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateDocumentation.mockClear();
  });

  it('shows signed read URLs for stored OAB wallet photos', () => {
    mockUseMe.mockReturnValue({
      data: {
        photoKey: null,
        pushNotificationsEnabled: true,
        clientProfile: null,
        lawyerProfile: {
          ...lawyerProfile,
          oabPhotoUris: [
            'tmp/advogados/oab/front.jpg',
            'tmp/advogados/oab/back.jpg',
          ],
          oabPhotoKeys: [
            'tmp/advogados/oab/front.jpg',
            'tmp/advogados/oab/back.jpg',
          ],
        },
      },
      isLoading: false,
    });

    const screen = render(<LawyerEditDocumentationScreen />);
    fireEvent.press(screen.getByLabelText('OAB Principal'));

    const uris = screen
      .UNSAFE_getAllByType(Image)
      .map((node) => node.props.source?.uri)
      .filter(Boolean);
    expect(uris).toEqual([
      'https://signed.example/tmp/advogados/oab/front.jpg',
      'https://signed.example/tmp/advogados/oab/back.jpg',
    ]);
  });

  it('lists principal and supplemental OAB cards', () => {
    const screen = render(<LawyerEditDocumentationScreen />);

    expect(screen.getByText('Alterar documentação')).toBeTruthy();
    expect(screen.getByText('OAB Principal')).toBeTruthy();
    expect(screen.getByText('127.583 - BA')).toBeTruthy();
    expect(screen.getByText('OAB Suplementar')).toBeTruthy();
    expect(screen.getByText('484752004401 - BA')).toBeTruthy();
    expect(screen.getByText('Número da OAB E UF')).toBeTruthy();
    expect(screen.getByText('Foto da Carteira (Frente e verso)')).toBeTruthy();
    expect(screen.getByText('Editar')).toBeTruthy();
    expect(screen.getByText('Apagar')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('opens the OAB edit form from Editar', () => {
    const screen = render(<LawyerEditDocumentationScreen />);

    fireEvent.press(screen.getByText('Editar'));

    expect(screen.getByText('Número da OAB')).toBeTruthy();
    expect(screen.getByPlaceholderText('Digite o número da OAB')).toBeTruthy();
    expect(screen.getByText('UF da OAB Suplementar')).toBeTruthy();
    expect(screen.getByText('Foto da frente e verso da carteira')).toBeTruthy();
    expect(screen.getByLabelText('Fechar OAB Suplementar')).toBeTruthy();
  });

  it('does not save when primary OAB photos were removed', async () => {
    mockUseMe.mockReturnValue({
      data: {
        photoKey: null,
        pushNotificationsEnabled: true,
        clientProfile: null,
        lawyerProfile: {
          ...lawyerProfile,
          oabPhotoUris: [],
          oabPhotoKeys: [],
        },
      },
      isLoading: false,
    });

    const screen = render(<LawyerEditDocumentationScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(screen.getAllByText('Anexe as fotos de frente e verso').length).toBeGreaterThan(0);
    });
    expect(mockUpdateDocumentation).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('saves documentation and goes back', async () => {
    const screen = render(<LawyerEditDocumentationScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateDocumentation).toHaveBeenCalledWith({
        oabNumber: '127.583',
        oabUf: 'BA',
        oabIssueDate: '15/03/2016',
        oabPhotoKeys: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
        supplementalOabs: [
          {
            number: '484752004401',
            uf: 'BA',
            issueDate: '10/01/2018',
            photoKeys: [],
          },
        ],
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

type EditScreen = ReturnType<typeof render>;

function selectOption(screen: EditScreen, placeholder: string, optionLabel: string) {
  fireEvent.press(screen.getByText(placeholder));
  fireEvent.changeText(screen.getByLabelText('Buscar...'), optionLabel);
  fireEvent.press(screen.getByRole('button', { name: optionLabel }));
}

describe('LawyerEditServiceRadiusScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateServiceAreas.mockClear();
  });

  it('shows the editor, the seeded state card and the save action', () => {
    const screen = render(<LawyerEditServiceRadiusScreen />);

    expect(screen.getByText('Raio de atuação')).toBeTruthy();
    expect(screen.getByText('Estado')).toBeTruthy();
    expect(screen.getByText('Cidade')).toBeTruthy();
    expect(screen.getByText('Selecione o estado')).toBeTruthy();
    expect(screen.getByText('Selecione a cidade')).toBeTruthy();
    expect(screen.getByText('+ Adicionar nova cidade')).toBeTruthy();
    expect(screen.getByText('São Paulo')).toBeTruthy();
    expect(screen.getByText('Adamantina; Avaré')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('adds a city to the selected state', async () => {
    const screen = render(<LawyerEditServiceRadiusScreen />);

    selectOption(screen, 'Selecione o estado', 'São Paulo');
    selectOption(screen, 'Selecione a cidade', 'Campinas');
    fireEvent.press(screen.getByText('+ Adicionar nova cidade'));

    await waitFor(() => {
      expect(screen.getByText('Adamantina; Avaré; Campinas')).toBeTruthy();
    });
    expect(screen.getAllByText('São Paulo')).toHaveLength(1);
    expect(screen.getByText('Selecione a cidade')).toBeTruthy();
  });

  it('loads a saved state into the editor', () => {
    const screen = render(<LawyerEditServiceRadiusScreen />);

    fireEvent.press(screen.getByLabelText('Editar cidades de São Paulo'));

    expect(screen.getAllByText('São Paulo').length).toBeGreaterThan(1);
  });

  it('deletes a saved state', () => {
    const screen = render(<LawyerEditServiceRadiusScreen />);

    fireEvent.press(screen.getByLabelText('Excluir São Paulo'));

    expect(screen.queryByText('Adamantina; Avaré')).toBeNull();
    expect(screen.queryByText('São Paulo')).toBeNull();
  });

  it('saves the service areas and goes back', async () => {
    const screen = render(<LawyerEditServiceRadiusScreen />);

    fireEvent.press(screen.getByLabelText('Excluir São Paulo'));
    selectOption(screen, 'Selecione o estado', 'Bahia');
    selectOption(screen, 'Selecione a cidade', 'Salvador');
    fireEvent.press(screen.getByText('+ Adicionar nova cidade'));
    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateServiceAreas).toHaveBeenCalledWith({
        serviceAreas: [{ state: 'BA', cities: ['Salvador'] }],
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it('does not save when every state was removed', async () => {
    const screen = render(<LawyerEditServiceRadiusScreen />);

    fireEvent.press(screen.getByLabelText('Excluir São Paulo'));
    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(screen.getByText('Selecione ao menos uma cidade de atuação')).toBeTruthy();
    });
    expect(screen.queryByText('Campo obrigatório')).toBeNull();
    expect(mockUpdateServiceAreas).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
  });
});

describe('LawyerEditPracticeAreasScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdatePracticeAreas.mockClear();
  });

  it('shows the practice-area checklist seeded from the profile', () => {
    const screen = render(<LawyerEditPracticeAreasScreen />);

    expect(screen.getByText('Alterar atuação')).toBeTruthy();
    expect(
      screen.getByText(
        'Selecione sua área de atuação para receber solicitações alinhadas ao seu perfil profissional.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Pautista')).toBeTruthy();
    expect(screen.getByText('Generalista')).toBeTruthy();
    expect(screen.getByText('Consultor')).toBeTruthy();
    expect(screen.getByText('Correspondente / Outras atividades')).toBeTruthy();
    expect(screen.getByText('Nenhuma das anteriores')).toBeTruthy();
    expect(screen.getByText('Salvar alterações')).toBeTruthy();

    const options = screen.getAllByRole('checkbox');
    expect(options).toHaveLength(5);
    expect(options[0].props.accessibilityState).toEqual({ checked: false });
    expect(options[1].props.accessibilityState).toEqual({ checked: true });
    expect(options[2].props.accessibilityState).toEqual({ checked: true });
    expect(options[3].props.accessibilityState).toEqual({ checked: false });
    expect(options[4].props.accessibilityState).toEqual({ checked: false });
  });

  it('saves practice areas and goes back', async () => {
    const screen = render(<LawyerEditPracticeAreasScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdatePracticeAreas).toHaveBeenCalledWith({
        practiceAreas: ['generalista', 'consultor'],
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('LawyerEditSpecialtiesScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUpdateSpecialties.mockClear();
  });

  it('shows the specialties catalog seeded from the profile', () => {
    const screen = render(<LawyerEditSpecialtiesScreen />);

    expect(screen.getByText('Alterar especialização')).toBeTruthy();
    expect(
      screen.getByText('Escolha suas especialidades para receber demandas compatíveis.'),
    ).toBeTruthy();
    expect(screen.getByPlaceholderText('Buscar...')).toBeTruthy();
    expect(screen.getByText('Direito Civil')).toBeTruthy();
    expect(screen.getAllByText('Contratos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Família').length).toBeGreaterThan(0);
    expect(screen.getByText('Salvar alterações')).toBeTruthy();

    const contratos = screen.getAllByRole('checkbox', { name: 'Contratos' });
    const familia = screen.getAllByRole('checkbox', { name: 'Família' });
    expect(contratos.some((node) => node.props.accessibilityState?.checked)).toBe(true);
    expect(familia.every((node) => !node.props.accessibilityState?.checked)).toBe(true);
  });

  it('saves specialties and goes back', async () => {
    const screen = render(<LawyerEditSpecialtiesScreen />);

    fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() => {
      expect(mockUpdateSpecialties).toHaveBeenCalledWith({
        specialties: ['CIVIL:CONTRATOS'],
      });
    });
    expect(mockBack).toHaveBeenCalled();
  });
});
