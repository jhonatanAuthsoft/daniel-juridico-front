/** Wire types for `POST /usuarios/refresh`. */

export type RefreshTokensParams = {
  token: string;
  refreshToken: string;
};

export type RefreshTokensWireRequest = {
  token: string;
  refreshToken: string;
};

export type RefreshTokensWireResponse = {
  token: string;
  refreshToken: string;
};

export type RefreshTokensResult = {
  token: string;
  refreshToken: string;
};
