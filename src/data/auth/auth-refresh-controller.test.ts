import { ensureFreshAccessToken, isRefreshInFlight } from './auth-refresh-controller';
import * as refreshApi from './refresh.api';
import { clearAuthSessionStore, setAuthSession } from './session-store';

function buildToken(expSecondsFromNow: number): string {
  const exp = Math.floor(Date.now() / 1000) + expSecondsFromNow;
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `${header}.${body}.sig`;
}

describe('auth-refresh-controller', () => {
  beforeEach(async () => {
    await clearAuthSessionStore();
    jest.restoreAllMocks();
  });

  it('returns the current token when it is still fresh', async () => {
    const token = buildToken(600);
    await setAuthSession({
      token,
      refreshToken: 'refresh-1',
      user: {
        id: '1',
        email: 'a@b.com',
        name: 'A',
        role: 'CLIENT',
        termsAccepted: true,
      },
    });

    const refreshSpy = jest.spyOn(refreshApi, 'refreshTokens');
    await expect(ensureFreshAccessToken()).resolves.toBe(token);
    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it('runs a single refresh for concurrent callers', async () => {
    const token = buildToken(10);
    await setAuthSession({
      token,
      refreshToken: 'refresh-1',
      user: {
        id: '1',
        email: 'a@b.com',
        name: 'A',
        role: 'CLIENT',
        termsAccepted: true,
      },
    });

    let resolveRefresh!: (value: { token: string; refreshToken: string }) => void;
    const refreshPromise = new Promise<{ token: string; refreshToken: string }>((resolve) => {
      resolveRefresh = resolve;
    });

    jest.spyOn(refreshApi, 'refreshTokens').mockReturnValue(refreshPromise);

    const first = ensureFreshAccessToken();
    const second = ensureFreshAccessToken();

    expect(isRefreshInFlight()).toBe(true);

    resolveRefresh({
      token: 'access-2',
      refreshToken: 'refresh-2',
    });

    await expect(Promise.all([first, second])).resolves.toEqual(['access-2', 'access-2']);
    expect(refreshApi.refreshTokens).toHaveBeenCalledTimes(1);
    expect(isRefreshInFlight()).toBe(false);
  });
});
