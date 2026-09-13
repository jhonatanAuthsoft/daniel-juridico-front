import { fireEvent, render } from '@testing-library/react-native';

import { LawyerProfilePreviewScreen } from '@/components/lawyer-account';

const mockBack = jest.fn();
const mockRefetch = jest.fn();
const mockFetchNextPage = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('@/domain/auth', () => ({
  useAuth: () => ({
    user: { id: 'adv-user-1', role: 'LAWYER' },
  }),
}));

jest.mock('@/domain/lawyer', () => ({
  usePublicLawyerProfile: () => mockUsePublicLawyerProfile(),
  useLawyerReviews: () => ({
    data: {
      pages: [
        {
          items: [
            {
              id: 'rev-1',
              reviewerName: 'Ana Cliente',
              rating: 5,
              comment: 'Excelente atendimento.',
              isOwn: false,
            },
          ],
          total: 1,
          averageRating: 4.5,
          canReview: true,
        },
      ],
    },
    hasNextPage: false,
    isFetchingNextPage: false,
    isPending: false,
    isError: false,
    fetchNextPage: mockFetchNextPage,
    refetch: jest.fn(),
  }),
}));

jest.mock('@/domain/arquivo', () => ({
  useObjectReadUrl: () => ({ data: undefined, isLoading: false }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

let profileState: {
  data: Record<string, unknown> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

function mockUsePublicLawyerProfile() {
  return {
    ...profileState,
    refetch: mockRefetch,
  };
}

const sampleProfile = {
  id: 'adv-user-1',
  name: 'Maria Gomes',
  fullName: 'Maria Gomes Silva',
  socialName: null,
  honorific: 'Doutora/Dra.',
  photoKey: null,
  biography: 'Especialista em direito civil.',
  availability: 'DISPONIVEL',
  isAvailable: true,
  averageRating: 4.5,
  totalReviews: 1,
  university: 'USP',
  course: 'Direito',
  graduationYear: 2015,
  practiceSince: '2016-01-10',
  yearsOfExperience: 8,
  addressLabel: 'Bela Vista, São Paulo - SP',
  primaryOab: { number: '155242', uf: 'SP', isPrimary: true },
  supplementalOabs: [{ number: '99887', uf: 'RJ', isPrimary: false }],
  modalities: [{ code: 'PAUTISTA', name: 'Pautista' }],
  specialties: [{ code: 'CIVIL', name: 'Direito Civil' }],
  subspecialties: [{ code: 'CONTRATOS', name: 'Contratos' }],
  billingMethods: [
    { code: 'HONORARIOS_CONTRATUAIS', name: 'Honorários Contratuais' },
  ],
  serviceAreas: [{ state: 'SP', city: 'São Paulo' }],
};

describe('LawyerProfilePreviewScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockRefetch.mockClear();
    mockFetchNextPage.mockClear();
    profileState = {
      data: sampleProfile,
      isLoading: false,
      isError: false,
      error: null,
    };
  });

  it('shows the same public profile the client sees', () => {
    const screen = render(<LawyerProfilePreviewScreen />);

    expect(screen.getByText('Visualizar perfil')).toBeTruthy();
    expect(screen.getByText('Maria Gomes (Doutora/Dra.)')).toBeTruthy();
    expect(screen.getByText('Disponível')).toBeTruthy();
    expect(screen.getByText('Pautista - OAB 155242/SP')).toBeTruthy();
    expect(screen.getByText('Especialista em direito civil.')).toBeTruthy();
    expect(screen.getByText('OAB 99887/RJ')).toBeTruthy();
    expect(screen.getByText('Avaliações')).toBeTruthy();
    expect(screen.getByText('(1)')).toBeTruthy();
    expect(screen.getByLabelText('4,5 estrelas em média')).toBeTruthy();
    expect(screen.getByText('Ana Cliente')).toBeTruthy();
    expect(screen.getByText('Excelente atendimento.')).toBeTruthy();
    expect(screen.getByText('5 estrelas')).toBeTruthy();
  });

  it('does not offer connection or review actions', () => {
    const screen = render(<LawyerProfilePreviewScreen />);

    expect(screen.queryByText('Solicitar conexão')).toBeNull();
    expect(screen.queryByText('Deixar uma avaliação')).toBeNull();
    expect(screen.queryByLabelText('Deixar uma avaliação')).toBeNull();
  });

  it('allows retry when the preview fails to load', () => {
    profileState = {
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Falha ao carregar'),
    };
    const screen = render(<LawyerProfilePreviewScreen />);

    expect(screen.getByText('Não foi possível carregar o perfil')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Tentar novamente'));
    expect(mockRefetch).toHaveBeenCalled();
  });
});
