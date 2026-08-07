export const arquivoKeys = {
  all: ['arquivo'] as const,
  readUrl: (key: string) => [...arquivoKeys.all, 'read-url', key] as const,
};
