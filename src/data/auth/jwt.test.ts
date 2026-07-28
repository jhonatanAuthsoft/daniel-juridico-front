import {
  getJwtExpirationMs,
  isAccessTokenExpiringSoon,
} from './jwt';

function buildToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString(
    'base64url',
  );
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.sig`;
}

describe('jwt helpers', () => {
  it('reads exp from the JWT payload', () => {
    const token = buildToken({ exp: 1_700_000_000 });
    expect(getJwtExpirationMs(token)).toBe(1_700_000_000_000);
  });

  it('detects tokens expiring within the threshold', () => {
    const now = 1_000_000;
    const expiring = buildToken({ exp: Math.floor((now + 30_000) / 1000) });
    const fresh = buildToken({ exp: Math.floor((now + 120_000) / 1000) });

    expect(isAccessTokenExpiringSoon(expiring, 60_000, now)).toBe(true);
    expect(isAccessTokenExpiringSoon(fresh, 60_000, now)).toBe(false);
  });
});
