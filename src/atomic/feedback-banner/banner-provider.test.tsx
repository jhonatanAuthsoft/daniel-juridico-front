import { fireEvent, render } from '@testing-library/react-native';
import { act } from 'react';
import { Pressable, Text } from 'react-native';

import {
  BANNER_EXIT_MS,
  BannerProvider,
  showBanner,
  useBanner,
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
      expect.objectContaining({ position: 'absolute' }),
    );

    const slot = screen.getByTestId('feedback-banner-slot');
    expect(slot.props.entering).toBeTruthy();
    expect(slot.props.exiting).toBeTruthy();
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
      jest.advanceTimersByTime(1 + BANNER_EXIT_MS);
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

    act(() => {
      jest.advanceTimersByTime(BANNER_EXIT_MS);
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
});
