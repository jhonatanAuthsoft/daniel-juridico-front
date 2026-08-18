import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { SearchIcon } from '@/assets/icon/search';
import { XIcon } from '@/assets/icon/x';
import { GlassBackground } from '@/atomic/glass';
import { ModalScrim, useExclusiveSelectOpen } from '@/atomic/modal';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, InputCaption, InputLabel } from '@/atomic/typography';
import type { SelectOption } from '@/constants/select-options';
import {
  BrandColors,
  BrandGradients,
  FontSize,
  InterFontFamily,
  Radius,
  Spacing,
} from '@/constants/theme';

import {
  SelectOptionsList,
  useDeferredFilteredOptions,
} from './select-options-list.component';

const OPTIONS_RADIUS = 16;
const VISIBLE_TAG_COUNT = 2;

export type InputMultiSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: readonly SelectOption[];
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  optionsLoading?: boolean;
};

export function overflowSelectionLabel(
  hiddenCount: number,
  extraSingular = 'opção',
  extraPlural = 'opções',
): string {
  if (hiddenCount <= 0) {
    return '';
  }
  if (hiddenCount === 1) {
    return `e mais 1 ${extraSingular}`;
  }
  return `e mais ${hiddenCount} ${extraPlural}`;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function ignoreOptionPress(_value: string) {}

export function InputMultiSelectField<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  label,
  placeholder = 'Selecione',
  options,
  disabled = false,
  required = false,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  optionsLoading = false,
}: InputMultiSelectFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const { isOpen: open, requestOpen, requestClose } = useExclusiveSelectOpen();
  const [searchQuery, setSearchQuery] = useState('');

  const close = () => {
    requestClose();
    setSearchQuery('');
  };

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  const labelByValue = useMemo(() => {
    const map = new Map<string, string>();
    for (const option of options) {
      map.set(option.value, option.label);
    }
    return map;
  }, [options]);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          if (!required) {
            return true;
          }
          return asStringArray(value).length > 0
            ? true
            : 'Campo obrigatório';
        },
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const selectedValues = asStringArray(value);
        const hasError = Boolean(error?.message);
        const summary =
          selectedValues.length === 0
            ? placeholder
            : selectedValues.length === 1
              ? (labelByValue.get(selectedValues[0]) ?? selectedValues[0])
              : `${selectedValues.length} cidades selecionadas`;

        const setSelectedValues = (next: string[]) => {
          onChange(next as PathValue<TFieldValues, FieldPath<TFieldValues>>);
        };

        const removeValue = (optionValue: string) => {
          setSelectedValues(selectedValues.filter((item) => item !== optionValue));
        };

        const visibleTags = selectedValues.slice(0, VISIBLE_TAG_COUNT);
        const hiddenCount = selectedValues.length - visibleTags.length;
        const overflowLabel = overflowSelectionLabel(hiddenCount);

        return (
          <View style={styles.container}>
            {label ? (
              <>
                <InputLabel color={BrandColors.neutral.white}>{label}</InputLabel>
                <Separator size="xxs" />
              </>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled, expanded: open }}
              disabled={disabled}
              onBlur={onBlur}
              onPress={() => {
                if (disabled) {
                  return;
                }
                requestOpen();
              }}
              style={[
                styles.fieldShell,
                hasError && styles.fieldShellError,
                disabled && styles.fieldShellDisabled,
              ]}>
              <GlassBackground blurPx={25} />
              <View style={styles.fieldContent}>
                <Body1
                  color={
                    selectedValues.length > 0
                      ? BrandColors.neutral.white
                      : BrandColors.neutral.light
                  }
                  style={styles.valueText}>
                  {summary}
                </Body1>
                <View style={styles.iconRight}>
                  <CaretLeftIcon
                    color={BrandColors.neutral.light}
                    direction="down"
                    height={20}
                    width={20}
                  />
                </View>
              </View>
            </Pressable>

            {selectedValues.length > 0 ? (
              <>
                <Separator size="xxs" />
                <View style={styles.tagsRow}>
                  {visibleTags.map((selectedValue) => (
                    <Pressable
                      key={selectedValue}
                      accessibilityRole="button"
                      accessibilityLabel={`Remover ${labelByValue.get(selectedValue) ?? selectedValue}`}
                      disabled={disabled}
                      onPress={() => removeValue(selectedValue)}
                      style={styles.tag}>
                      <Body2 color={BrandColors.neutral.white} style={styles.tagLabel}>
                        {labelByValue.get(selectedValue) ?? selectedValue}
                      </Body2>
                      <XIcon color={BrandColors.neutral.white} width={14} height={14} />
                    </Pressable>
                  ))}
                  {overflowLabel ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={overflowLabel}
                      disabled={disabled}
                      onPress={() => {
                        if (disabled) {
                          return;
                        }
                        requestOpen();
                      }}
                      style={styles.overflowTag}>
                      <Body2 color={BrandColors.primary.light}>{overflowLabel}</Body2>
                    </Pressable>
                  ) : null}
                </View>
              </>
            ) : null}

            {hasError ? (
              <>
                <Separator size="xxxs" />
                <View style={styles.errorRow}>
                  <XIcon color={BrandColors.feedback.error.medium} />
                  <InputCaption color={BrandColors.feedback.error.light}>
                    {error?.message}
                  </InputCaption>
                </View>
              </>
            ) : null}

            <MultiSelectOptionsModal
              label={label ?? placeholder}
              onClose={close}
              onCommit={setSelectedValues}
              open={open}
              options={options}
              optionsLoading={optionsLoading}
              searchPlaceholder={searchPlaceholder}
              searchQuery={searchQuery}
              searchable={searchable}
              selectedValues={selectedValues}
              setSearchQuery={setSearchQuery}
            />
          </View>
        );
      }}
    />
  );
}

type MultiSelectOptionsModalProps = {
  open: boolean;
  label: string;
  options: readonly SelectOption[];
  selectedValues: string[];
  searchable: boolean;
  optionsLoading: boolean;
  searchQuery: string;
  searchPlaceholder: string;
  setSearchQuery: (value: string) => void;
  onCommit: (values: string[]) => void;
  onClose: () => void;
};

function MultiSelectOptionsModal({ open, ...props }: MultiSelectOptionsModalProps) {
  if (!open) {
    return null;
  }

  return <OpenMultiSelectSheet {...props} />;
}

function OpenMultiSelectSheet({
  label,
  options,
  selectedValues,
  searchable,
  optionsLoading,
  searchQuery,
  searchPlaceholder,
  setSearchQuery,
  onCommit,
  onClose,
}: Omit<MultiSelectOptionsModalProps, 'open'>) {
  const filteredOptions = useDeferredFilteredOptions(options, searchQuery);
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const selectedDraftRef = useRef(new Set(selectedValues));

  const finish = () => {
    const selected = selectedDraftRef.current;
    onClose();
    setTimeout(() => {
      onCommit([...selected]);
    }, 0);
  };

  return (
    <Modal
      animationType="fade"
      navigationBarTranslucent
      onRequestClose={finish}
      statusBarTranslucent
      transparent
      visible>
      <ModalScrim
        accessibilityLabel="Fechar opções"
        align="bottom"
        onDismiss={finish}>
        <View style={styles.optionsPanel}>
          <GlassBackground blurPx={25} gradient={BrandGradients.gradient} />

          <View style={styles.optionsContent}>
            <View style={styles.sheetHeader}>
              <Body1 bold color={BrandColors.neutral.white} style={styles.headerTitle}>
                {label}
              </Body1>
              <Pressable
                accessibilityLabel="Fechar"
                accessibilityRole="button"
                hitSlop={Spacing.xxs}
                onPress={finish}>
                <XIcon color={BrandColors.neutral.white} />
              </Pressable>
            </View>

            {searchable ? (
              <>
                <View style={styles.searchShell}>
                  <GlassBackground blurPx={25} />
                  <View style={styles.searchContent}>
                    <SearchIcon
                      color={BrandColors.neutral.light}
                      height={18}
                      width={18}
                    />
                    <TextInput
                      accessibilityLabel={searchPlaceholder}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={setSearchQuery}
                      placeholder={searchPlaceholder}
                      placeholderTextColor={BrandColors.neutral.light}
                      underlineColorAndroid="transparent"
                      style={styles.searchInput}
                      value={searchQuery}
                    />
                  </View>
                </View>
                <Separator size="sm" />
              </>
            ) : null}

            <SelectOptionsList
              accessibilityRole="checkbox"
              onPressOption={ignoreOptionPress}
              options={filteredOptions}
              optionsLoading={optionsLoading}
              searchQuery={searchQuery}
              selectedDraftRef={selectedDraftRef}
              selectedValues={selectedSet}
            />
          </View>
        </View>
      </ModalScrim>
    </Modal>
  );
}

const glassShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: {
    // elevation + non-solid fill paints the gray plate on Android.
    elevation: 0,
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
  },
  fieldShell: {
    alignSelf: 'stretch',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  fieldShellError: {
    borderWidth: 1.8,
    borderColor: BrandColors.feedback.error.medium,
  },
  fieldShellDisabled: {
    opacity: 0.5,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  valueText: {
    flex: 1,
  },
  iconRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
    paddingVertical: Spacing.xxxs,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.xxs,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkBlue,
  },
  tagLabel: {
    maxWidth: 180,
  },
  overflowTag: {
    paddingVertical: Spacing.xxxs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  optionsPanel: {
    overflow: 'hidden',
    maxHeight: '100%',
    borderRadius: OPTIONS_RADIUS,
    borderWidth: 1,
    borderColor: BrandColors.accessory.darkBlue,
    // Solid base so glass gradient stays readable (esp. Android without BlurView).
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  optionsContent: {
    zIndex: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    maxHeight: '100%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    flex: 1,
  },
  searchShell: {
    overflow: 'hidden',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  searchContent: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    minHeight: 48,
    paddingHorizontal: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.xs,
    color: BrandColors.neutral.white,
    fontFamily: InterFontFamily[500],
    fontSize: FontSize.xSmall,
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0)' : 'transparent',
  },
});
