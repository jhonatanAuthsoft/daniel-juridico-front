import {
  mapRequestPasswordRecoveryParamsToWire,
  mapRequestPasswordRecoveryWireToResult,
  mapResetPasswordParamsToWire,
  mapResetPasswordWireToResult,
  mapValidateRecoveryCodeParamsToWire,
  mapValidateRecoveryCodeWireToResult,
} from './password-recovery.mapper';

describe('password-recovery.mapper', () => {
  it('maps request recovery params and response', () => {
    expect(
      mapRequestPasswordRecoveryParamsToWire({ email: ' Joao@Laweact.com ' }),
    ).toEqual({ email: 'joao@laweact.com' });

    expect(
      mapRequestPasswordRecoveryWireToResult({
        mensagem: 'Se existir uma conta...',
        aguardarSegundos: 5,
      }),
    ).toEqual({
      message: 'Se existir uma conta...',
      waitSeconds: 5,
    });
  });

  it('maps validate code params and response', () => {
    expect(
      mapValidateRecoveryCodeParamsToWire({
        email: 'a@b.com',
        code: '1234',
      }),
    ).toEqual({ email: 'a@b.com', codigo: '1234' });

    expect(
      mapValidateRecoveryCodeWireToResult({
        valido: true,
        mensagem: 'Código válido.',
      }),
    ).toEqual({ valid: true, message: 'Código válido.' });
  });

  it('maps reset password params and response', () => {
    expect(
      mapResetPasswordParamsToWire({
        email: 'a@b.com',
        code: '1234',
        newPassword: 'Secret12',
      }),
    ).toEqual({
      email: 'a@b.com',
      codigo: '1234',
      novaSenha: 'Secret12',
      confirmarSenha: 'Secret12',
    });

    expect(
      mapResetPasswordWireToResult({ mensagem: 'Senha alterada com sucesso' }),
    ).toEqual({ message: 'Senha alterada com sucesso' });
  });
});
