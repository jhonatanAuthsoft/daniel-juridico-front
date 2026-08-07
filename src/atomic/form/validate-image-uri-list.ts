/**
 * Wallet photo pair rules (frente + verso):
 * - required: must have at least `minCount` images (default 1)
 * - optional with minCount: either none, or at least `minCount` (never a partial pair)
 */
export function validateImageUriList(
  value: unknown,
  options: {
    required?: boolean;
    minCount?: number;
    multiple?: boolean;
  },
): true | string {
  const { required = false, minCount, multiple = false } = options;

  if (!required && minCount == null) {
    return true;
  }

  if (!multiple) {
    if (!required) {
      return true;
    }
    const uri = typeof value === 'string' ? value.trim() : '';
    return uri ? true : 'Campo obrigatório';
  }

  const uris = Array.isArray(value) ? value.filter(Boolean) : [];
  const pairMinimum = minCount ?? (required ? 1 : 0);

  if (required) {
    if (uris.length < pairMinimum) {
      return pairMinimum >= 2
        ? 'Anexe as fotos de frente e verso'
        : 'Campo obrigatório';
    }
    return true;
  }

  // Optional: allow empty, but never a partial set.
  if (uris.length === 0) {
    return true;
  }
  if (pairMinimum > 0 && uris.length < pairMinimum) {
    return 'Anexe frente e verso, ou remova a foto';
  }
  return true;
}
