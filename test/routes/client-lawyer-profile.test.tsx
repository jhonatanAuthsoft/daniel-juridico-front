import { fireEvent, render } from '@testing-library/react-native';

import ClientLawyerProfileScreen from '@/app/client/advogado/[id]';

const mockBack = jest.fn();
const mockRefetch = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'adv-user-1' }),
  useRouter: () => ({ back: mockBack }),
}));

jest.mock('@/domain/lawyer', () => ({
  usePublicLawyerProfile: () => mockUsePublicLawyerProfile(),
  useLawyerReviews: () => ({ data: undefined, isLoading: false }),
  useCreateLawyerReview: () => ({ isPending: false, mutateAsync: jest.fn() }),
  useDeleteLawyerReview: () => ({ isPending: false, mutateAsync: jest.fn() }),
}));

jest.mock('@/domain/connection', () => ({
  useLawyerConnectionStatus: () => ({ data: undefined }),
  useCreateConnection: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useCancelConnection: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('@/domain/arquivo', () => ({
  useObjectReadUrl: () => ({ data: undefined, isLoading: false }),
}));

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
  totalReviews: 12,
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

describe('ClientLawyerProfileScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockRefetch.mockClear();
    profileState = {
      data: sampleProfile,
      isLoading: false,
      isError: false,
      error: null,
    };
  });

  it('shows the lawyer profile from the public API', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Visualizar perfil')).toBeTruthy();
    expect(screen.getByText('Maria Gomes (Doutora/Dra.)')).toBeTruthy();
    expect(screen.getByText('Disponível')).toBeTruthy();
    expect(screen.getByText('Pautista - OAB 155242/SP')).toBeTruthy();
    expect(screen.getByText('Biografia')).toBeTruthy();
    expect(screen.getByText('Especialista em direito civil.')).toBeTruthy();
    expect(screen.getByText('OAB 99887/RJ')).toBeTruthy();
    expect(screen.getByText('Direito — USP')).toBeTruthy();
    expect(screen.getByTestId('lawyer-profile-image')).toBeTruthy();
  });

  it('shows loading state', () => {
    profileState = {
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    };
    const screen = render(<ClientLawyerProfileScreen />);
    expect(screen.getByText('Visualizar perfil')).toBeTruthy();
  });

  it('shows not found and allows retry', () => {
    profileState = {
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('404'),
    };
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Profissional não encontrado')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('shows the unavailable badge on the public profile', () => {
    profileState = {
      data: { ...sampleProfile, isAvailable: false },
      isLoading: false,
      isError: false,
      error: null,
    };
    const screen = render(<ClientLawyerProfileScreen />);

    expect(screen.getByText('Indisponível')).toBeTruthy();
  });

  it('returns to the previous screen', () => {
    const screen = render(<ClientLawyerProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
