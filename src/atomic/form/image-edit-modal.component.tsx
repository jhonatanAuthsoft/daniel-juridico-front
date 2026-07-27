import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Body1 } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';
import { cropImage, rotateImage } from '@/utils/apply-image-edits';

const MIN_CROP = 96;
const HANDLE_HIT = 44;
const HANDLE_ARM = 24;
const HANDLE_THICKNESS = 4;
const CROP_INSET = 20;
const DEFAULT_ASPECT: [number, number] = [1, 1];

export type ImageEditModalProps = {
  visible: boolean;
  imageUri: string | null;
  /** Crop frame aspect as [width, height]. Defaults to 1×1. */
  aspect?: [number, number];
  onCancel: () => void;
  onConfirm: (uri: string) => void;
};

type ImageSize = { width: number; height: number };
type Viewport = { width: number; height: number };
type CropBox = { x: number; y: number; width: number; height: number };
type HandleEdge = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

function clampJs(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Screen rect where the image is drawn with contain (no pan/zoom). */
function getDisplayedImageRect(viewport: Viewport, imageSize: ImageSize): CropBox {
  const scale = Math.min(viewport.width / imageSize.width, viewport.height / imageSize.height);
  const width = imageSize.width * scale;
  const height = imageSize.height * scale;
  return {
    x: (viewport.width - width) / 2,
    y: (viewport.height - height) / 2,
    width,
    height,
  };
}

function buildInitialCrop(
  viewport: Viewport,
  imageSize: ImageSize,
  aspect?: [number, number],
): CropBox {
  const bounds = getDisplayedImageRect(viewport, imageSize);
  const maxW = Math.max(MIN_CROP, bounds.width - CROP_INSET * 2);
  const maxH = Math.max(MIN_CROP, bounds.height - CROP_INSET * 2);

  if (!aspect) {
    return {
      x: bounds.x + CROP_INSET,
      y: bounds.y + CROP_INSET,
      width: maxW,
      height: maxH,
    };
  }

  const ratio = aspect[0] / aspect[1];
  let width = maxW;
  let height = width / ratio;
  if (height > maxH) {
    height = maxH;
    width = height * ratio;
  }

  return {
    x: bounds.x + (bounds.width - width) / 2,
    y: bounds.y + (bounds.height - height) / 2,
    width,
    height,
  };
}

/** Keeps crop size (and center when possible) after the image rotates. */
function preserveCropSize(crop: CropBox, viewport: Viewport, imageSize: ImageSize): CropBox {
  const bounds = getDisplayedImageRect(viewport, imageSize);
  const width = Math.min(crop.width, bounds.width);
  const height = Math.min(crop.height, bounds.height);
  const centerX = crop.x + crop.width / 2;
  const centerY = crop.y + crop.height / 2;

  return {
    width,
    height,
    x: clampJs(centerX - width / 2, bounds.x, bounds.x + bounds.width - width),
    y: clampJs(centerY - height / 2, bounds.y, bounds.y + bounds.height - height),
  };
}

function resizeCrop(params: {
  edge: HandleEdge;
  translationX: number;
  translationY: number;
  origin: CropBox;
  bounds: CropBox;
  aspect?: [number, number];
}): CropBox {
  const { edge, translationX, translationY, origin, bounds, aspect } = params;
  let { x, y, width, height } = origin;
  const ratio = aspect ? aspect[0] / aspect[1] : null;
  const maxRight = bounds.x + bounds.width;
  const maxBottom = bounds.y + bounds.height;

  if (ratio == null) {
    if (edge.includes('w')) {
      const nextX = clampJs(origin.x + translationX, bounds.x, origin.x + origin.width - MIN_CROP);
      width = origin.width - (nextX - origin.x);
      x = nextX;
    }
    if (edge.includes('e')) {
      width = clampJs(origin.width + translationX, MIN_CROP, maxRight - origin.x);
    }
    if (edge.includes('n')) {
      const nextY = clampJs(origin.y + translationY, bounds.y, origin.y + origin.height - MIN_CROP);
      height = origin.height - (nextY - origin.y);
      y = nextY;
    }
    if (edge.includes('s')) {
      height = clampJs(origin.height + translationY, MIN_CROP, maxBottom - origin.y);
    }
    return { x, y, width, height };
  }

  const horizontalDominant =
    edge === 'e' || edge === 'w' || Math.abs(translationX) >= Math.abs(translationY);
  const delta = horizontalDominant
    ? edge.includes('w')
      ? -translationX
      : translationX
    : edge.includes('n')
      ? -translationY
      : translationY;

  let nextW = clampJs(origin.width + delta, MIN_CROP, bounds.width);
  let nextH = nextW / ratio;

  if (nextH < MIN_CROP) {
    nextH = MIN_CROP;
    nextW = nextH * ratio;
  }
  if (nextH > bounds.height) {
    nextH = bounds.height;
    nextW = nextH * ratio;
  }
  if (nextW > bounds.width) {
    nextW = bounds.width;
    nextH = nextW / ratio;
  }

  x = edge.includes('w') ? origin.x + origin.width - nextW : origin.x;
  y = edge.includes('n') ? origin.y + origin.height - nextH : origin.y;
  x = clampJs(x, bounds.x, maxRight - nextW);
  y = clampJs(y, bounds.y, maxBottom - nextH);

  return { x, y, width: nextW, height: nextH };
}

function moveCrop(params: {
  translationX: number;
  translationY: number;
  origin: CropBox;
  bounds: CropBox;
}): CropBox {
  const { translationX, translationY, origin, bounds } = params;
  return {
    x: clampJs(origin.x + translationX, bounds.x, bounds.x + bounds.width - origin.width),
    y: clampJs(origin.y + translationY, bounds.y, bounds.y + bounds.height - origin.height),
    width: origin.width,
    height: origin.height,
  };
}

export function ImageEditModal({
  visible,
  imageUri,
  aspect = DEFAULT_ASPECT,
  onCancel,
  onConfirm,
}: ImageEditModalProps) {
  const insets = useSafeAreaInsets();
  const [workingUri, setWorkingUri] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [crop, setCrop] = useState<CropBox | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const cropOriginRef = useRef<CropBox | null>(null);
  const skipInitialCropResetRef = useRef(false);

  const loadImageSize = useCallback(
    (uri: string) =>
      new Promise<ImageSize>((resolve, reject) => {
        Image.getSize(
          uri,
          (width, height) => {
            setImageSize({ width, height });
            resolve({ width, height });
          },
          () => reject(new Error('Failed to read image size')),
        );
      }),
    [],
  );

  useEffect(() => {
    if (!visible || !imageUri) {
      return;
    }

    setWorkingUri(imageUri);
    setImageSize(null);
    setCrop(null);
    setIsBusy(false);
    skipInitialCropResetRef.current = false;
    void loadImageSize(imageUri).catch(() => setImageSize(null));
  }, [visible, imageUri, loadImageSize]);

  useEffect(() => {
    if (!viewport || !imageSize) {
      return;
    }

    if (skipInitialCropResetRef.current) {
      skipInitialCropResetRef.current = false;
      return;
    }

    setCrop(buildInitialCrop(viewport, imageSize, aspect));
  }, [viewport, imageSize, aspect]);

  const imageBounds =
    viewport && imageSize ? getDisplayedImageRect(viewport, imageSize) : null;

  const handleViewportLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) {
      return;
    }
    setViewport({ width, height });
  };

  const updateCropFromHandle = useCallback(
    (edge: HandleEdge, translationX: number, translationY: number) => {
      if (!imageBounds || !cropOriginRef.current) {
        return;
      }
      setCrop(
        resizeCrop({
          edge,
          translationX,
          translationY,
          origin: cropOriginRef.current,
          bounds: imageBounds,
          aspect,
        }),
      );
    },
    [aspect, imageBounds],
  );

  const beginHandlePan = useCallback((current: CropBox) => {
    cropOriginRef.current = current;
  }, []);

  const updateCropFromMove = useCallback(
    (translationX: number, translationY: number) => {
      if (!imageBounds || !cropOriginRef.current) {
        return;
      }
      setCrop(
        moveCrop({
          translationX,
          translationY,
          origin: cropOriginRef.current,
          bounds: imageBounds,
        }),
      );
    },
    [imageBounds],
  );

  const displayedImageStyle = useMemo(() => {
    if (!imageBounds) {
      return null;
    }
    return {
      width: imageBounds.width,
      height: imageBounds.height,
    };
  }, [imageBounds]);

  const handleRotate = async () => {
    if (!workingUri || !viewport || !crop || isBusy) {
      return;
    }

    const previousCrop = crop;
    setIsBusy(true);
    try {
      skipInitialCropResetRef.current = true;
      const rotatedUri = await rotateImage(workingUri, 90);
      const nextSize = await loadImageSize(rotatedUri);
      setWorkingUri(rotatedUri);
      setCrop(preserveCropSize(previousCrop, viewport, nextSize));
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirm = async () => {
    if (!workingUri || !imageSize || !viewport || !crop || !imageBounds || isBusy) {
      return;
    }

    setIsBusy(true);
    try {
      const scale = imageBounds.width / imageSize.width;
      const originX = clampJs((crop.x - imageBounds.x) / scale, 0, imageSize.width);
      const originY = clampJs((crop.y - imageBounds.y) / scale, 0, imageSize.height);
      let width = crop.width / scale;
      let height = crop.height / scale;

      if (originX + width > imageSize.width) {
        width = Math.max(1, imageSize.width - originX);
      }
      if (originY + height > imageSize.height) {
        height = Math.max(1, imageSize.height - originY);
      }

      const finalUri = await cropImage(workingUri, {
        originX,
        originY,
        width,
        height,
      });
      onConfirm(finalUri);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onCancel}>
      <GestureHandlerRootView style={styles.flex}>
        <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
          <View
            style={[styles.stage, { marginTop: insets.top }]}
            onLayout={handleViewportLayout}>
            {workingUri && displayedImageStyle ? (
              <View style={styles.imageLayer} pointerEvents="none">
                <Image
                  source={{ uri: workingUri }}
                  style={displayedImageStyle}
                  resizeMode="stretch"
                />
              </View>
            ) : (
              <ActivityIndicator color={BrandColors.primary.light} />
            )}

            {crop && viewport ? (
              <CropOverlay
                crop={crop}
                viewport={viewport}
                aspectLocked={Boolean(aspect)}
                onBeginHandle={beginHandlePan}
                onHandlePan={updateCropFromHandle}
                onMovePan={updateCropFromMove}
              />
            ) : null}
          </View>

          <View style={styles.toolbar}>
            {isBusy ? (
              <ActivityIndicator color={BrandColors.primary.light} />
            ) : (
              <>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar"
                  hitSlop={Spacing.xxs}
                  onPress={onCancel}
                  style={styles.toolbarSide}>
                  <Body1 color={BrandColors.primary.light}>Cancelar</Body1>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Girar imagem"
                  hitSlop={Spacing.sm}
                  disabled={!workingUri}
                  onPress={() => {
                    void handleRotate();
                  }}
                  style={styles.toolbarCenter}>
                  <SymbolView
                    name={{ ios: 'crop.rotate', android: 'rotate_right', web: 'rotate_right' }}
                    size={28}
                    tintColor={BrandColors.primary.light}
                  />
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Salvar"
                  hitSlop={Spacing.xxs}
                  onPress={() => {
                    void handleConfirm();
                  }}
                  style={[styles.toolbarSide, styles.toolbarSideEnd]}>
                  <Body1 color={BrandColors.primary.light}>Salvar</Body1>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

type CropOverlayProps = {
  crop: CropBox;
  viewport: Viewport;
  aspectLocked: boolean;
  onBeginHandle: (crop: CropBox) => void;
  onHandlePan: (edge: HandleEdge, translationX: number, translationY: number) => void;
  onMovePan: (translationX: number, translationY: number) => void;
};

function CropOverlay({
  crop,
  viewport,
  aspectLocked,
  onBeginHandle,
  onHandlePan,
  onMovePan,
}: CropOverlayProps) {
  const edges = useMemo<HandleEdge[]>(
    () => (aspectLocked ? ['nw', 'ne', 'sw', 'se'] : ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w']),
    [aspectLocked],
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View pointerEvents="none" style={[styles.dim, { top: 0, left: 0, right: 0, height: crop.y }]} />
      <View
        pointerEvents="none"
        style={[
          styles.dim,
          {
            top: crop.y + crop.height,
            left: 0,
            right: 0,
            height: Math.max(0, viewport.height - crop.y - crop.height),
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[styles.dim, { top: crop.y, left: 0, width: crop.x, height: crop.height }]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.dim,
          {
            top: crop.y,
            left: crop.x + crop.width,
            width: Math.max(0, viewport.width - crop.x - crop.width),
            height: crop.height,
          },
        ]}
      />

      <View
        pointerEvents="box-none"
        style={[
          styles.cropWindow,
          {
            left: crop.x,
            top: crop.y,
            width: crop.width,
            height: crop.height,
          },
        ]}>
        <CropMoveSurface crop={crop} onBeginMove={onBeginHandle} onMovePan={onMovePan} />

        <View pointerEvents="none" style={[styles.gridLineV, { left: '33.333%' }]} />
        <View pointerEvents="none" style={[styles.gridLineV, { left: '66.666%' }]} />
        <View pointerEvents="none" style={[styles.gridLineH, { top: '33.333%' }]} />
        <View pointerEvents="none" style={[styles.gridLineH, { top: '66.666%' }]} />

        {edges.map((edge) => (
          <CropHandle
            key={edge}
            edge={edge}
            crop={crop}
            onBeginHandle={onBeginHandle}
            onHandlePan={onHandlePan}
          />
        ))}
      </View>
    </View>
  );
}

type CropMoveSurfaceProps = {
  crop: CropBox;
  onBeginMove: (crop: CropBox) => void;
  onMovePan: (translationX: number, translationY: number) => void;
};

function CropMoveSurface({ crop, onBeginMove, onMovePan }: CropMoveSurfaceProps) {
  const cropRef = useRef(crop);
  cropRef.current = crop;
  const beginRef = useRef(onBeginMove);
  beginRef.current = onBeginMove;
  const moveRef = useRef(onMovePan);
  moveRef.current = onMovePan;

  const onBeginJS = useCallback(() => {
    beginRef.current(cropRef.current);
  }, []);

  const onUpdateJS = useCallback((translationX: number, translationY: number) => {
    moveRef.current(translationX, translationY);
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          runOnJS(onBeginJS)();
        })
        .onUpdate((event) => {
          runOnJS(onUpdateJS)(event.translationX, event.translationY);
        }),
    [onBeginJS, onUpdateJS],
  );

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.cropMoveSurface} />
    </GestureDetector>
  );
}

type CropHandleProps = {
  edge: HandleEdge;
  crop: CropBox;
  onBeginHandle: (crop: CropBox) => void;
  onHandlePan: (edge: HandleEdge, translationX: number, translationY: number) => void;
};

function CropHandle({ edge, crop, onBeginHandle, onHandlePan }: CropHandleProps) {
  const cropRef = useRef(crop);
  cropRef.current = crop;
  const beginRef = useRef(onBeginHandle);
  beginRef.current = onBeginHandle;
  const panRef = useRef(onHandlePan);
  panRef.current = onHandlePan;

  const onBeginJS = useCallback(() => {
    beginRef.current(cropRef.current);
  }, []);

  const onUpdateJS = useCallback(
    (translationX: number, translationY: number) => {
      panRef.current(edge, translationX, translationY);
    },
    [edge],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          runOnJS(onBeginJS)();
        })
        .onUpdate((event) => {
          runOnJS(onUpdateJS)(event.translationX, event.translationY);
        }),
    [onBeginJS, onUpdateJS],
  );

  const isCorner = edge.length === 2;

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.handleHit, handleHitStyle(edge)]}>
        {isCorner ? (
          <>
            <View style={[styles.cornerArm, cornerArmHStyle(edge)]} />
            <View style={[styles.cornerArm, cornerArmVStyle(edge)]} />
          </>
        ) : (
          <View style={edgeBarStyle(edge)} />
        )}
      </View>
    </GestureDetector>
  );
}

function handleHitStyle(edge: HandleEdge) {
  const base = { position: 'absolute' as const, width: HANDLE_HIT, height: HANDLE_HIT };
  switch (edge) {
    case 'nw':
      return { ...base, top: -HANDLE_HIT / 2, left: -HANDLE_HIT / 2 };
    case 'ne':
      return { ...base, top: -HANDLE_HIT / 2, right: -HANDLE_HIT / 2 };
    case 'sw':
      return { ...base, bottom: -HANDLE_HIT / 2, left: -HANDLE_HIT / 2 };
    case 'se':
      return { ...base, bottom: -HANDLE_HIT / 2, right: -HANDLE_HIT / 2 };
    case 'n':
      return {
        ...base,
        top: -HANDLE_HIT / 2,
        left: '50%' as const,
        marginLeft: -HANDLE_HIT / 2,
      };
    case 's':
      return {
        ...base,
        bottom: -HANDLE_HIT / 2,
        left: '50%' as const,
        marginLeft: -HANDLE_HIT / 2,
      };
    case 'w':
      return {
        ...base,
        left: -HANDLE_HIT / 2,
        top: '50%' as const,
        marginTop: -HANDLE_HIT / 2,
      };
    case 'e':
      return {
        ...base,
        right: -HANDLE_HIT / 2,
        top: '50%' as const,
        marginTop: -HANDLE_HIT / 2,
      };
  }
}

function cornerArmHStyle(edge: HandleEdge) {
  const base = {
    position: 'absolute' as const,
    width: HANDLE_ARM,
    height: HANDLE_THICKNESS,
    backgroundColor: BrandColors.neutral.white,
  };
  const mid = HANDLE_HIT / 2 - HANDLE_THICKNESS / 2;
  if (edge === 'nw') return { ...base, top: mid, left: mid };
  if (edge === 'ne') return { ...base, top: mid, right: mid };
  if (edge === 'sw') return { ...base, bottom: mid, left: mid };
  return { ...base, bottom: mid, right: mid };
}

function cornerArmVStyle(edge: HandleEdge) {
  const base = {
    position: 'absolute' as const,
    width: HANDLE_THICKNESS,
    height: HANDLE_ARM,
    backgroundColor: BrandColors.neutral.white,
  };
  const mid = HANDLE_HIT / 2 - HANDLE_THICKNESS / 2;
  if (edge === 'nw') return { ...base, top: mid, left: mid };
  if (edge === 'ne') return { ...base, top: mid, right: mid };
  if (edge === 'sw') return { ...base, bottom: mid, left: mid };
  return { ...base, bottom: mid, right: mid };
}

function edgeBarStyle(edge: HandleEdge) {
  const horizontal = edge === 'n' || edge === 's';
  return {
    position: 'absolute' as const,
    backgroundColor: BrandColors.neutral.white,
    width: horizontal ? HANDLE_ARM : HANDLE_THICKNESS,
    height: horizontal ? HANDLE_THICKNESS : HANDLE_ARM,
    top: HANDLE_HIT / 2 - (horizontal ? HANDLE_THICKNESS : HANDLE_ARM) / 2,
    left: HANDLE_HIT / 2 - (horizontal ? HANDLE_ARM : HANDLE_THICKNESS) / 2,
  };
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: BrandColors.neutral.black,
  },
  stage: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  cropWindow: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  cropMoveSurface: {
    ...StyleSheet.absoluteFill,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  handleHit: {
    zIndex: 2,
  },
  cornerArm: {},
  toolbar: {
    minHeight: 56,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarSide: {
    minWidth: 88,
  },
  toolbarSideEnd: {
    alignItems: 'flex-end',
  },
  toolbarCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxs,
  },
});
