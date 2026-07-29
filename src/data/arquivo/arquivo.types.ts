export type ArquivoFinalidade =
  | 'CLIENTE_PERFIL'
  | 'ADVOGADO_PERFIL'
  | 'OAB';

export type ArquivoContentType = 'image/jpeg' | 'image/png';

export type ArquivoUrlUploadRequest = {
  finalidade: ArquivoFinalidade;
  contentType: ArquivoContentType;
  contentLength?: number;
};

export type ArquivoUrlUploadResult = {
  key: string;
  uploadUrl: string;
  expiresInSeconds: number;
  requiredHeaders: Record<string, string>;
};

export type ArquivoUrlLeituraRequest = {
  key: string;
};

export type ArquivoUrlLeituraResult = {
  key: string;
  readUrl: string;
  expiresInSeconds: number;
};
