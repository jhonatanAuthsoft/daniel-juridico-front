import { fireEvent, render } from '@testing-library/react-native';

import { BrandColors } from '@/constants/theme';

import { FeedbackBanner } from './feedback-banner.component';

describe('FeedbackBanner', () => {
  it('shows the message and dismisses on close', () => {
    const onDismiss = jest.fn();
    const screen = render(
      <FeedbackBanner message="E-mail ou senha incorretos" onDismiss={onDismiss} />,
    );

    expect(screen.getByLabelText('E-mail ou senha incorretos')).toBeTruthy();
    expect(screen.getByText('E-mail ou senha incorretos')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Fechar'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('uses a fade enter and exit animation', () => {
    const screen = render(
      <FeedbackBanner message="E-mail ou senha incorretos" onDismiss={jest.fn()} />,
    );

    const banner = screen.getByLabelText('E-mail ou senha incorretos');

    expect(banner.props.entering).toBeTruthy();
    expect(banner.props.exiting).toBeTruthy();
  });

  it('can skip enter/exit animation when hosted by the overlay', () => {
    const screen = render(
      <FeedbackBanner
        animated={false}
        message="E-mail ou senha incorretos"
        onDismiss={jest.fn()}
      />,
    );

    const banner = screen.getByLabelText('E-mail ou senha incorretos');

    expect(banner.props.entering).toBeUndefined();
    expect(banner.props.exiting).toBeUndefined();
  });

  it.each([
    ['success', BrandColors.feedback.success.light, BrandColors.feedback.success.dark],
    ['warning', BrandColors.feedback.warning.light, BrandColors.feedback.warning.dark],
    ['error', BrandColors.feedback.error.light, BrandColors.feedback.error.dark],
  ] as const)('applies %s colors from the theme', (variant, background, foreground) => {
    const screen = render(
      <FeedbackBanner
        message="Feedback message"
        onDismiss={jest.fn()}
        variant={variant}
      />,
    );

    const banner = screen.getByLabelText('Feedback message');
    expect(banner.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: background })]),
    );
    expect(screen.getByText('Feedback message').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: foreground })]),
    );
  });
});
