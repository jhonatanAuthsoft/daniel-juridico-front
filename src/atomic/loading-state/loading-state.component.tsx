import {
  Children,
  useMemo,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { StyleProp, ViewStyle } from 'react-native';

type LoadingStateType = 'loading' | 'error' | 'data' | 'empty';

type SlotProps = PropsWithChildren;

function EmptyState(props: SlotProps) {
  return <>{props.children}</>;
}
EmptyState.displayName = 'EmptyState';

function ErrorPlaceholder(props: SlotProps) {
  return <>{props.children}</>;
}
ErrorPlaceholder.displayName = 'ErrorPlaceholder';

function Shimmer(props: SlotProps) {
  return <>{props.children}</>;
}
Shimmer.displayName = 'Shimmer';

const LoadingStateInnerComponents = {
  EmptyState,
  ErrorPlaceholder,
  Shimmer,
} as const;

const LoadingStateInnerComponentNames = Object.keys(
  LoadingStateInnerComponents,
);

const loadingStateToComponent: Record<
  LoadingStateType,
  keyof typeof LoadingStateInnerComponents | undefined
> = {
  loading: 'Shimmer',
  error: 'ErrorPlaceholder',
  empty: 'EmptyState',
  data: undefined,
};

export type LoadingStateProps = {
  children?: ReactNode;
  /** When true, shows non-slot children (the real content). */
  data: boolean;
  loading: boolean;
  error: boolean;
  style?: StyleProp<ViewStyle>;
};

function getChildDisplayName(child: ReactNode): string | undefined {
  if (child == null || typeof child !== 'object' || !('type' in child)) {
    return undefined;
  }
  const type = (child as ReactElement).type;
  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function' || typeof type === 'object') {
    return (type as { displayName?: string }).displayName;
  }
  return undefined;
}

/**
 * Switches between shimmer / error / empty / content slots with a fade transition.
 *
 * @example
 * ```tsx
 * <LoadingState data={hasData} loading={isLoading} error={isError}>
 *   <LoadingState.Shimmer>...</LoadingState.Shimmer>
 *   <LoadingState.ErrorPlaceholder>...</LoadingState.ErrorPlaceholder>
 *   <LoadingState.EmptyState>...</LoadingState.EmptyState>
 *   <ActualContent />
 * </LoadingState>
 * ```
 */
export function LoadingState(props: LoadingStateProps) {
  const currentState = useMemo<LoadingStateType>(() => {
    if (props.data) {
      return 'data';
    }
    if (props.loading) {
      return 'loading';
    }
    if (props.error) {
      return 'error';
    }
    return 'empty';
  }, [props.data, props.loading, props.error]);

  const children = useMemo(() => {
    return Children.toArray(props.children).filter((child) => {
      const childName = getChildDisplayName(child);
      if (currentState === 'data') {
        return !LoadingStateInnerComponentNames.some(
          (innerCompName) => innerCompName === childName,
        );
      }
      return loadingStateToComponent[currentState] === childName;
    });
  }, [currentState, props.children]);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[{ flex: 1, flexGrow: 1 }, props.style]}>
      {children}
    </Animated.View>
  );
}

LoadingState.EmptyState = EmptyState;
LoadingState.ErrorPlaceholder = ErrorPlaceholder;
LoadingState.Shimmer = Shimmer;
