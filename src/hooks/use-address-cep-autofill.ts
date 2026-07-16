import { useEffect, useMemo, useRef } from 'react';
import {
  useFormContext,
  useWatch,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormSetValue,
} from 'react-hook-form';

import type { SelectOption } from '@/constants/select-options';
import { CITIES_BY_UF, NEIGHBORHOOD_OPTIONS } from '@/constants/select-options';
import { useCep } from '@/domain/address';

type AddressFormFields = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  complement: string;
};

type UseAddressCepAutofillResult = {
  isFetchingCep: boolean;
  cepErrorMessage?: string;
  cityOptions: SelectOption[];
  neighborhoodOptions: SelectOption[];
};

function withDynamicOption(options: SelectOption[], value: string): SelectOption[] {
  if (!value) {
    return options;
  }

  const exists = options.some(
    (option) =>
      option.value === value || option.label.toLowerCase() === value.toLowerCase(),
  );

  if (exists) {
    return options;
  }

  return [...options, { value, label: value }];
}

function resolveCityValue(state: string, cityLabel: string): string {
  const cities = CITIES_BY_UF[state] ?? [];
  const match = cities.find(
    (option) => option.label.toLowerCase() === cityLabel.toLowerCase(),
  );
  return match?.value ?? cityLabel;
}

function resolveNeighborhoodValue(neighborhoodLabel: string): string {
  const match = NEIGHBORHOOD_OPTIONS.find(
    (option) => option.label.toLowerCase() === neighborhoodLabel.toLowerCase(),
  );
  return match?.value ?? neighborhoodLabel;
}

/**
 * Watches CEP, calls useCep, and fills address fields when data arrives.
 */
export function useAddressCepAutofill<
  TFieldValues extends FieldValues & AddressFormFields,
>(): UseAddressCepAutofillResult {
  const { setValue, control } = useFormContext<TFieldValues>();
  const cep = (useWatch({ control, name: 'cep' as Path<TFieldValues> }) as string) ?? '';
  const state =
    (useWatch({ control, name: 'state' as Path<TFieldValues> }) as string) ?? '';
  const city = (useWatch({ control, name: 'city' as Path<TFieldValues> }) as string) ?? '';
  const neighborhood =
    (useWatch({ control, name: 'neighborhood' as Path<TFieldValues> }) as string) ?? '';

  const previousState = useRef(state);
  const lastFilledCep = useRef<string | null>(null);
  const isFillingFromCep = useRef(false);

  const { data, isFetching, isError, error, isSuccess } = useCep(cep);

  useEffect(() => {
    if (previousState.current === state) {
      return;
    }

    previousState.current = state;

    if (isFillingFromCep.current) {
      return;
    }

    setValue('city' as Path<TFieldValues>, '' as PathValue<TFieldValues, Path<TFieldValues>>);
    setValue(
      'neighborhood' as Path<TFieldValues>,
      '' as PathValue<TFieldValues, Path<TFieldValues>>,
    );
  }, [setValue, state]);

  useEffect(() => {
    if (!isSuccess || !data) {
      return;
    }

    if (lastFilledCep.current === data.cep) {
      return;
    }

    lastFilledCep.current = data.cep;
    isFillingFromCep.current = true;

    const fill = setValue as UseFormSetValue<AddressFormFields>;
    fill('state', data.state, { shouldDirty: true });
    fill('city', resolveCityValue(data.state, data.city), { shouldDirty: true });
    fill('neighborhood', resolveNeighborhoodValue(data.neighborhood), {
      shouldDirty: true,
    });
    fill('street', data.street, { shouldDirty: true });
    if (data.complement) {
      fill('complement', data.complement, { shouldDirty: true });
    }

    queueMicrotask(() => {
      isFillingFromCep.current = false;
    });
  }, [data, isSuccess, setValue]);

  const cityOptions = useMemo(() => {
    const base = state ? (CITIES_BY_UF[state] ?? []) : [];
    return withDynamicOption(base, city);
  }, [city, state]);

  const neighborhoodOptions = useMemo(
    () => withDynamicOption([...NEIGHBORHOOD_OPTIONS], neighborhood),
    [neighborhood],
  );

  return {
    isFetchingCep: isFetching,
    cepErrorMessage: isError
      ? error instanceof Error
        ? error.message
        : 'Não foi possível buscar o CEP.'
      : undefined,
    cityOptions,
    neighborhoodOptions,
  };
}
