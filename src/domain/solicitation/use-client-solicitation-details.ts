import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { ClientSolicitationDetails } from '@/components/client-solicitation-details/mock-client-solicitation-details';
import {
  canCancelSolicitationStatus,
  mapFormaCobrancaLabel,
  mapMatchResultToCompatibleLawyer,
  mapModalidadeLabel,
  mapUrgenciaToStatus,
} from '@/data/solicitation';
import { useSpecialtiesCatalog } from '@/domain/catalog/use-specialties-catalog';

import { getClientSolicitationUseCase } from './get-client-solicitation.use-case';
import { listSolicitationMatchesUseCase } from './list-solicitation-matches.use-case';
import { solicitationKeys } from './solicitation.keys';

/**
 * Domain hook: solicitation detail + matches for the client details screen.
 */
export function useClientSolicitationDetails(id: string | undefined) {
  const catalogQuery = useSpecialtiesCatalog();

  const [detailQuery, matchesQuery] = useQueries({
    queries: [
      {
        queryKey: solicitationKeys.detail(id ?? ''),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
          getClientSolicitationUseCase(id!, signal),
        enabled: Boolean(id),
      },
      {
        queryKey: solicitationKeys.matches(id ?? ''),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
          listSolicitationMatchesUseCase(id!, signal),
        enabled: Boolean(id),
      },
    ],
  });

  const solicitation = useMemo((): ClientSolicitationDetails | undefined => {
    const detail = detailQuery.data;
    if (!detail) {
      return undefined;
    }

    const specialty = catalogQuery.data?.items.find(
      (item) => item.code === detail.specialtyCode,
    );
    const subspecialty = specialty?.subspecialties.find(
      (item) => item.code === detail.subspecialtyCode,
    );

    const specialtyLabel = specialty?.name ?? detail.specialtyCode;
    const subspecialtyLabel = subspecialty?.name;
    const location =
      detail.city && detail.state
        ? `${detail.city} - ${detail.state}`
        : detail.city || detail.state || 'Não informado';

    return {
      id: detail.id,
      title: detail.title,
      status: mapUrgenciaToStatus(detail.urgency),
      workflowStatus: detail.status,
      practice: mapModalidadeLabel(detail.modality),
      specialties: specialtyLabel ? [specialtyLabel] : [],
      subspecialties: subspecialtyLabel ? [subspecialtyLabel] : [],
      minimumExperienceMonths: detail.minimumExperienceMonths ?? 0,
      location,
      billingMethod: mapFormaCobrancaLabel(detail.billingMethod),
      description: detail.description,
      compatibleLawyers: (matchesQuery.data ?? []).map((match, index) =>
        mapMatchResultToCompatibleLawyer(match, index),
      ),
      canCancel: canCancelSolicitationStatus(detail.status),
    };
  }, [catalogQuery.data, detailQuery.data, matchesQuery.data]);

  const isLoading =
    detailQuery.isLoading ||
    matchesQuery.isLoading ||
    (Boolean(detailQuery.data) && catalogQuery.isLoading);

  const isError = detailQuery.isError || matchesQuery.isError;
  const error = detailQuery.error ?? matchesQuery.error;

  return {
    solicitation,
    isLoading,
    isError,
    error,
    isNotFound: detailQuery.isError,
    refetch: async () => {
      await Promise.all([detailQuery.refetch(), matchesQuery.refetch()]);
    },
  };
}
