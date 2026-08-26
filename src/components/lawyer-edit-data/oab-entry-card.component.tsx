import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { FieldPath } from 'react-hook-form';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { EditAltIcon } from '@/assets/icon/edit-alt';
import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { InputImageField, InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, InputLabel } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { UF_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import {
  formatOabSummary,
  OAB_PHOTO_ASPECT,
  OAB_PHOTO_MAX,
  type DocumentationForm,
} from './lawyer-edit-profile';

type OabEntryCardProps = {
  title: string;
  number: string;
  uf: string;
  photoUris: string[];
  isExpanded: boolean;
  isEditing: boolean;
  canDelete?: boolean;
  numberName: FieldPath<DocumentationForm>;
  ufName: FieldPath<DocumentationForm>;
  issueDateName: FieldPath<DocumentationForm>;
  photosName: FieldPath<DocumentationForm>;
  keysName: FieldPath<DocumentationForm>;
  onToggle: () => void;
  onEdit: () => void;
  onCloseEdit: () => void;
  onDelete?: () => void;
};

export function OabEntryCard({
  title,
  number,
  uf,
  photoUris,
  isExpanded,
  isEditing,
  canDelete = false,
  numberName,
  ufName,
  issueDateName,
  photosName,
  keysName,
  onToggle,
  onEdit,
  onCloseEdit,
  onDelete,
}: OabEntryCardProps) {
  const summary = formatOabSummary(number, uf) || '—';

  if (isEditing) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Body1 bold color={BrandColors.neutral.white} style={styles.title}>
            {title}
          </Body1>
          <Pressable
            accessibilityLabel={`Fechar ${title}`}
            accessibilityRole="button"
            hitSlop={Spacing.xxs}
            onPress={onCloseEdit}>
            <XIcon color={BrandColors.neutral.white} width={24} height={24} />
          </Pressable>
        </View>

        <InputTextField
          name={numberName}
          label="Número da OAB"
          placeholder="Digite o número da OAB"
          autoCapitalize="characters"
          format={InputMasks.alphanumericMax(15)}
          validate={FieldValidators.alphanumericMin(3, 'Número da OAB inválido')}
          maxLength={15}
        />
        <InputSelectField
          name={ufName}
          label="UF da OAB Suplementar"
          placeholder="Selecione o estado"
          options={UF_OPTIONS}
          required
        />
        <InputTextField
          name={issueDateName}
          label="Data de expedição"
          placeholder="00/00/0000"
          keyboardType="number-pad"
          format={InputMasks.dateBr}
          validate={FieldValidators.dateBrOabIssue}
          maxLength={10}
        />
        <InputImageField
          multiple
          name={photosName}
          keyName={keysName}
          uploadFinalidade="OAB"
          label="Foto da frente e verso da carteira"
          emptyTitle="Anexe as fotos de frente e verso"
          emptyCaption="Formato: .jpeg, .png"
          aspect={OAB_PHOTO_ASPECT}
          maxCount={OAB_PHOTO_MAX}
          minCount={2}
        />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={onToggle}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}>
        <View style={styles.headerCopy}>
          <Body1 bold color={BrandColors.neutral.white}>
            {title}
          </Body1>
          {isExpanded ? null : (
            <Body1 color={BrandColors.primary.light}>{summary}</Body1>
          )}
        </View>
        <CaretLeftIcon
          color={BrandColors.neutral.white}
          direction={isExpanded ? 'up' : 'down'}
          height={22}
          width={22}
        />
      </Pressable>

      {isExpanded ? (
        <View style={styles.body}>
          <View style={styles.oabMeta}>
            <View style={styles.oabMetaLabelRow}>
              <SymbolView
                name={{ ios: 'doc.text', android: 'description', web: 'description' }}
                size={16}
                tintColor={BrandColors.neutral.white}
              />
              <InputLabel color={BrandColors.neutral.white}>Número da OAB E UF</InputLabel>
            </View>
            <Body1 color={BrandColors.primary.light}>{summary}</Body1>
          </View>

          <View>
            <InputLabel color={BrandColors.neutral.white}>
              Foto da Carteira (Frente e verso)
            </InputLabel>
            <Separator size="xxs" />
            <View style={styles.photoRow}>
              <WalletPhotoPreview label="Frente" uri={photoUris[0] ?? ''} />
              <WalletPhotoPreview label="Verso" uri={photoUris[1] ?? ''} />
            </View>
          </View>

          <View style={styles.actions}>
            {canDelete && onDelete ? (
              <Button onPress={onDelete} variant="link">
                Apagar
              </Button>
            ) : (
              <View />
            )}
            <Button
              iconLeft={<EditAltIcon color={BrandColors.neutral.xdark} size={18} />}
              onPress={onEdit}
              style={styles.editButton}
              variant="primary">
              Editar
            </Button>
          </View>
        </View>
      ) : null}
    </View>
  );
}

type WalletPhotoPreviewProps = {
  uri: string;
  label: string;
};

function WalletPhotoPreview({ uri, label }: WalletPhotoPreviewProps) {
  return (
    <View accessibilityLabel={`Foto ${label} da carteira`} style={styles.photoPreview}>
      {uri ? (
        <Image source={{ uri }} style={styles.photoImage} resizeMode="contain" />
      ) : (
        <Body2 color={BrandColors.neutral.medium}>Sem foto</Body2>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.xdark,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerCopy: {
    flex: 1,
    gap: Spacing.xxxs,
  },
  title: {
    flex: 1,
  },
  body: {
    gap: Spacing.sm,
  },
  oabMeta: {
    gap: Spacing.xxxs,
  },
  oabMetaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  photoRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  photoPreview: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.accessory.darkBlue,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  editButton: {
    alignSelf: 'flex-end',
    width: 148,
  },
  pressed: {
    opacity: 0.75,
  },
});
