import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import type { MeDetalheWire, MeResult } from '@/data/auth';
import { authKeys } from '@/domain/auth/auth.keys';

import { useUpdateLawyerAddress } from './use-update-lawyer-address';
import { useUpdateLawyerBiography } from './use-update-lawyer-biography';
import { useUpdateLawyerBilling } from './use-update-lawyer-billing';
import { useUpdateLawyerDocumentation } from './use-update-lawyer-documentation';
import { useUpdateLawyerGeneralData } from './use-update-lawyer-general-data';
import { useUpdateLawyerAvailability } from './use-update-lawyer-availability';
import { useUpdateLawyerGraduation } from './use-update-lawyer-graduation';
import { useUpdateLawyerServiceAreas } from './use-update-lawyer-service-areas';
import { useUpdateLawyerPracticeAreas } from './use-update-lawyer-practice-areas';
import { useUpdateLawyerSpecialties } from './use-update-lawyer-specialties';

const mockUpdateGeneralData = jest.fn();
const mockUpdateAddress = jest.fn();
const mockUpdateBilling = jest.fn();
const mockUpdateBiography = jest.fn();
const mockUpdateDocumentation = jest.fn();
const mockUpdateGraduation = jest.fn();
const mockUpdateAvailability = jest.fn();
const mockUpdateServiceAreas = jest.fn();
const mockUpdatePracticeAreas = jest.fn();
const mockUpdateSpecialties = jest.fn();
const mockUpdateAuthUser = jest.fn();
const mockGetAuthSessionMemory = jest.fn();

jest.mock('./update-lawyer-general-data.use-case', () => ({
  updateLawyerGeneralDataUseCase: (params: unknown) => mockUpdateGeneralData(params),
}));

jest.mock('./update-lawyer-address.use-case', () => ({
  updateLawyerAddressUseCase: (params: unknown) => mockUpdateAddress(params),
}));

jest.mock('./update-lawyer-billing.use-case', () => ({
  updateLawyerBillingUseCase: (params: unknown) => mockUpdateBilling(params),
}));

jest.mock('./update-lawyer-biography.use-case', () => ({
  updateLawyerBiographyUseCase: (params: unknown) => mockUpdateBiography(params),
}));

jest.mock('./update-lawyer-documentation.use-case', () => ({
  updateLawyerDocumentationUseCase: (params: unknown) =>
    mockUpdateDocumentation(params),
}));

jest.mock('./update-lawyer-graduation.use-case', () => ({
  updateLawyerGraduationUseCase: (params: unknown) => mockUpdateGraduation(params),
}));

jest.mock('./update-lawyer-availability.use-case', () => ({
  updateLawyerAvailabilityUseCase: (params: unknown) =>
    mockUpdateAvailability(params),
}));

jest.mock('./update-lawyer-service-areas.use-case', () => ({
  updateLawyerServiceAreasUseCase: (params: unknown) =>
    mockUpdateServiceAreas(params),
}));

jest.mock('./update-lawyer-practice-areas.use-case', () => ({
  updateLawyerPracticeAreasUseCase: (params: unknown) =>
    mockUpdatePracticeAreas(params),
}));

jest.mock('./update-lawyer-specialties.use-case', () => ({
  updateLawyerSpecialtiesUseCase: (params: unknown) =>
    mockUpdateSpecialties(params),
}));

jest.mock('@/data/auth', () => {
  const actual = jest.requireActual<typeof import('@/data/auth')>('@/data/auth');
  return {
    ...actual,
    getAuthSessionMemory: () => mockGetAuthSessionMemory(),
    updateAuthUser: (user: unknown) => mockUpdateAuthUser(user),
  };
});

const cachedMe: MeResult = {
  photoKey: 'tmp/advogados/perfil/joao.jpg',
  pushNotificationsEnabled: true,
  profileUnavailable: false,
  clientProfile: null,
  lawyerProfile: {
    fullName: 'João Advogado',
    email: 'joao@laweact.com',
    phone: '(11) 98888-7777',
    birthDate: '20/05/1990',
    cep: '01310-100',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    street: 'Av. Paulista',
    number: '1500',
    complement: 'Conjunto 41',
    billingMethods: ['contractual'],
    biography: 'Atuo há 10 anos.',
    pronouns: 'DOUTOR',
    oabNumber: '123456',
    oabUf: 'SP',
    oabIssueDate: '15/03/2016',
    oabPhotoUris: [],
    oabPhotoKeys: [],
    supplementalOabs: [],
    university: 'USP',
    course: 'Direito',
    graduationYear: '2015',
    postgraduates: [],
    serviceAreas: [{ state: 'SP', cities: ['São Paulo'] }],
    practiceAreas: [],
    specialties: [],
    specialtyLabels: [],
  },
};

const patchedDetalhe: MeDetalheWire = {
  perfil: {
    fotoUrl: 'tmp/advogados/perfil/joao.jpg',
    nomeCompleto: 'João Advogado Lima',
    pronomeTratamento: 'DOUTORA',
    biografia: 'Advogada civilista.',
    universidade: 'PUC-SP',
    curso: 'Direito',
    anoFormacao: 2018,
  },
  endereco: {
    cep: '01311-100',
    logradouro: 'Rua Augusta',
    numero: '200',
    complemento: 'Cj 10',
    bairro: 'Consolação',
    cidade: 'São Paulo',
    estado: 'SP',
  },
  formasCobranca: [
    { codigo: 'HONORARIOS_PERCENTUAIS', nome: 'Honorários percentuais' },
  ],
  areasAtuacao: [
    { id: 'a1', estado: 'SP', cidade: 'Adamantina' },
    { id: 'a2', estado: 'SP', cidade: 'Avaré' },
  ],
  posGraduacoes: [
    {
      id: 'pg1',
      nomeCurso: 'LLM Direito Digital',
      instituicao: 'FGV',
      anoFormacao: 2020,
    },
  ],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(authKeys.me(), cachedMe);

  function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, Wrapper };
}

describe('lawyer edit-data cache', () => {
  beforeEach(() => {
    mockUpdateGeneralData.mockReset();
    mockUpdateAddress.mockReset();
    mockUpdateBilling.mockReset();
    mockUpdateBiography.mockReset();
    mockUpdateDocumentation.mockReset();
    mockUpdateGraduation.mockReset();
    mockUpdateAvailability.mockReset();
    mockUpdateServiceAreas.mockReset();
    mockUpdatePracticeAreas.mockReset();
    mockUpdateSpecialties.mockReset();
    mockUpdateAuthUser.mockReset();
    mockGetAuthSessionMemory.mockReset();
    mockUpdateGeneralData.mockResolvedValue(patchedDetalhe);
    mockUpdateAddress.mockResolvedValue(patchedDetalhe);
    mockUpdateBilling.mockResolvedValue(patchedDetalhe);
    mockUpdateBiography.mockResolvedValue(patchedDetalhe);
    mockUpdateDocumentation.mockResolvedValue(patchedDetalhe);
    mockUpdateGraduation.mockResolvedValue(patchedDetalhe);
    mockUpdateServiceAreas.mockResolvedValue(patchedDetalhe);
    mockUpdatePracticeAreas.mockResolvedValue({
      ...patchedDetalhe,
      modalidades: [{ codigo: 'CONSULTOR', nome: 'Consultor' }],
    });
    mockUpdateSpecialties.mockResolvedValue({
      ...patchedDetalhe,
      especialidades: [
        {
          especialidadeCodigo: 'CIVIL',
          especialidadeNome: 'Direito Civil',
          subespecialidadeCodigo: 'CONTRATOS',
          subespecialidadeNome: 'Contratos',
        },
      ],
    });
    mockUpdateAvailability.mockResolvedValue({
      ...patchedDetalhe,
      perfil: {
        ...patchedDetalhe.perfil,
        disponibilidade: 'INDISPONIVEL',
      },
    });
    mockUpdateAuthUser.mockResolvedValue({});
    mockGetAuthSessionMemory.mockReturnValue({
      token: 'access',
      refreshToken: 'refresh',
      user: {
        id: '2',
        email: 'joao@laweact.com',
        name: 'João Advogado',
        role: 'LAWYER',
        termsAccepted: true,
      },
    });
  });

  it('writes PATCH dados-gerais into /me cache and syncs the session name', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useUpdateLawyerGeneralData(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      fullName: 'João Advogado Lima',
      phone: '(11) 97777-6666',
      birthDate: '12/03/1988',
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.fullName,
      ).toBe('João Advogado Lima');
    });
    expect(mockUpdateAuthUser).toHaveBeenCalledWith({
      id: '2',
      email: 'joao@laweact.com',
      name: 'João Advogado Lima',
      role: 'LAWYER',
      termsAccepted: true,
      phone: '11977776666',
    });
    unmount();
    queryClient.clear();
  });

  it('writes PATCH endereco into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateLawyerAddress(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      cep: '01311-100',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Consolação',
      street: 'Rua Augusta',
      number: '200',
      complement: 'Cj 10',
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.street,
      ).toBe('Rua Augusta');
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });

  it('writes PATCH formas-cobranca into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateLawyerBilling(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({ billingMethods: ['percentage'] });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.billingMethods,
      ).toEqual(['percentage']);
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });

  it('writes PATCH biografia into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useUpdateLawyerBiography(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      pronouns: 'DOUTORA',
      biography: 'Advogada civilista.',
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.biography,
      ).toBe('Advogada civilista.');
    });
    unmount();
    queryClient.clear();
  });

  it('writes PATCH documentacao into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useUpdateLawyerDocumentation(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      oabNumber: '123456',
      oabUf: 'SP',
      oabIssueDate: '15/03/2016',
      oabPhotoKeys: [],
      supplementalOabs: [],
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.fullName,
      ).toBe('João Advogado Lima');
    });
    unmount();
    queryClient.clear();
  });

  it('writes PATCH disponibilidade into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateLawyerAvailability(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({ profileUnavailable: true });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.profileUnavailable,
      ).toBe(true);
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });

  it('writes PATCH graduacao into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useUpdateLawyerGraduation(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      university: 'PUC-SP',
      course: 'Direito',
      graduationYear: '2018',
      postgraduates: [{ university: 'FGV', course: 'LLM Direito Digital', year: '2020' }],
    });

    await waitFor(() => {
      const profile = queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile;
      expect(profile?.university).toBe('PUC-SP');
      expect(profile?.postgraduates).toEqual([
        { university: 'FGV', course: 'LLM Direito Digital', year: '2020' },
      ]);
    });
    unmount();
    queryClient.clear();
  });

  it('writes PATCH areas-atuacao into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateLawyerServiceAreas(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      serviceAreas: [{ state: 'SP', cities: ['Adamantina', 'Avaré'] }],
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.serviceAreas,
      ).toEqual([{ state: 'SP', cities: ['Adamantina', 'Avaré'] }]);
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });

  it('writes PATCH modalidades into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateLawyerPracticeAreas(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({ practiceAreas: ['consultor'] });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.practiceAreas,
      ).toEqual(['consultor']);
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });

  it('writes PATCH especialidades into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateLawyerSpecialties(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({ specialties: ['CIVIL:CONTRATOS'] });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.specialties,
      ).toEqual(['CIVIL:CONTRATOS']);
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });
});
