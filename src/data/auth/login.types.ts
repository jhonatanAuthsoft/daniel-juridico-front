/** Wire / domain types for `POST /usuarios/login`. */

export type LoginParams = {
  email: string;
  password: string;
  deviceId?: string;
};

/** Wire body (server field names). */
export type LoginWireRequest = {
  email: string;
  senha: string;
  deviceId?: string;
};

/** Wire user node inside the login response. */
export type LoginUserWire = {
  id: string;
  nomeCompleto: string;
  email: string;
  status: string;
  perfil: string;
  telefone?: string | null;
  termosAceitos: boolean;
};

/** Wire response for `POST /usuarios/login`. */
export type LoginWireResponse = {
  usuario: LoginUserWire;
  cliente?: Record<string, unknown> | null;
  advogado?: Record<string, unknown> | null;
  token: string;
  refreshToken: string;
};

/** Domain-friendly view of the login response. */
export type LoginResult = {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    profile: string;
    phone?: string;
    termsAccepted: boolean;
  };
  raw: LoginWireResponse;
};
