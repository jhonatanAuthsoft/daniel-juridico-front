import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';

import {
  BANNER_ENTER_MS,
  BANNER_EXIT_MS,
  FeedbackBanner,
  type FeedbackBannerVariant,
} from './feedback-banner.component';

export const BANNER_AUTO_DISMISS_MS = 5000;
export { BANNER_ENTER_MS, BANNER_EXIT_MS };

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
 * Fade uses Reanimated entering/exiting. An in-flow spacer keeps the screen
 * laid out during the fade, then collapses after the banner is gone.
 */
export function BannerProvider({ children }: BannerProviderProps) {
  const [banner, setBanner] = useState<BannerState | null>(null);
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
      <BannerHost banner={banner} onDismiss={hideBanner}>
        {children}
      </BannerHost>
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

type BannerHostProps = {
  banner: BannerState | null;
  onDismiss: () => void;
  children: ReactNode;
};

function BannerHost({ banner, onDismiss, children }: BannerHostProps) {
  const insets = useContext(SafeAreaInsetsContext) ?? ZERO_INSETS;
  const [spacerHeight, setSpacerHeight] = useState(0);

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timeoutId = setTimeout(onDismiss, BANNER_AUTO_DISMISS_MS);
    return () => clearTimeout(timeoutId);
  }, [banner, onDismiss]);

  useEffect(() => {
    if (banner) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSpacerHeight(0);
    }, BANNER_EXIT_MS);
    return () => clearTimeout(timeoutId);
  }, [banner]);

  return (
    <View style={styles.root}>
      <View
        pointerEvents="none"
        style={{ height: spacerHeight }}
        testID="feedback-banner-spacer"
      />
      <View style={styles.screen}>{children}</View>
      <View
        pointerEvents="box-none"
        style={styles.overlay}
        testID="feedback-banner-overlay">
        {banner ? (
          <Animated.View
            key={banner.id}
            entering={FadeIn.duration(BANNER_ENTER_MS).easing(
              Easing.out(Easing.quad),
            )}
            exiting={FadeOut.duration(BANNER_EXIT_MS).easing(
              Easing.in(Easing.quad),
            )}
            onLayout={(event) => {
              setSpacerHeight(
                Math.max(0, event.nativeEvent.layout.height - insets.top),
              );
            }}
            pointerEvents="box-none"
            style={[
              styles.slot,
              { paddingTop: insets.top + Spacing.sm },
            ]}
            testID="feedback-banner-slot">
            <FeedbackBanner
              animated={false}
              message={banner.message}
              onDismiss={onDismiss}
              variant={banner.variant}
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
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  slot: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
