import {
  mapDeleteAccountWireToResult,
  mapUpdatePasswordParamsToWire,
  mapUpdatePasswordWireToResult,
  mapUpdateProfilePhotoParamsToWire,
  mapUpdateProfilePhotoWireToResult,
} from './user.mapper';

describe('mapUpdateProfilePhoto', () => {
  it('maps the S3 key to the wire fotoUrl field', () => {
    expect(
      mapUpdateProfilePhotoParamsToWire({
        photoKey: 'tmp/clientes/perfil/11111111-1111-1111-1111-111111111111.jpg',
      }),
    ).toEqual({
      fotoUrl: 'tmp/clientes/perfil/11111111-1111-1111-1111-111111111111.jpg',
    });
  });

  it('maps the wire fotoUrl back to photoKey', () => {
    expect(
      mapUpdateProfilePhotoWireToResult({
        fotoUrl: 'tmp/advogados/perfil/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png',
      }),
    ).toEqual({
      photoKey: 'tmp/advogados/perfil/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee.png',
    });
  });
});

describe('mapUpdatePassword', () => {
  it('maps current and new password to the PATCH wire body', () => {
    expect(
      mapUpdatePasswordParamsToWire({
        currentPassword: 'Secret12',
        newPassword: 'NovaSenha1',
      }),
    ).toEqual({
      senhaAtual: 'Secret12',
      novaSenha: 'NovaSenha1',
    });
  });

  it('maps the wire message to the domain result', () => {
    expect(
      mapUpdatePasswordWireToResult({
        mensagem: 'Senha alterada com sucesso',
      }),
    ).toEqual({
      message: 'Senha alterada com sucesso',
    });
  });
});

describe('mapDeleteAccount', () => {
  it('maps the envelope message to the domain result', () => {
    expect(
      mapDeleteAccountWireToResult({
        message: 'Conta excluída com sucesso',
      }),
    ).toEqual({
      message: 'Conta excluída com sucesso',
    });
  });
});
