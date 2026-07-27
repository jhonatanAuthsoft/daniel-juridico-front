import { resolveApiErrorMessage } from './api-response';

describe('resolveApiErrorMessage', () => {
  it('prefers the first error detail', () => {
    const message = resolveApiErrorMessage(
      {
        success: false,
        message: 'Envelope message',
        errors: [{ detail: 'E-mail já cadastrado' }],
      },
      'fallback',
    );

    expect(message).toBe('E-mail já cadastrado');
  });

  it('falls back to envelope message', () => {
    const message = resolveApiErrorMessage(
      { success: false, message: 'Operação inválida' },
      'fallback',
    );

    expect(message).toBe('Operação inválida');
  });

  it('uses the provided fallback when body has no usable message', () => {
    expect(resolveApiErrorMessage(null, 'fallback')).toBe('fallback');
    expect(resolveApiErrorMessage({}, 'fallback')).toBe('fallback');
  });
});
