import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import type { MeDetalheWire, MeResult } from '@/data/auth';
import { authKeys } from '@/domain/auth/auth.keys';

import { useUpdateClientAddress } from './use-update-client-address';
import { useUpdateClientGeneralData } from './use-update-client-general-data';
import { useUpdateClientPersonalProfile } from './use-update-client-personal-profile';

const mockUpdateGeneralData = jest.fn();
const mockUpdateAddress = jest.fn();
const mockUpdatePersonalProfile = jest.fn();
const mockUpdateAuthUser = jest.fn();
const mockGetAuthSessionMemory = jest.fn();

jest.mock('./update-client-general-data.use-case', () => ({
  updateClientGeneralDataUseCase: (params: unknown) => mockUpdateGeneralData(params),
}));

jest.mock('./update-client-address.use-case', () => ({
  updateClientAddressUseCase: (params: unknown) => mockUpdateAddress(params),
}));

jest.mock('./update-client-personal-profile.use-case', () => ({
  updateClientPersonalProfileUseCase: (params: unknown) =>
    mockUpdatePersonalProfile(params),
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
  photoKey: 'tmp/clientes/perfil/abc.jpg',
  pushNotificationsEnabled: true,
  clientProfile: {
    fullName: 'Maria Silva',
    email: 'maria@laweact.com',
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
  },
  lawyerProfile: null,
};

const patchedDetalhe: MeDetalheWire = {
  perfil: {
    fotoUrl: 'tmp/clientes/perfil/abc.jpg',
    nomeCompleto: 'Maria Silva Lima',
    tipoDocumento: 'CPF',
    numeroDocumento: '11144477735',
    rg: '1234567',
    pronomes: 'ELE',
    profissao: 'Designer',
    estadoCivil: 'solteiro',
    faixaRenda: '2500',
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

describe('client edit-data cache', () => {
  beforeEach(() => {
    mockUpdateGeneralData.mockReset();
    mockUpdateAddress.mockReset();
    mockUpdatePersonalProfile.mockReset();
    mockUpdateAuthUser.mockReset();
    mockGetAuthSessionMemory.mockReset();
    mockUpdateGeneralData.mockResolvedValue(patchedDetalhe);
    mockUpdateAddress.mockResolvedValue(patchedDetalhe);
    mockUpdatePersonalProfile.mockResolvedValue(patchedDetalhe);
    mockUpdateAuthUser.mockResolvedValue({});
    mockGetAuthSessionMemory.mockReturnValue({
      token: 'access',
      refreshToken: 'refresh',
      user: {
        id: '1',
        email: 'maria@laweact.com',
        name: 'Maria Silva',
        role: 'CLIENT',
        termsAccepted: true,
      },
    });
  });

  it('writes PATCH dados-gerais into /me cache and syncs the session name', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result, unmount } = renderHook(() => useUpdateClientGeneralData(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({ fullName: 'Maria Silva Lima' });

    await waitFor(() => {
      expect(queryClient.getQueryData(authKeys.me())).toEqual({
        photoKey: 'tmp/clientes/perfil/abc.jpg',
        pushNotificationsEnabled: true,
        clientProfile: {
          fullName: 'Maria Silva Lima',
          email: 'maria@laweact.com',
          documentType: 'cpf',
          documentNumber: '111.444.777-35',
          rg: '12.345.67',
          cep: '01311-100',
          state: 'SP',
          city: 'São Paulo',
          neighborhood: 'Consolação',
          street: 'Rua Augusta',
          number: '200',
          complement: 'Cj 10',
          pronouns: 'ELE',
          profession: 'Designer',
          maritalStatus: 'solteiro',
          monthlyIncome: '2500',
        },
        lawyerProfile: null,
      });
    });
    expect(mockUpdateAuthUser).toHaveBeenCalledWith({
      id: '1',
      email: 'maria@laweact.com',
      name: 'Maria Silva Lima',
      role: 'CLIENT',
      termsAccepted: true,
    });
    unmount();
    queryClient.clear();
  });

  it('writes PATCH endereco into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateClientAddress(), {
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
        queryClient.getQueryData<MeResult>(authKeys.me())?.clientProfile?.street,
      ).toBe('Rua Augusta');
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });

  it('writes PATCH perfil-pessoal into /me cache without refetching', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useUpdateClientPersonalProfile(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      documentType: 'cpf',
      pronouns: 'ELE',
      profession: 'Designer',
      maritalStatus: 'solteiro',
      monthlyIncome: '2500',
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryData<MeResult>(authKeys.me())?.clientProfile?.profession,
      ).toBe('Designer');
    });
    expect(invalidateSpy).not.toHaveBeenCalled();
    unmount();
    queryClient.clear();
  });
});
