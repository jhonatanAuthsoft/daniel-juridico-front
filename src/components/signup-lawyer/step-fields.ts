import type { FieldPath } from 'react-hook-form';

import { shouldShowSpecialtiesStep } from './signup-step-navigation';
import type { LawyerSignupFormValues } from './types';

export function getLawyerSignupStepFields(
  step: number,
  values: Pick<
    LawyerSignupFormValues,
    'noFatherName' | 'practiceAreas' | 'supplementalOabs' | 'postgraduates'
  >,
): FieldPath<LawyerSignupFormValues>[] {
  switch (step) {
    case 1:
      return ['fullName', 'email', 'phone', 'password'];
    case 2: {
      const fields: FieldPath<LawyerSignupFormValues>[] = [
        'motherName',
        'rg',
        'issuingAuthority',
        'uf',
        'cpf',
      ];
      if (!values.noFatherName) {
        fields.splice(1, 0, 'fatherName');
      }
      return fields;
    }
    case 3:
      return ['cep', 'state', 'city', 'neighborhood', 'street', 'number'];
    case 4:
      return ['oabNumber', 'oabUf', 'oabIssueDate'];
    case 5:
      return ['university', 'course', 'graduationYear'];
    case 6:
      return ['practiceAreas'];
    case 7:
      return shouldShowSpecialtiesStep(values.practiceAreas)
        ? ['specialties']
        : [];
    case 8:
      return ['serviceState', 'serviceCity'];
    case 9:
      return ['billingMethods'];
    case 10:
      return ['pronouns', 'biography'];
    default:
      return [];
  }
}
