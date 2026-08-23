import { mapMeWireToResult } from './me.mapper';

describe('mapMeWireToResult', () => {
  it('reads client photo key and push preference', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '1',
          email: 'a@b.com',
          nomeCompleto: 'A',
          perfil: 'CLIENTE',
          notificacoesPushHabilitadas: true,
        },
        cliente: {
          perfil: { fotoUrl: 'tmp/clientes/perfil/abc.jpg' },
        },
      }),
    ).toEqual({
      photoKey: 'tmp/clientes/perfil/abc.jpg',
      pushNotificationsEnabled: true,
    });
  });

  it('reads lawyer photo key when client is absent', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '2',
          email: 'adv@b.com',
          nomeCompleto: 'B',
          perfil: 'ADVOGADO',
          notificacoesPushHabilitadas: false,
        },
        advogado: {
          perfil: { fotoUrl: 'tmp/advogados/perfil/xyz.png' },
        },
      }),
    ).toEqual({
      photoKey: 'tmp/advogados/perfil/xyz.png',
      pushNotificationsEnabled: false,
    });
  });

  it('returns null photo and defaults push on when fotoUrl is blank', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '3',
          email: 'c@b.com',
          nomeCompleto: 'C',
          perfil: 'CLIENTE',
        },
        cliente: { perfil: { fotoUrl: '  ' } },
      }),
    ).toEqual({ photoKey: null, pushNotificationsEnabled: true });
  });
});
