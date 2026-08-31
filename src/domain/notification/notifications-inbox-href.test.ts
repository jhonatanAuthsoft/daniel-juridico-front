import { notificationsInboxHrefForRole } from './notifications-inbox-href';

describe('notificationsInboxHrefForRole', () => {
  it('opens the lawyer notifications tab', () => {
    expect(notificationsInboxHrefForRole('LAWYER')).toBe('/lawyer/notificacoes');
  });

  it('opens the client notifications tab', () => {
    expect(notificationsInboxHrefForRole('CLIENT')).toBe('/client/notificacoes');
  });
});
