import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';

import {
  BANNER_ENTER_MS,
  BANNER_EXIT_MS,
  FeedbackBanner,
  type FeedbackBannerVariant,
} from './feedback-banner.component';
import { getFlashBannerBottomOffset } from './flash-banner-offset';

export const BANNER_AUTO_DISMISS_MS = 5000;
export { BANNER_ENTER_MS, BANNER_EXIT_MS };
export { FLASH_BANNER_BOTTOM_GAP, getFlashBannerBottomOffset } from './flash-banner-offset';

const ZERO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

export type ShowBanner = (
  message: string,
  variant: FeedbackBannerVariant,
) => void;

type BannerState = {
  id: number;
  message: string;
  variant: FeedbackBannerVariant;
};

const BannerContext = createContext<ShowBanner | null>(null);
const SetTabBarHeightContext = createContext<((height: number) => void) | null>(
  null,
);

let nextBannerId = 0;
let emitBanner: ((state: BannerState | null) => void) | null = null;

/**
 * Shows a toast from anywhere (hooks, screens, or utilities).
 * No-ops if `BannerProvider` is not mounted.
 */
export const showBanner: ShowBanner = (message, variant) => {
  nextBannerId += 1;
  emitBanner?.({
    id: nextBannerId,
    message,
    variant,
  });
};

function hideBanner() {
  emitBanner?.(null);
}

type BannerProviderProps = {
  children: ReactNode;
};

/**
 * App-level host for toast banners. Use `useBanner()` to show one:
 * `banner('msg de sucesso', 'success')`.
 *
 * Flash messages sit at the bottom: 16px above the screen edge, or 16px
 * above the tab bar when it is mounted. They fade in and stay mounted
 * through fade-out so the exit is visible.
 */
export function BannerProvider({ children }: BannerProviderProps) {
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [tabBarHeight, setTabBarHeight] = useState(0);
  const show = useCallback<ShowBanner>((message, variant) => {
    showBanner(message, variant);
  }, []);

  useEffect(() => {
    emitBanner = setBanner;
    return () => {
      emitBanner = null;
    };
  }, []);

  return (
    <BannerContext.Provider value={show}>
      <SetTabBarHeightContext.Provider value={setTabBarHeight}>
        <BannerHost
          banner={banner}
          onDismiss={hideBanner}
          tabBarHeight={tabBarHeight}>
          {children}
        </BannerHost>
      </SetTabBarHeightContext.Provider>
    </BannerContext.Provider>
  );
}

/**
 * Shows a toast banner over the current screen.
 * `const banner = useBanner(); banner('msg de erro', 'error');`
 */
export function useBanner(): ShowBanner {
  return useContext(BannerContext) ?? showBanner;
}

/**
 * Reports the visible tab bar height so flash messages sit 16px above it.
 * No-ops when `BannerProvider` is not mounted.
 */
export function useReportTabBarHeight(height: number): void {
  const setTabBarHeight = useContext(SetTabBarHeightContext);

  useEffect(() => {
    if (!setTabBarHeight) {
      return;
    }

    setTabBarHeight(height);
    return () => {
      setTabBarHeight(0);
    };
  }, [height, setTabBarHeight]);
}

type BannerHostProps = {
  banner: BannerState | null;
  onDismiss: () => void;
  tabBarHeight: number;
  children: ReactNode;
};

function BannerHost({
  banner,
  onDismiss,
  tabBarHeight,
  children,
}: BannerHostProps) {
  const insets = useContext(SafeAreaInsetsContext) ?? ZERO_INSETS;
  const [displayed, setDisplayed] = useState<BannerState | null>(null);
  const hasShownRef = useRef(false);
  const opacity = useSharedValue(0);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timeoutId = setTimeout(onDismiss, BANNER_AUTO_DISMISS_MS);
    return () => clearTimeout(timeoutId);
  }, [banner, onDismiss]);

  useEffect(() => {
    if (banner) {
      hasShownRef.current = true;
      setDisplayed(banner);
      opacity.value = 0;
      opacity.value = withTiming(1, {
        duration: BANNER_ENTER_MS,
        easing: Easing.out(Easing.quad),
      });
      return;
    }

    if (!hasShownRef.current) {
      return;
    }

    opacity.value = withTiming(0, {
      duration: BANNER_EXIT_MS,
      easing: Easing.in(Easing.quad),
    });
    const timeoutId = setTimeout(() => {
      setDisplayed(null);
      hasShownRef.current = false;
    }, BANNER_EXIT_MS);
    return () => clearTimeout(timeoutId);
  }, [banner, opacity]);

  const bottomOffset = getFlashBannerBottomOffset(tabBarHeight, insets.bottom);

  return (
    <View style={styles.root}>
      <View style={styles.screen}>{children}</View>
      <View
        pointerEvents="box-none"
        style={styles.overlay}
        testID="feedback-banner-overlay">
        {displayed ? (
          <Animated.View
            pointerEvents="box-none"
            style={[styles.slot, { paddingBottom: bottomOffset }, fadeStyle]}
            testID="feedback-banner-slot">
            <FeedbackBanner
              animated={false}
              message={displayed.message}
              onDismiss={onDismiss}
              variant={displayed.variant}
            />
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  slot: {
    paddingHorizontal: Spacing.sm,
  },
});
