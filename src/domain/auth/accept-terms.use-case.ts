import { acceptTerms, type AcceptTermsResult } from '@/data/user';

export type AcceptTermsInput = {
  token: string;
  checkboxConfirmed: boolean;
  scrollConfirmed?: boolean;
  version?: string;
};

/**
 * Use case: accept terms of use for the authenticated session.
 */
export async function acceptTermsUseCase(
  input: AcceptTermsInput,
  signal?: AbortSignal,
): Promise<AcceptTermsResult> {
  return acceptTerms(
    {
      checkboxConfirmed: input.checkboxConfirmed,
      scrollConfirmed: input.scrollConfirmed,
      version: input.version,
    },
    input.token,
    signal,
  );
}
