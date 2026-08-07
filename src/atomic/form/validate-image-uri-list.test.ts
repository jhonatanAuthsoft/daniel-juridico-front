import { validateImageUriList } from './validate-image-uri-list';

describe('validateImageUriList', () => {
  it('requires both sides when required with minCount 2', () => {
    expect(
      validateImageUriList([], { required: true, minCount: 2, multiple: true }),
    ).toBe('Anexe as fotos de frente e verso');
    expect(
      validateImageUriList(['a'], { required: true, minCount: 2, multiple: true }),
    ).toBe('Anexe as fotos de frente e verso');
    expect(
      validateImageUriList(['a', 'b'], {
        required: true,
        minCount: 2,
        multiple: true,
      }),
    ).toBe(true);
  });

  it('allows none or both when optional with minCount 2', () => {
    expect(
      validateImageUriList([], { minCount: 2, multiple: true }),
    ).toBe(true);
    expect(
      validateImageUriList(['a'], { minCount: 2, multiple: true }),
    ).toBe('Anexe frente e verso, ou remova a foto');
    expect(
      validateImageUriList(['a', 'b'], { minCount: 2, multiple: true }),
    ).toBe(true);
  });

  it('skips validation when neither required nor minCount', () => {
    expect(validateImageUriList(['a'], { multiple: true })).toBe(true);
    expect(validateImageUriList([], { multiple: true })).toBe(true);
  });
});
