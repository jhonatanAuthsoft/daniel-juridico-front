import { render } from '@testing-library/react-native';

import { BellsIcon } from '@/assets/icon/bells-icon';
import { HistoryIcon } from '@/assets/icon/history-icon';
import { SolicitationIcon } from '@/assets/icon/solicitation-icon';
import { BrandColors } from '@/constants/theme';

import { AppTabBar } from './app-tab-bar.component';
import { CLIENT_TAB_VISUALS, LAWYER_TAB_VISUALS } from './tab-visuals';

const mockUseUnread = jest.fn();

jest.mock('@/domain/notification', () => ({
  useUnreadNotificationsExist: () => mockUseUnread(),
}));

jest.mock('@/components/profile-avatar', () => ({
  ProfileAvatar: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const baseProps = {
  state: {
    index: 0,
    routes: [
      { key: 'index', name: 'index' },
      { key: 'notificacoes', name: 'notificacoes' },
      { key: 'perfil', name: 'perfil' },
    ],
  },
  descriptors: {
    index: { options: {} },
    notificacoes: { options: {} },
    perfil: { options: {} },
  },
  navigation: {
    emit: () => ({ defaultPrevented: false }),
    navigate: jest.fn(),
  },
  visuals: CLIENT_TAB_VISUALS,
};

describe('AppTabBar unread dot', () => {
  beforeEach(() => {
    mockUseUnread.mockReset();
  });

  it('hides the unread dot when there are no unread notifications', () => {
    mockUseUnread.mockReturnValue({ data: { exists: false } });

    const screen = render(<AppTabBar {...baseProps} />);

    expect(screen.queryByTestId('tab-notifications-unread-dot')).toBeNull();
  });

  it('uses the imported solicitation and bells icons on the client tab bar', () => {
    mockUseUnread.mockReturnValue({ data: { exists: false } });

    const screen = render(<AppTabBar {...baseProps} />);

    expect(screen.UNSAFE_getByType(SolicitationIcon)).toBeTruthy();
    expect(screen.UNSAFE_getByType(BellsIcon)).toBeTruthy();
  });

  it('uses the imported history icon on the lawyer tab bar', () => {
    mockUseUnread.mockReturnValue({ data: { exists: false } });

    const screen = render(
      <AppTabBar
        {...baseProps}
        visuals={LAWYER_TAB_VISUALS}
        state={{
          index: 0,
          routes: [
            { key: 'index', name: 'index' },
            { key: 'historico', name: 'historico' },
            { key: 'notificacoes', name: 'notificacoes' },
            { key: 'perfil', name: 'perfil' },
          ],
        }}
        descriptors={{
          index: { options: {} },
          historico: { options: {} },
          notificacoes: { options: {} },
          perfil: { options: {} },
        }}
      />,
    );

    expect(screen.UNSAFE_getByType(HistoryIcon)).toBeTruthy();
    expect(screen.UNSAFE_getByType(SolicitationIcon)).toBeTruthy();
    expect(screen.UNSAFE_getByType(BellsIcon)).toBeTruthy();
  });

  it('shows a light red unread dot when notifications tab is not selected', () => {
    mockUseUnread.mockReturnValue({ data: { exists: true } });

    const screen = render(<AppTabBar {...baseProps} />);
    const dot = screen.getByTestId('tab-notifications-unread-dot');

    expect(dot).toBeTruthy();
    expect(dot.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
          top: 0,
          right: 0,
        }),
        expect.objectContaining({
          backgroundColor: BrandColors.primary.light,
        }),
      ]),
    );
  });

  it('shows a white unread dot when notifications tab is selected', () => {
    mockUseUnread.mockReturnValue({ data: { exists: true } });

    const screen = render(
      <AppTabBar
        {...baseProps}
        state={{ ...baseProps.state, index: 1 }}
      />,
    );
    const dot = screen.getByTestId('tab-notifications-unread-dot');

    expect(dot.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          position: 'absolute',
          top: 0,
          right: 0,
        }),
        expect.objectContaining({
          backgroundColor: BrandColors.neutral.white,
        }),
      ]),
    );
  });
});
