import type { ReactNode } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { renderHook, waitFor } from '@testing-library/react-native';

import { useCep, useCitiesByUf } from '@/domain/address';

import { useAddressCepAutofill } from './use-address-cep-autofill';

jest.mock('@/domain/address', () => ({
  useCep: jest.fn(),
  useCitiesByUf: jest.fn(),
}));

const useCepMock = useCep as jest.MockedFunction<typeof useCep>;
const useCitiesByUfMock = useCitiesByUf as jest.MockedFunction<typeof useCitiesByUf>;

type AddressForm = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
};

const VIA_CEP = {
  cep: '01310100',
  street: 'Avenida Paulista',
  complement: 'de 612 a 1510 - lado par',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
};

function renderAutofill(defaultValues: AddressForm) {
  const formRef = { current: null as UseFormReturn<AddressForm> | null };

  function Wrapper({ children }: { children: ReactNode }) {
    const form = useForm<AddressForm>({ defaultValues });
    formRef.current = form;
    return <FormProvider {...form}>{children}</FormProvider>;
  }

  const hook = renderHook(() => useAddressCepAutofill<AddressForm>(), {
    wrapper: Wrapper,
  });

  return {
    hook,
    getValues: () => {
      const form = formRef.current;
      if (!form) {
        throw new Error('Form was not initialized');
      }
      return form.getValues();
    },
  };
}

describe('useAddressCepAutofill', () => {
  beforeEach(() => {
    useCepMock.mockReturnValue({
      data: VIA_CEP,
      isFetching: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as never);
    useCitiesByUfMock.mockReturnValue({
      data: [{ value: 'São Paulo', label: 'São Paulo' }],
      isFetching: false,
      isError: false,
    } as never);
  });

  it('fills state, city, neighborhood and street from CEP', async () => {
    const { getValues } = renderAutofill({
      cep: '01310-100',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      number: '',
      complement: '',
    });

    await waitFor(() => {
      expect(getValues().state).toBe('SP');
    });

    expect(getValues()).toEqual({
      cep: '01310-100',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Bela Vista',
      street: 'Avenida Paulista',
      number: '',
      complement: '',
    });
  });

  it('does not overwrite number or complement typed by the user', async () => {
    const { getValues } = renderAutofill({
      cep: '01310-100',
      state: '',
      city: '',
      neighborhood: '',
      street: 'Rua das Flores',
      number: '12',
      complement: 'Apto 12',
    });

    await waitFor(() => {
      expect(getValues().neighborhood).toBe('Bela Vista');
    });

    expect(getValues().street).toBe('Avenida Paulista');
    expect(getValues().number).toBe('12');
    expect(getValues().complement).toBe('Apto 12');
  });
});
