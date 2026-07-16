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
import { Animated, StyleSheet, View } from 'react-native';
import { useRootNavigationState, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';

import { BrandColors } from '@/constants/theme';

const splashAnimation = require('@/assets/splash/splash-screen.json');

/** Fallback if onAnimationFinish never fires (~3.4s animation + buffer). */
const SPLASH_FALLBACK_MS = 8000;
const FADE_OUT_MS = 280;
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
 * Morph exit: keep the destination route mounted underneath and fade only the
 * Lottie. Overlay background must stay transparent — an opaque fill would hide
 * the real UI and break the "last frame = print da tela" effect.
 *
 * Design requirement: export Lottie with transparent composition background and
 * a last frame that matches the login layout (logo position, dark bg).
 */
export function SplashGuard({ children }: SplashGuardProps) {
  const [animationDone, setAnimationDone] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);
  const lottieOpacity = useRef(new Animated.Value(1)).current;
  const hasHiddenNativeSplash = useRef(false);
  const hasStartedDismiss = useRef(false);
  const navigationState = useRootNavigationState();
  const segments = useSegments();

  const navigationReady = Boolean(navigationState?.key);
  const leftIndexRoute = segments[0] !== undefined && segments[0] !== 'index';

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

  const startDismiss = useCallback(() => {
    if (hasStartedDismiss.current) {
      return;
    }

    hasStartedDismiss.current = true;
    hideNativeSplash();

    // Fade only the Lottie — login is already painted underneath.
    Animated.timing(lottieOpacity, {
      toValue: 0,
      duration: FADE_OUT_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setOverlayMounted(false);
      }
    });
  }, [hideNativeSplash, lottieOpacity]);

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

    const timeoutId = setTimeout(startDismiss, 300);
    return () => clearTimeout(timeoutId);
  }, [animationDone, contentReady, leftIndexRoute, navigationReady, startDismiss]);

  return (
    <SplashGateContext.Provider value={contextValue}>
      <View style={styles.root}>
        <View style={styles.app}>{children}</View>
        {overlayMounted ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="auto"
            style={styles.overlay}>
            <Animated.View style={[styles.lottieShell, { opacity: lottieOpacity }]}>
              <LottieView
                source={splashAnimation}
                autoPlay
                loop={false}
                resizeMode="cover"
                style={styles.lottie}
                onLayout={hideNativeSplash}
                onAnimationLoaded={hideNativeSplash}
                onAnimationFinish={handleAnimationFinish}
                onAnimationFailure={() => setAnimationDone(true)}
              />
            </Animated.View>
          </View>
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
  app: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Transparent: last Lottie frame must dissolve onto the real route beneath.
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  lottieShell: {
    ...StyleSheet.absoluteFillObject,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
