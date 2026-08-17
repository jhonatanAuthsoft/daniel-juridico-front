/**
 * Brazilian document / phone / CEP helpers for form masks and validation.
 */

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Case- and accent-insensitive text for select search filters. */
export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

export function maskCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskCnpj(value: string): string {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/** BR mobile/landline: (11) 99999-9999 or (11) 9999-9999 */
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** DD/MM/YYYY while typing */
export function maskDateBr(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function maskDigitsOnly(value: string, maxLength?: number): string {
  const digits = onlyDigits(value);
  return maxLength !== undefined ? digits.slice(0, maxLength) : digits;
}

/** Letters and digits only (e.g. OAB numbers that may include letters). */
export function maskAlphanumericOnly(value: string, maxLength?: number): string {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
  return maxLength !== undefined ? cleaned.slice(0, maxLength) : cleaned;
}

/** Progressive RG mask (padrão comum): 00.000.000-0 — até 9 dígitos, 1 verificador. */
export function maskRg(value: string): string {
  const digits = onlyDigits(value).slice(0, 9);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
}

/** RG completo: exatamente 9 dígitos (8 + 1 verificador). */
export function isValidRg(value: string): boolean {
  return onlyDigits(value).length === 9;
}

/** Simple BRL-ish amount: digits + optional decimal comma (2 places). */
export function maskCurrencyBr(value: string): string {
  const cleaned = value.replace(/[^\d,]/g, '');
  const parts = cleaned.split(',');
  const integer = onlyDigits(parts[0] ?? '').slice(0, 12);
  if (parts.length === 1) {
    return integer;
  }
  const decimal = onlyDigits(parts.slice(1).join('')).slice(0, 2);
  return `${integer},${decimal}`;
}

function allSameDigits(digits: string): boolean {
  return /^(\d)\1+$/.test(digits);
}

function cpfCheckDigit(digits: string, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i += 1) {
    sum += Number(digits[i]) * (length + 1 - i);
  }
  const mod = (sum * 10) % 11;
  return mod === 10 ? 0 : mod;
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11 || allSameDigits(digits)) {
    return false;
  }
  const d1 = cpfCheckDigit(digits, 9);
  const d2 = cpfCheckDigit(digits, 10);
  return d1 === Number(digits[9]) && d2 === Number(digits[10]);
}

function cnpjCheckDigit(digits: string, weights: number[]): number {
  const sum = weights.reduce(
    (acc, weight, index) => acc + Number(digits[index]) * weight,
    0,
  );
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 14 || allSameDigits(digits)) {
    return false;
  }
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = cnpjCheckDigit(digits, w1);
  const d2 = cnpjCheckDigit(digits, w2);
  return d1 === Number(digits[12]) && d2 === Number(digits[13]);
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

export type DateBrOptions = {
  /** Inclusive minimum calendar year. Defaults to 1900. */
  minYear?: number;
  /** When false, dates after today (local) are invalid. Defaults to true. */
  allowFuture?: boolean;
};

export function isValidDateBr(value: string, options: DateBrOptions = {}): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 8) {
    return false;
  }
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const minYear = options.minYear ?? 1900;
  if (month < 1 || month > 12 || day < 1 || year < minYear) {
    return false;
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }
  if (options.allowFuture === false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      return false;
    }
  }
  return true;
}

export function isValidYear(value: string, min = 1950, max = new Date().getFullYear() + 1): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 4) {
    return false;
  }
  const year = Number(digits);
  return year >= min && year <= max;
}
