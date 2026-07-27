export type ApiErrorItem = {
  code?: string;
  field?: string;
  detail?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  timestamp?: string;
  message?: string;
  data: T;
  errors?: ApiErrorItem[];
};

/** Matches server `TermosConstants.VERSAO_ATUAL`. */
export const TERMS_VERSION = 'v1';

export type AceitarTermosRequest = {
  checkboxConfirmado: boolean;
  scrollConfirmado?: boolean;
  versao?: string;
};

export type AceitarTermosResponse = {
  id: string;
  usuarioId: string;
  versao: string;
  scrollConfirmado: boolean;
  checkboxConfirmado: boolean;
  aceitoEm: string;
  termosAceitos: boolean;
};
