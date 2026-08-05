import { InputValidators } from '@/constants/input-validators';
import {
  maskCep,
  maskCnpj,
  maskCpf,
  maskCurrencyBr,
  maskDateBr,
  maskDigitsOnly,
  maskAlphanumericOnly,
  maskPhone,
  maskRg,
} from '@/utils/br-input';
import { FieldValidators, type FieldValidateFn } from '@/constants/field-validators';

export const InputMasks = {
  cpf: maskCpf,
  cnpj: maskCnpj,
  phone: maskPhone,
  cep: maskCep,
  dateBr: maskDateBr,
  currencyBr: maskCurrencyBr,
  rg: maskRg,
  digits: maskDigitsOnly,
  digitsMax: (max: number) => (value: string) => maskDigitsOnly(value, max),
  alphanumericMax: (max: number) => (value: string) => maskAlphanumericOnly(value, max),
} as const;

export { FieldValidators, InputValidators };
export type { FieldValidateFn };
