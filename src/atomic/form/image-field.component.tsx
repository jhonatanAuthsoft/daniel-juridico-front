import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';

import { Separator } from '@/atomic/separator';
import { Body1, InputCaption, InputLabel } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { pickImageFromGallery } from '@/utils/pick-image-from-gallery';

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
};

export type ImageFieldProps = ImageFieldSingleProps | ImageFieldMultiProps;

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
  const canAddMore =
    isMultiple && (maxCount == null || uris.length < maxCount) && !isUploading;

  const [previewIndex, setPreviewIndex] = useState(0);
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const safePreviewIndex = uris.length === 0 ? 0 : Math.min(previewIndex, uris.length - 1);
  const previewUri = uris[safePreviewIndex] ?? '';

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
          style={styles.placeholder}
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
        {errorMessage ? (
          <>
            <Separator size="xxxs" />
            <InputCaption color={BrandColors.feedback.error.light}>{errorMessage}</InputCaption>
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Pré-visualização de ${label}`}
        disabled={isUploading}
        onPress={() => {
          if (!isMultiple) {
            void startPick();
          }
        }}>
        <View>
          <Image source={{ uri: previewUri }} style={styles.previewShell} resizeMode="cover" />
          {isUploading ? (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator color={BrandColors.neutral.white} />
            </View>
          ) : null}
        </View>
      </Pressable>
      <Separator size="xxs" />
      <View style={styles.previewActions}>
        {uris.map((uri, index) => (
          <Pressable
            key={uri}
            accessibilityRole="button"
            accessibilityLabel={
              isMultiple ? `Remover imagem ${index + 1}` : 'Remover imagem'
            }
            disabled={isUploading}
            onPress={() => removeAt(index)}
            style={[
              styles.thumbAction,
              isMultiple && index === safePreviewIndex && styles.thumbSelected,
            ]}>
            <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
            <View style={styles.thumbOverlay}>
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                size={16}
                tintColor={BrandColors.neutral.white}
              />
            </View>
          </Pressable>
        ))}

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
      {errorMessage ? (
        <>
          <Separator size="xxxs" />
          <InputCaption color={BrandColors.feedback.error.light}>{errorMessage}</InputCaption>
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
    minHeight: 140,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  previewShell: {
    height: 160,
    width: '100%',
    borderRadius: Radius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.dark,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: Radius.large,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  thumbAction: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.dark,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
  },
  thumbImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  thumbSelected: {
    borderColor: BrandColors.primary.light,
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
  },
});
