import { Spacing } from '@/constants/theme';

import { getFlashBannerBottomOffset } from './flash-banner-offset';

describe('getFlashBannerBottomOffset', () => {
  it('keeps a 16px gap from the bottom when there is no tab bar', () => {
    expect(getFlashBannerBottomOffset(0, 0)).toBe(Spacing.sm);
    expect(getFlashBannerBottomOffset(0, 34)).toBe(34 + Spacing.sm);
  });

  it('keeps a 16px gap from the tab bar when it is visible', () => {
    expect(getFlashBannerBottomOffset(80, 34)).toBe(80 + Spacing.sm);
  });
});
