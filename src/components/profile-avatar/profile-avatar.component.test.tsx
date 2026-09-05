import { render } from '@testing-library/react-native';

import { useMe } from '@/domain/auth';
import { useObjectReadUrl } from '@/domain/arquivo';

import { ProfileAvatar } from './profile-avatar.component';

const NO_IMAGE_PLACEHOLDER = require('@/assets/images/no-image-placeholder.png');

jest.mock('@/domain/auth', () => ({
  useMe: jest.fn(),
}));

jest.mock('@/domain/arquivo', () => ({
  useObjectReadUrl: jest.fn(),
}));

const mockUseMe = jest.mocked(useMe);
const mockUseObjectReadUrl = jest.mocked(useObjectReadUrl);

function imageSource(screen: ReturnType<typeof render>, testID = 'profile-image') {
  const raw = screen.getByTestId(testID).props.source;
  return Array.isArray(raw) ? raw[0] : raw;
}

describe('ProfileAvatar', () => {
  beforeEach(() => {
    mockUseMe.mockReturnValue({
      data: { photoKey: null },
      isLoading: false,
    } as ReturnType<typeof useMe>);
    mockUseObjectReadUrl.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useObjectReadUrl>);
  });

  it('uses the no-image placeholder for every profile while the photo is missing', () => {
    const screen = render(<ProfileAvatar />);

    expect(imageSource(screen)).toBe(NO_IMAGE_PLACEHOLDER);
  });

  it('shows a loading indicator while /usuarios/me is loading', () => {
    mockUseMe.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useMe>);

    const screen = render(<ProfileAvatar />);

    expect(screen.getByTestId('profile-avatar-loading')).toBeTruthy();
    expect(imageSource(screen)).toBe(NO_IMAGE_PLACEHOLDER);
  });

  it('shows a loading indicator while the signed read URL is loading', () => {
    mockUseMe.mockReturnValue({
      data: { photoKey: 'tmp/advogados/perfil/photo.jpg' },
      isLoading: false,
    } as ReturnType<typeof useMe>);
    mockUseObjectReadUrl.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useObjectReadUrl>);

    const screen = render(<ProfileAvatar />);

    expect(screen.getByTestId('profile-avatar-loading')).toBeTruthy();
    expect(imageSource(screen)).toBe(NO_IMAGE_PLACEHOLDER);
  });

  it('renders the remote photo when the read URL is available', () => {
    mockUseMe.mockReturnValue({
      data: { photoKey: 'tmp/advogados/perfil/photo.jpg' },
      isLoading: false,
    } as ReturnType<typeof useMe>);
    mockUseObjectReadUrl.mockReturnValue({
      data: { readUrl: 'https://cdn.example/photo.jpg', expiresInSeconds: 900 },
      isLoading: false,
    } as ReturnType<typeof useObjectReadUrl>);

    const screen = render(<ProfileAvatar />);

    expect(imageSource(screen)).toEqual({ uri: 'https://cdn.example/photo.jpg' });
    expect(screen.queryByTestId('profile-avatar-loading')).toBeNull();
  });
});
