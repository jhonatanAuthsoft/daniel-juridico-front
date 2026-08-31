import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';

import { XIcon } from '@/assets/icon/x';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption, InputLabel } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { pickImageFromGallery } from '@/utils/pick-image-from-gallery';
import { isDirectImageUri } from '@/utils/is-direct-image-uri';

import { ImageEditModal } from './image-edit-modal.component';

type ImageFieldBaseProps = {
  label: string;
  emptyTitle?: string;
  emptyCaption?: string;
  /** Crop aspect ratio. Defaults to 1×1. */
  aspect?: [number, number];
  /** Max images when `multiple` is true. Defaults to unlimited. */
  maxCount?: number;
  isUploading?: boolean;
  errorMessage?: string;
};

export type ImageFieldSingleProps = ImageFieldBaseProps & {
  multiple?: false;
  value: string;
  onChange: (uri: string) => void;
};

export type ImageFieldMultiProps = ImageFieldBaseProps & {
  multiple: true;
  value: string[];
  onChange: (uris: string[]) => void;
  /** Signed/local URLs aligned with `value`, used only for display. */
  displayUris?: string[];
};

export type ImageFieldProps = ImageFieldSingleProps | ImageFieldMultiProps;

function sourceUriAt(
  uris: string[],
  index: number,
  displayUris: string[] | undefined,
): string {
  const candidate = displayUris ? (displayUris[index] ?? '') : (uris[index] ?? '');
  return isDirectImageUri(candidate) ? candidate : '';
}

function normalizeUris(props: ImageFieldProps): string[] {
  if (props.multiple) {
    return props.value.filter(Boolean);
  }
  return props.value ? [props.value] : [];
}

export function ImageField(props: ImageFieldProps) {
  const {
    label,
    emptyTitle = 'Anexe as fotos de frente e verso',
    emptyCaption = 'Formato: .jpeg, .png',
    aspect = [1, 1],
    maxCount,
    isUploading = false,
    errorMessage,
  } = props;

  const uris = normalizeUris(props);
  const isMultiple = Boolean(props.multiple);
  const displayUris = props.multiple ? props.displayUris : undefined;
  const hasError = Boolean(errorMessage);
  const canAddMore =
    isMultiple && (maxCount == null || uris.length < maxCount) && !isUploading;
  const aspectRatio = aspect[0] / aspect[1];

  const [previewIndex, setPreviewIndex] = useState(0);
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const safePreviewIndex = uris.length === 0 ? 0 : Math.min(previewIndex, uris.length - 1);
  const previewUri = sourceUriAt(uris, safePreviewIndex, displayUris);

  const applyFinalUri = (finalUri: string) => {
    if (props.multiple) {
      props.onChange([...props.value.filter(Boolean), finalUri]);
      setPreviewIndex(props.value.filter(Boolean).length);
    } else {
      props.onChange(finalUri);
      setPreviewIndex(0);
    }
  };

  const removeAt = (index: number) => {
    if (isUploading) {
      return;
    }
    if (props.multiple) {
      const next = props.value.filter((_, i) => i !== index);
      props.onChange(next);
      setPreviewIndex((current) => {
        if (next.length === 0) {
          return 0;
        }
        if (current >= next.length) {
          return next.length - 1;
        }
        if (current > index) {
          return current - 1;
        }
        return current;
      });
      return;
    }

    props.onChange('');
    setPreviewIndex(0);
  };

  const startPick = async () => {
    if (isUploading) {
      return;
    }
    const uri = await pickImageFromGallery();

    if (!uri) {
      return;
    }

    setPendingUri(uri);
    setEditVisible(true);
  };

  const handleEditCancel = () => {
    setEditVisible(false);
    setPendingUri(null);
  };

  const handleEditConfirm = (uri: string) => {
    setEditVisible(false);
    setPendingUri(null);
    applyFinalUri(uri);
  };

  if (uris.length === 0) {
    return (
      <View style={styles.block}>
        <InputLabel color={BrandColors.neutral.white}>{label}</InputLabel>
        <Separator size="xxs" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          disabled={isUploading}
          style={[styles.placeholder, { aspectRatio }, hasError && styles.shellError]}
          onPress={() => {
            void startPick();
          }}>
          {isUploading ? (
            <ActivityIndicator color={BrandColors.primary.light} />
          ) : (
            <>
              <SymbolView
                name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
                size={28}
                tintColor={BrandColors.neutral.xlight}
              />
              <Separator size="xxs" />
              <Body1 color={BrandColors.neutral.white}>{emptyTitle}</Body1>
              <Separator size="xxxs" />
              <InputCaption color={BrandColors.neutral.light}>{emptyCaption}</InputCaption>
            </>
          )}
        </Pressable>
        {hasError ? (
          <>
            <Separator size="xxxs" />
            <View style={styles.errorRow}>
              <XIcon color={BrandColors.feedback.error.medium} />
              <InputCaption color={BrandColors.feedback.error.light}>
                {errorMessage}
              </InputCaption>
            </View>
          </>
        ) : null}

        <ImageEditModal
          visible={editVisible}
          imageUri={pendingUri}
          aspect={aspect}
          onCancel={handleEditCancel}
          onConfirm={handleEditConfirm}
        />
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <InputLabel color={BrandColors.neutral.white}>{label}</InputLabel>
      <Separator size="xxs" />

      <View style={[styles.filledShell, hasError && styles.shellError]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Pré-visualização de ${label}`}
          disabled={isUploading}
          onPress={() => {
            if (!isMultiple) {
              void startPick();
            }
          }}>
          <View style={[styles.previewArea, { aspectRatio }]}>
            {previewUri ? (
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : null}
            {isUploading ? (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color={BrandColors.neutral.white} />
              </View>
            ) : null}
          </View>
        </Pressable>

        <View style={styles.selectorRow}>
          {uris.map((uri, index) => {
            const isSelected = index === safePreviewIndex;
            const thumbUri = sourceUriAt(uris, index, displayUris);
            return (
              <Pressable
                key={uri}
                accessibilityRole="button"
                accessibilityLabel={
                  isMultiple
                    ? isSelected
                      ? `Remover imagem ${index + 1}`
                      : `Selecionar imagem ${index + 1}`
                    : 'Remover imagem'
                }
                accessibilityState={{ selected: isSelected }}
                disabled={isUploading}
                onPress={() => {
                  if (isMultiple && !isSelected) {
                    setPreviewIndex(index);
                    return;
                  }
                  removeAt(index);
                }}
                style={[styles.thumbAction, isSelected && styles.thumbSelected]}>
                {thumbUri ? (
                  <Image
                    source={{ uri: thumbUri }}
                    style={styles.thumbImage}
                    resizeMode="cover"
                  />
                ) : null}
                {isSelected ? (
                  <View style={styles.thumbOverlay}>
                    <SymbolView
                      name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                      size={16}
                      tintColor={BrandColors.neutral.white}
                    />
                  </View>
                ) : null}
              </Pressable>
            );
          })}

          {canAddMore ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Adicionar imagem"
              onPress={() => {
                void startPick();
              }}
              style={styles.addThumb}>
              <SymbolView
                name={{ ios: 'plus', android: 'add', web: 'add' }}
                size={20}
                tintColor={BrandColors.neutral.light}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {hasError ? (
        <>
          <Separator size="xxxs" />
          <View style={styles.errorRow}>
            <XIcon color={BrandColors.feedback.error.medium} />
            <InputCaption color={BrandColors.feedback.error.light}>
              {errorMessage}
            </InputCaption>
          </View>
        </>
      ) : null}

      <ImageEditModal
        visible={editVisible}
        imageUri={pendingUri}
        aspect={aspect}
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
  },
  placeholder: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  shellError: {
    borderWidth: 1.8,
    borderColor: BrandColors.feedback.error.medium,
  },
  filledShell: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.black,
    overflow: 'hidden',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  previewArea: {
    width: '100%',
    borderRadius: Radius.medium,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.black,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
    alignItems: 'center',
  },
  thumbAction: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.xdark,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
  },
  thumbSelected: {
    borderColor: BrandColors.primary.light,
    borderWidth: 2,
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addThumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.neutral.xdark,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
});
