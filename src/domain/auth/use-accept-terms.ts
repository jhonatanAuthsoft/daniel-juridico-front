import { useMutation } from '@tanstack/react-query';

import { useAuth } from './auth-provider';
import { acceptTermsUseCase } from './accept-terms.use-case';

type AcceptTermsVariables = {
  checkboxConfirmado: boolean;
  scrollConfirmado?: boolean;
};

/**
 * Domain hook: accepts terms and updates the persisted auth session.
 */
export function useAcceptTerms() {
  const { token, user, markTermsAccepted } = useAuth();

  return useMutation({
    mutationFn: async (variables: AcceptTermsVariables) => {
      if (!token || !user) {
        throw new Error('É necessário estar autenticado para aceitar os termos.');
      }

      const result = await acceptTermsUseCase({
        token,
        checkboxConfirmado: variables.checkboxConfirmado,
        scrollConfirmado: variables.scrollConfirmado,
      });

      if (!result.termosAceitos) {
        throw new Error('O aceite dos termos não foi confirmado pelo servidor.');
      }

      await markTermsAccepted();
      return result;
    },
  });
}
