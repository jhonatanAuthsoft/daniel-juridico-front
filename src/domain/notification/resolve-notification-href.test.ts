import { resolveNotificationHref } from './resolve-notification-href';

describe('resolveNotificationHref', () => {
  it('opens lawyer solicitation details by connection id', () => {
    expect(
      resolveNotificationHref({
        role: 'LAWYER',
        notification: {
          type: 'CONEXAO_SOLICITADA',
          referenceType: 'CONEXAO',
          referenceId: 'cx-1',
        },
      }),
    ).toBe('/lawyer/solicitacao/cx-1');
  });

  it('opens client solicitation details when solicitationId is known', () => {
    expect(
      resolveNotificationHref({
        role: 'CLIENT',
        notification: {
          type: 'CONEXAO_ACEITA',
          referenceType: 'CONEXAO',
          referenceId: 'cx-1',
        },
        solicitationId: 'sol-9',
      }),
    ).toBe('/client/solicitacao/sol-9');
  });

  it('returns null for client when solicitationId is missing', () => {
    expect(
      resolveNotificationHref({
        role: 'CLIENT',
        notification: {
          type: 'CONEXAO_ACEITA',
          referenceType: 'CONEXAO',
          referenceId: 'cx-1',
        },
      }),
    ).toBeNull();
  });

  it('returns null when reference id is blank', () => {
    expect(
      resolveNotificationHref({
        role: 'LAWYER',
        notification: {
          type: 'CONEXAO_SOLICITADA',
          referenceType: 'CONEXAO',
          referenceId: '  ',
        },
      }),
    ).toBeNull();
  });
});
