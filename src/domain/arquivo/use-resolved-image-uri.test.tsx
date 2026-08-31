import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { isDirectImageUri, useResolvedImageUri } from './use-resolved-image-uri';

const mockRequestReadUrl = jest.fn();

jest.mock('@/data/arquivo', () => ({
  requestReadUrl: (...args: unknown[]) => mockRequestReadUrl(...args),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
    },
  });

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

describe('isDirectImageUri', () => {
  it('accepts local and remote image URIs', () => {
    expect(isDirectImageUri('https://cdn.example/front.jpg')).toBe(true);
    expect(isDirectImageUri('http://localhost/a.png')).toBe(true);
    expect(isDirectImageUri('file://front.jpg')).toBe(true);
    expect(isDirectImageUri('content://media/1')).toBe(true);
  });

  it('rejects S3 object keys', () => {
    expect(isDirectImageUri('tmp/advogados/oab/front.jpg')).toBe(false);
    expect(isDirectImageUri('')).toBe(false);
  });
});

describe('useResolvedImageUri', () => {
  beforeEach(() => {
    mockRequestReadUrl.mockReset();
  });

  it('returns a local or https URI as-is without calling url-leitura', () => {
    const Wrapper = createWrapper();
    const { result } = renderHook(
      () => useResolvedImageUri('file://front.jpg'),
      { wrapper: Wrapper },
    );

    expect(result.current).toEqual({
      uri: 'file://front.jpg',
      isResolving: false,
      isError: false,
    });
    expect(mockRequestReadUrl).not.toHaveBeenCalled();
  });

  it('resolves an S3 key through url-leitura', async () => {
    mockRequestReadUrl.mockResolvedValue({
      key: 'tmp/advogados/oab/front.jpg',
      readUrl: 'https://signed.example/front.jpg',
      expiresInSeconds: 900,
    });

    const Wrapper = createWrapper();
    const { result } = renderHook(
      () => useResolvedImageUri('tmp/advogados/oab/front.jpg'),
      { wrapper: Wrapper },
    );

    expect(result.current).toEqual({ uri: '', isResolving: true, isError: false });

    await waitFor(() => {
      expect(result.current).toEqual({
        uri: 'https://signed.example/front.jpg',
        isResolving: false,
        isError: false,
      });
    });
    expect(mockRequestReadUrl).toHaveBeenCalledWith(
      { key: 'tmp/advogados/oab/front.jpg' },
      expect.anything(),
    );
  });

  it('stops spinning when url-leitura fails', async () => {
    mockRequestReadUrl.mockRejectedValue(new Error('key inválida'));

    const Wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useResolvedImageUri(
          'tmp/advogados/oab/11111111-1111-1111-1111-111111111111.jpg',
        ),
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        uri: '',
        isResolving: false,
        isError: true,
      });
    });
  });
});
