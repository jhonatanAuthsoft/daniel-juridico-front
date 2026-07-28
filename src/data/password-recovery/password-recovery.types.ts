/** Wire / domain types for password recovery (`/usuarios/*`). */

/** Wire body for `POST /usuarios/recuperar-senha`. */
export type RequestPasswordRecoveryWireRequest = {
  email: string;
};

/** Wire response for `POST /usuarios/recuperar-senha`. */
export type RequestPasswordRecoveryWireResponse = {
  mensagem: string;
  aguardarSegundos: number | null;
};

export type RequestPasswordRecoveryResult = {
  message: string;
  waitSeconds: number | null;
};

/** Wire body for `POST /usuarios/validar-codigo-recuperacao`. */
export type ValidateRecoveryCodeWireRequest = {
  email: string;
  codigo: string;
};

/** Wire response for `POST /usuarios/validar-codigo-recuperacao`. */
export type ValidateRecoveryCodeWireResponse = {
  valido: boolean;
  mensagem: string;
};

export type ValidateRecoveryCodeResult = {
  valid: boolean;
  message: string;
};

/** Wire body for `POST /usuarios/redefinir-senha`. */
export type ResetPasswordWireRequest = {
  email: string;
  codigo: string;
  novaSenha: string;
  confirmarSenha: string;
};

/** Wire response for `POST /usuarios/redefinir-senha`. */
export type ResetPasswordWireResponse = {
  mensagem: string;
};

export type ResetPasswordResult = {
  message: string;
};

export type RequestPasswordRecoveryParams = {
  email: string;
};

export type ValidateRecoveryCodeParams = {
  email: string;
  code: string;
};

export type ResetPasswordParams = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};
