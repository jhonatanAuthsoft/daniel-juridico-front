import {
  isValidCnpj,
  isValidCpf,
  isValidDateBr,
  isValidRg,
  maskCnpj,
  maskCpf,
  maskPhone,
  maskRg,
  normalizeSearchText,
} from '@/utils/br-input';

describe('br-input', () => {
  it('masks CPF and CNPJ', () => {
    expect(maskCpf('52998224725')).toBe('529.982.247-25');
    expect(maskCnpj('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('masks phone', () => {
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
    expect(maskPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('masks RG with a single check digit', () => {
    expect(maskRg('123456789')).toBe('12.345.678-9');
    expect(maskRg('12345678')).toBe('12.345.678');
    expect(maskRg('12345')).toBe('12.345');
  });

  it('validates RG requires exactly 9 digits', () => {
    expect(isValidRg('12.345.678-9')).toBe(true);
    expect(isValidRg('12.345.678')).toBe(false);
    expect(isValidRg('1234')).toBe(false);
  });

  it('validates CPF check digits', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('529.982.247-24')).toBe(false);
  });

  it('validates CNPJ check digits', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
  });

  it('rejects invalid calendar dates', () => {
    expect(isValidDateBr('31/02/2000')).toBe(false);
    expect(isValidDateBr('15/13/2000')).toBe(false);
  });

  it('enforces minYear and no future for birth', () => {
    expect(isValidDateBr('01/01/1919', { minYear: 1920, allowFuture: false })).toBe(
      false,
    );
    expect(isValidDateBr('01/01/1920', { minYear: 1920, allowFuture: false })).toBe(
      true,
    );
    expect(isValidDateBr('01/01/2999', { minYear: 1920, allowFuture: false })).toBe(
      false,
    );
  });

  it('enforces OAB issue minYear 1950', () => {
    expect(isValidDateBr('01/01/1949', { minYear: 1950, allowFuture: false })).toBe(
      false,
    );
    expect(isValidDateBr('01/01/1950', { minYear: 1950, allowFuture: false })).toBe(
      true,
    );
  });

  it('normalizes search text without accents', () => {
    expect(normalizeSearchText('  São Paulo  ')).toBe('sao paulo');
    expect(normalizeSearchText('AGUAÍ')).toBe('aguai');
  });
});
