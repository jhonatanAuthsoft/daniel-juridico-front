import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useRootNavigationState, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { BrandColors } from '@/constants/theme';

const splashAnimation = require('@/assets/splash/splash-screen.json');

/** Fallback if onAnimationFinish never fires (~3.4s animation + buffer). */
const SPLASH_FALLBACK_MS = 8000;
/** Soft crossfade after the Lottie iris finishes. */
const FADE_OUT_MS = 520;
/** Safety if the destination screen never signals ready. */
const CONTENT_READY_FALLBACK_MS = 1200;

type SplashGateContextValue = {
  markContentReady: () => void;
};

const SplashGateContext = createContext<SplashGateContextValue | null>(null);

export function useSplashGate() {
  return useContext(SplashGateContext);
}

export type SplashGuardProps = {
  children: ReactNode;
};

/**
 * Lottie splash overlay. Background stays transparent so the red circle
 * iris can reveal the destination screen underneath (not a solid red fill).
 */
export function SplashGuard({ children }: SplashGuardProps) {
  const [animationDone, setAnimationDone] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);
  const hasHiddenNativeSplash = useRef(false);
  const hasStartedDismiss = useRef(false);
  const navigationState = useRootNavigationState();
  const segments = useSegments();

  const overlayOpacity = useSharedValue(1);
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const navigationReady = Boolean(navigationState?.key);
  const rootSegment = segments[0] as string | undefined;
  const leftIndexRoute = rootSegment !== undefined && rootSegment !== 'index';

  const markContentReady = useCallback(() => {
    setContentReady(true);
  }, []);

  const contextValue = useMemo(
    () => ({
      markContentReady,
    }),
    [markContentReady],
  );

  const hideNativeSplash = useCallback(() => {
    if (hasHiddenNativeSplash.current) {
      return;
    }

    hasHiddenNativeSplash.current = true;
    void SplashScreen.hideAsync();
  }, []);

  const unmountOverlay = useCallback(() => {
    setOverlayMounted(false);
  }, []);

  const startDismiss = useCallback(() => {
    if (hasStartedDismiss.current) {
      return;
    }

    hasStartedDismiss.current = true;
    hideNativeSplash();

    overlayOpacity.value = withTiming(
      0,
      {
        duration: FADE_OUT_MS,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(unmountOverlay)();
        }
      },
    );
  }, [hideNativeSplash, overlayOpacity, unmountOverlay]);

  const handleAnimationFinish = useCallback((isCancelled: boolean) => {
    if (isCancelled) {
      return;
    }

    setAnimationDone(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setAnimationDone(true), SPLASH_FALLBACK_MS);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!animationDone || !navigationReady) {
      return;
    }

    const timeoutId = setTimeout(() => setContentReady(true), CONTENT_READY_FALLBACK_MS);
    return () => clearTimeout(timeoutId);
  }, [animationDone, navigationReady]);

  useEffect(() => {
    if (!animationDone || !navigationReady || !contentReady) {
      return;
    }

    if (leftIndexRoute) {
      startDismiss();
      return;
    }

    const timeoutId = setTimeout(startDismiss, 180);
    return () => clearTimeout(timeoutId);
  }, [animationDone, contentReady, leftIndexRoute, navigationReady, startDismiss]);

  return (
    <SplashGateContext.Provider value={contextValue}>
      <View style={[styles.root, overlayMounted && styles.rootWhileSplash]}>
        <View style={styles.app}>{children}</View>
        {overlayMounted ? (
          <Animated.View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onLayout={hideNativeSplash}
            pointerEvents="auto"
            style={[styles.overlay, overlayStyle]}>
            <LottieView
              source={splashAnimation}
              autoPlay
              loop={false}
              resizeMode="cover"
              style={styles.lottie}
              onAnimationLoaded={hideNativeSplash}
              onAnimationFinish={handleAnimationFinish}
              onAnimationFailure={() => setAnimationDone(true)}
            />
          </Animated.View>
        ) : null}
      </View>
    </SplashGateContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  rootWhileSplash: {},
  app: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Must stay transparent: a solid fill kills the Lottie iris
    // (outside the red circle would match the fill instead of showing through).
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
