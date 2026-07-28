import { mapLoginParamsToWire, mapLoginWireToResult } from './login.mapper';

describe('login.mapper', () => {
  it('maps credentials to the wire body with deviceId', () => {
    expect(
      mapLoginParamsToWire({
        email: ' Maria@Laweact.com ',
        password: 'Secret12',
        deviceId: 'ios-abc',
      }),
    ).toEqual({
      email: 'maria@laweact.com',
      senha: 'Secret12',
      deviceId: 'ios-abc',
    });
  });

  it('maps the login response to the domain result', () => {
    const result = mapLoginWireToResult({
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      usuario: {
        id: 'user-1',
        nomeCompleto: 'Maria Silva',
        email: 'maria@laweact.com',
        status: 'ATIVO',
        perfil: 'CLIENTE',
        telefone: '11999999999',
        termosAceitos: false,
      },
      cliente: {},
      advogado: null,
    });

    expect(result).toMatchObject({
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      user: {
        id: 'user-1',
        email: 'maria@laweact.com',
        fullName: 'Maria Silva',
        profile: 'CLIENTE',
        phone: '11999999999',
        termsAccepted: false,
      },
    });
  });
});
