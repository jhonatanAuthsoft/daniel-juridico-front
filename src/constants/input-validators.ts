/**
 * Regex patterns for InputTextField validators.
 * Import and pass as `validators={[InputValidators.email]}`.
 */
export const InputValidators = {
  required: /.+/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  onlyLetters: /^[\p{L}\s]+$/u,
  onlyNumbers: /^\d+$/,
  minLength3: /^.{3,}$/,
} as const;

export type InputValidatorPattern = RegExp;
