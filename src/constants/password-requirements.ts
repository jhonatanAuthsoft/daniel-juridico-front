export const PasswordRequirements = [
  {
    id: 'min-length',
    label: 'Mínimo de 8 caracteres',
    test: (value: string) => value.length >= 8,
  },
  {
    id: 'has-number',
    label: 'Pelo menos um número',
    test: (value: string) => /\d/.test(value),
  },
  {
    id: 'has-uppercase',
    label: 'Pelo menos uma letra maiúscula',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'has-lowercase',
    label: 'Pelo menos uma letra minúscula',
    test: (value: string) => /[a-z]/.test(value),
  },
] as const;
