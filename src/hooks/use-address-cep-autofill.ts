import { useEffect, useMemo, useRef } from 'react';
import {
  type FieldValues,
  type Path,
  type PathValue,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import type { SelectOption } from '@/constants/select-options';
import { useCep, useCitiesByUf } from '@/domain/address';
import { isValidCep } from '@/utils/br-input';

type AddressFieldNames<T extends FieldValues> = {
  zipCode: Path<T>;
  state: Path<T>;
  city: Path<T>;
  neighborhood: Path<T>;
  street: Path<T>;
  complement?: Path<T>;
};

const DEFAULT_FIELDS = {
  zipCode: 'cep',
  state: 'state',
  city: 'city',
  neighborhood: 'neighborhood',
  street: 'street',
  complement: 'complement',
} as const;

function withDynamicOption(
  options: SelectOption[],
  value: string | undefined,
): SelectOption[] {
  const trimmed = value?.trim();
  if (!trimmed) {
    return options;
  }
  if (options.some((option) => option.value === trimmed)) {
    return options;
  }
  return [{ value: trimmed, label: trimmed }, ...options];
}

function resolveCityValue(cities: SelectOption[], cityName: string): string {
  const trimmed = cityName.trim();
  if (!trimmed) {
    return '';
  }
  const byValue = cities.find((city) => city.value === trimmed);
  if (byValue) {
    return byValue.value;
  }
  const byLabel = cities.find(
    (city) => city.label.toLowerCase() === trimmed.toLowerCase(),
  );
  return byLabel?.value ?? trimmed;
}

/**
 * Autofills address fields from CEP (ViaCEP) and loads cities by UF (BrasilAPI).
 * Neighborhood stays free text; city is a searchable select cascaded from state.
 */
export function useAddressCepAutofill<T extends FieldValues>(
  fields: AddressFieldNames<T> = DEFAULT_FIELDS as AddressFieldNames<T>,
) {
  const { control, setValue } = useFormContext<T>();

  const zipCode = useWatch({ control, name: fields.zipCode }) as string;
  const state = ((useWatch({ control, name: fields.state }) as string) ?? '')
    .trim()
    .toUpperCase();
  const city = (useWatch({ control, name: fields.city }) as string) ?? '';

  const { data, isFetching, isError, error, isSuccess } = useCep(zipCode);
  const {
    data: cities = [],
    isFetching: isLoadingCities,
    isError: isCitiesError,
  } = useCitiesByUf(state);

  const lastAppliedCepRef = useRef<string | null>(null);
  const previousStateRef = useRef(state);

  useEffect(() => {
    if (previousStateRef.current === state) {
      return;
    }
    previousStateRef.current = state;
    setValue(fields.city, '' as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: false,
    });
    setValue(fields.neighborhood, '' as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [fields.city, fields.neighborhood, setValue, state]);

  useEffect(() => {
    if (!isSuccess || !data) {
      return;
    }
    if (lastAppliedCepRef.current === data.cep) {
      return;
    }
    lastAppliedCepRef.current = data.cep;

    const nextState = data.state.trim().toUpperCase();
    previousStateRef.current = nextState;

    setValue(fields.state, nextState as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      fields.city,
      resolveCityValue(cities, data.city) as PathValue<T, Path<T>>,
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(
      fields.neighborhood,
      data.neighborhood as PathValue<T, Path<T>>,
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(fields.street, data.street as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (fields.complement && data.complement) {
      setValue(
        fields.complement,
        data.complement as PathValue<T, Path<T>>,
        { shouldDirty: true, shouldValidate: true },
      );
    }
  }, [cities, data, fields, isSuccess, setValue]);

  useEffect(() => {
    if (!city.trim() || cities.length === 0) {
      return;
    }
    const resolved = resolveCityValue(cities, city);
    if (resolved !== city) {
      setValue(fields.city, resolved as PathValue<T, Path<T>>, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [cities, city, fields.city, setValue]);

  const cityOptions = useMemo(
    () => withDynamicOption(cities, city),
    [cities, city],
  );

  return {
    isFetchingCep: isFetching,
    isCepError: isError,
    cepErrorMessage: isError
      ? error instanceof Error
        ? error.message
        : 'Não foi possível buscar o CEP'
      : null,
    cityOptions,
    isLoadingCities,
    isCitiesError,
    hasCep: isValidCep(zipCode ?? ''),
    hasState: state.length === 2,
  };
}
