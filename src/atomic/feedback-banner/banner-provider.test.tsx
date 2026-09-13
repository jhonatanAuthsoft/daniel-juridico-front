import { fireEvent, render } from '@testing-library/react-native';
import { act } from 'react';
import { Pressable, Text } from 'react-native';

import { Spacing } from '@/constants/theme';

import {
  BANNER_EXIT_MS,
  BannerProvider,
  showBanner,
  useBanner,
  useReportTabBarHeight,
} from './banner-provider';

function Trigger({
  message,
  variant,
}: {
  message: string;
  variant: 'success' | 'error' | 'warning';
}) {
  const banner = useBanner();

  return (
    <Pressable
      accessibilityLabel="show-banner"
      onPress={() => banner(message, variant)}>
      <Text>Show</Text>
    </Pressable>
  );
}

describe('useBanner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows a success toast from the hook', () => {
    const screen = render(
      <BannerProvider>
        <Trigger message="msg de sucesso" variant="success" />
      </BannerProvider>,
    );

    fireEvent.press(screen.getByLabelText('show-banner'));

    expect(screen.getByText('msg de sucesso')).toBeTruthy();
    expect(screen.getByTestId('feedback-banner-overlay').props.style).toEqual(
      expect.objectContaining({ position: 'absolute', bottom: 0 }),
    );

    expect(screen.getByTestId('feedback-banner-slot')).toBeTruthy();
  });

  it('shows an error toast from the hook', () => {
    const screen = render(
      <BannerProvider>
        <Trigger message="msg de erro" variant="error" />
      </BannerProvider>,
    );

    fireEvent.press(screen.getByLabelText('show-banner'));

    expect(screen.getByText('msg de erro')).toBeTruthy();
  });

  it('dismisses after 5 seconds', () => {
    const screen = render(
      <BannerProvider>
        <Trigger message="msg de sucesso" variant="success" />
      </BannerProvider>,
    );

    fireEvent.press(screen.getByLabelText('show-banner'));
    expect(screen.getByText('msg de sucesso')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(4999);
    });
    expect(screen.queryByText('msg de sucesso')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.getByText('msg de sucesso')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(BANNER_EXIT_MS);
    });
    expect(screen.queryByText('msg de sucesso')).toBeNull();
  });

  it('closes immediately when the dismiss control is pressed', () => {
    const screen = render(
      <BannerProvider>
        <Trigger message="msg de erro" variant="error" />
      </BannerProvider>,
    );

    fireEvent.press(screen.getByLabelText('show-banner'));
    fireEvent.press(screen.getByLabelText('Fechar'));

    expect(screen.getByText('msg de erro')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(BANNER_EXIT_MS - 1);
    });
    expect(screen.getByText('msg de erro')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByText('msg de erro')).toBeNull();
  });

  it('shows a toast from showBanner without the hook', () => {
    const screen = render(
      <BannerProvider>
        <Pressable
          accessibilityLabel="show-from-util"
          onPress={() => showBanner('arquivo inválido', 'warning')}>
          <Text>Show</Text>
        </Pressable>
      </BannerProvider>,
    );

    fireEvent.press(screen.getByLabelText('show-from-util'));

    expect(screen.getByText('arquivo inválido')).toBeTruthy();
  });

  it('sits 16px above the bottom when there is no tab bar', () => {
    const screen = render(
      <BannerProvider>
        <Trigger message="msg de sucesso" variant="success" />
      </BannerProvider>,
    );

    fireEvent.press(screen.getByLabelText('show-banner'));

    expect(screen.getByTestId('feedback-banner-slot').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ paddingBottom: Spacing.sm }),
      ]),
    );
  });

  it('sits 16px above the tab bar when the tab bar reports its height', () => {
    const screen = render(
      <BannerProvider>
        <ReportTabBar height={80} />
        <Trigger message="msg de sucesso" variant="success" />
      </BannerProvider>,
    );

    fireEvent.press(screen.getByLabelText('show-banner'));

    expect(screen.getByTestId('feedback-banner-slot').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ paddingBottom: 80 + Spacing.sm }),
      ]),
    );
  });
});

function ReportTabBar({ height }: { height: number }) {
  useReportTabBarHeight(height);
  return null;
}