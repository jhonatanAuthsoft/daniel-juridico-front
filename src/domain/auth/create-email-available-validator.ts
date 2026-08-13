import { FieldValidators, type FieldValidateFn } from '@/constants/field-validators';
import { checkEmailAvailability } from '@/data/auth/email-availability.api';
import { getErrorMessage } from '@/data/http';

/**
 * Async field validator: format + availability against the API.
 * Used on client/lawyer signup e-mail fields.
 */
export function createEmailAvailableValidator(
  takenMessage = 'E-mail já cadastrado',
): FieldValidateFn {
  return async (value) => {
    const format = FieldValidators.email(value);
    if (format !== true) {
      return format;
    }

    try {
      const available = await checkEmailAvailability(value);
      return available ? true : takenMessage;
    } catch (error) {
      return getErrorMessage(error, 'Não foi possível verificar o e-mail');
    }
  };
}
