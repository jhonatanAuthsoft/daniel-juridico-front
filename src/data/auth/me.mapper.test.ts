import { mapMeWireToResult } from './me.mapper';

describe('mapMeWireToResult', () => {
  it('reads client photo key', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '1',
          email: 'a@b.com',
          nomeCompleto: 'A',
          perfil: 'CLIENTE',
        },
        cliente: {
          perfil: { fotoUrl: 'tmp/clientes/perfil/abc.jpg' },
        },
      }),
    ).toEqual({ photoKey: 'tmp/clientes/perfil/abc.jpg' });
  });

  it('reads lawyer photo key when client is absent', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '2',
          email: 'adv@b.com',
          nomeCompleto: 'B',
          perfil: 'ADVOGADO',
        },
        advogado: {
          perfil: { fotoUrl: 'tmp/advogados/perfil/xyz.png' },
        },
      }),
    ).toEqual({ photoKey: 'tmp/advogados/perfil/xyz.png' });
  });

  it('returns null when fotoUrl is missing or blank', () => {
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
    ).toEqual({ photoKey: null });
  });
});
