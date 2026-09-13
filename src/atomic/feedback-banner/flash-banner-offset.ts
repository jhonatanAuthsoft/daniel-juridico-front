import { Spacing } from '@/constants/theme';

/** Gap between the flash banner and the tab bar or the bottom of the screen. */
export const FLASH_BANNER_BOTTOM_GAP = Spacing.sm;

export function getFlashBannerBottomOffset(
  tabBarHeight: number,
  safeAreaBottom: number,
): number {
  if (tabBarHeight > 0) {
    return tabBarHeight + FLASH_BANNER_BOTTOM_GAP;
  }

  return safeAreaBottom + FLASH_BANNER_BOTTOM_GAP;
}
