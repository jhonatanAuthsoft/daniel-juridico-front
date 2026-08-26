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
import { useUpdateLawyerGraduation } from './use-update-lawyer-graduation';

const mockUpdateGeneralData = jest.fn();
const mockUpdateAddress = jest.fn();
const mockUpdateBilling = jest.fn();
const mockUpdateBiography = jest.fn();
const mockUpdateDocumentation = jest.fn();
const mockUpdateGraduation = jest.fn();
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
  clientProfile: null,
  lawyerProfile: {
    fullName: 'João Advogado',
    email: 'joao@laweact.com',
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
    mockUpdateAuthUser.mockReset();
    mockGetAuthSessionMemory.mockReset();
    mockUpdateGeneralData.mockResolvedValue(patchedDetalhe);
    mockUpdateAddress.mockResolvedValue(patchedDetalhe);
    mockUpdateBilling.mockResolvedValue(patchedDetalhe);
    mockUpdateBiography.mockResolvedValue(patchedDetalhe);
    mockUpdateDocumentation.mockResolvedValue(patchedDetalhe);
    mockUpdateGraduation.mockResolvedValue(patchedDetalhe);
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

    await result.current.mutateAsync({ fullName: 'João Advogado Lima' });

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

  it('writes PATCH graduacao into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useUpdateLawyerGraduation(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      university: 'PUC-SP',
      course: 'Direito',
      graduationYear: '2018',
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.lawyerProfile?.university,
      ).toBe('PUC-SP');
    });
    unmount();
    queryClient.clear();
  });
});
