import { useMutation } from '@tanstack/react-query';

import { useAuth } from './auth-provider';
import { acceptTermsUseCase } from './accept-terms.use-case';

type AcceptTermsVariables = {
  checkboxConfirmed: boolean;
  scrollConfirmed?: boolean;
};

/**
 * Domain hook: accepts terms and updates the persisted auth session.
 */
export function useAcceptTerms() {
  const { user, markTermsAccepted } = useAuth();

  return useMutation({
    mutationFn: async (variables: AcceptTermsVariables) => {
      if (!user) {
        throw new Error('É necessário estar autenticado para aceitar os termos.');
      }

      const result = await acceptTermsUseCase({
        checkboxConfirmed: variables.checkboxConfirmed,
        scrollConfirmed: variables.scrollConfirmed,
      });

      if (!result.termsAccepted) {
        throw new Error('O aceite dos termos não foi confirmado pelo servidor.');
      }

      await markTermsAccepted();
      return result;
    },
  });
}
