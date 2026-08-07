import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateConnectionParams } from '@/data/connection';
import { solicitationKeys } from '@/domain/solicitation';

import { connectionKeys } from './connection.keys';
import {
  acceptConnectionUseCase,
  cancelConnectionUseCase,
  createConnectionUseCase,
  rejectConnectionUseCase,
} from './connection.use-cases';

async function invalidateConnectionQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  connection: {
    solicitacaoId?: string;
    advogadoId?: string;
  },
) {
  const tasks: Promise<unknown>[] = [
    queryClient.invalidateQueries({ queryKey: connectionKeys.lists() }),
  ];

  if (connection.solicitacaoId) {
    const solicitacaoId = connection.solicitacaoId;
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: connectionKeys.bySolicitation(solicitacaoId),
      }),
      queryClient.invalidateQueries({
        queryKey: solicitationKeys.detail(solicitacaoId),
      }),
      queryClient.invalidateQueries({
        queryKey: solicitationKeys.lists(),
      }),
    );
  }

  if (connection.solicitacaoId && connection.advogadoId) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: connectionKeys.byLawyer(
          connection.advogadoId,
          connection.solicitacaoId,
        ),
      }),
    );
  }

  await Promise.all(tasks);
}

/** `POST /conexoes` — CLIENTE. */
export function useCreateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateConnectionParams) =>
      createConnectionUseCase(params),
    onSuccess: async (data) => {
      await invalidateConnectionQueries(queryClient, data);
    },
  });
}

/** `POST /conexoes/{id}/cancelar` — CLIENTE. */
export function useCancelConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conexaoId: string) => cancelConnectionUseCase(conexaoId),
    onSuccess: async (data) => {
      await invalidateConnectionQueries(queryClient, data);
    },
  });
}

/** `POST /conexoes/{id}/aceitar` — ADVOGADO. */
export function useAcceptConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conexaoId: string) => acceptConnectionUseCase(conexaoId),
    onSuccess: async (data) => {
      await invalidateConnectionQueries(queryClient, data);
    },
  });
}

/** `POST /conexoes/{id}/recusar` — ADVOGADO. */
export function useRejectConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conexaoId: string) => rejectConnectionUseCase(conexaoId),
    onSuccess: async (data) => {
      await invalidateConnectionQueries(queryClient, data);
    },
  });
}
