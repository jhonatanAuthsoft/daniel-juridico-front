import { PasswordRequirements } from '@/constants/password-requirements';
import {
  isValidCep,
  isValidCnpj,
  isValidCpf,
  isValidDateBr,
  isValidPhone,
  isValidRg,
  isValidYear,
  onlyDigits,
} from '@/utils/br-input';

export type FieldValidateResult = true | string;
export type FieldValidateFn = (
  value: string,
) => FieldValidateResult | Promise<FieldValidateResult>;

export function composeValidators(
  ...validators: FieldValidateFn[]
): FieldValidateFn {
  return async (value) => {
    for (const validator of validators) {
      const result = await validator(value);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };
}

export const FieldValidators = {
  required: (message = 'Campo obrigatório'): FieldValidateFn => {
    return (value) => (value.trim().length > 0 ? true : message);
  },

  email: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? true
      : 'E-mail inválido';
  },

  phone: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidPhone(value) ? true : 'Telefone inválido';
  },

  cpf: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidCpf(value) ? true : 'CPF inválido';
  },

  cnpj: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidCnpj(value) ? true : 'CNPJ inválido';
  },

  cep: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidCep(value) ? true : 'CEP inválido';
  },

  dateBr: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidDateBr(value) ? true : 'Data inválida';
  },

  /** Data de nascimento: ano ≥ 1920 e não no futuro. */
  dateBrBirth: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidDateBr(value, { minYear: 1920, allowFuture: false })
      ? true
      : 'Data inválida';
  },

  /** Data de expedição OAB: ano ≥ 1950 e não no futuro. */
  dateBrOabIssue: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidDateBr(value, { minYear: 1950, allowFuture: false })
      ? true
      : 'Data inválida';
  },

  rg: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidRg(value) ? true : 'RG inválido';
  },

  year: (value: string) => {
    if (!value.trim()) {
      return 'Campo obrigatório';
    }
    return isValidYear(value) ? true : 'Ano inválido';
  },

  digitsMin: (min: number, message = 'Valor inválido'): FieldValidateFn => {
    return (value) => {
      if (!value.trim()) {
        return 'Campo obrigatório';
      }
      return onlyDigits(value).length >= min ? true : message;
    };
  },

  alphanumericMin: (min: number, message = 'Valor inválido'): FieldValidateFn => {
    return (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'Campo obrigatório';
      }
      if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
        return message;
      }
      return trimmed.length >= min ? true : message;
    };
  },

  passwordRequirements: (value: string) => {
    if (!value) {
      return 'Campo obrigatório';
    }
    const failed = PasswordRequirements.find((requirement) => !requirement.test(value));
    return failed ? failed.label : true;
  },

  matches:
    (other: string, message = 'Os valores não conferem'): FieldValidateFn =>
    (value) =>
      value === other ? true : message,
} as const;
