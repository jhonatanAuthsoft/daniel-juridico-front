import { resolveUfFromStateValue } from './select-options';

describe('select-options', () => {
  it('resolves a state label to its UF code', () => {
    expect(resolveUfFromStateValue('Alagoas')).toBe('AL');
    expect(resolveUfFromStateValue('  são paulo ')).toBe('SP');
  });

  it('keeps an existing UF code', () => {
    expect(resolveUfFromStateValue('sp')).toBe('SP');
    expect(resolveUfFromStateValue('AL')).toBe('AL');
  });

  it('returns empty for unknown values', () => {
    expect(resolveUfFromStateValue('')).toBe('');
    expect(resolveUfFromStateValue('Estado inválido')).toBe('');
  });
});
