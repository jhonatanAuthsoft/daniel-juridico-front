import { render } from '@testing-library/react-native';

import { AppTabBar } from './app-tab-bar.component';
import { CLIENT_TAB_VISUALS } from './tab-visuals';

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

  it('shows a red unread dot when notifications tab is not selected', () => {
    mockUseUnread.mockReturnValue({ data: { exists: true } });

    const screen = render(<AppTabBar {...baseProps} />);
    const dot = screen.getByTestId('tab-notifications-unread-dot');

    expect(dot).toBeTruthy();
    expect(dot.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#EE2E24' }),
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
        expect.objectContaining({ backgroundColor: '#FFFFFF' }),
      ]),
    );
  });
});
