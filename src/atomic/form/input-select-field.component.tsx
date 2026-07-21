import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  FlatList,
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
} from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckboxEmptyIcon } from '@/assets/icon/checkbox-empty';
import { CheckedCheckboxIcon } from '@/assets/icon/checked-checkbox';
import { SearchIcon } from '@/assets/icon/search';
import { XIcon } from '@/assets/icon/x';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption, InputLabel } from '@/atomic/typography';
import type { SelectOption } from '@/constants/select-options';
import {
  BrandColors,
  BrandGradients,
  FontSize,
  InterFontFamily,
  Radius,
  Spacing,
} from '@/constants/theme';

/** Figma Values-Medium — not in Radius tokens yet. */
const OPTIONS_RADIUS = 16;

export type InputSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: readonly SelectOption[];
  disabled?: boolean;
  /** Shows a search field above the options. Defaults to true. */
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function InputSelectField<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  label,
  placeholder = 'Selecione',
  options,
  disabled = false,
  searchable = true,
  searchPlaceholder = 'Buscar...',
}: InputSelectFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const close = () => {
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const hasError = Boolean(error?.message);
        const selected = options.find((option) => option.value === value);
        const displayValue =
          selected?.label ?? (typeof value === 'string' ? value : '');

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
                setOpen(true);
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
                    displayValue
                      ? BrandColors.neutral.white
                      : BrandColors.neutral.light
                  }
                  style={styles.valueText}>
                  {displayValue || placeholder}
                </Body1>
                <View style={styles.iconRight}>
                  <SymbolView
                    name={{
                      ios: 'chevron.down',
                      android: 'arrow_drop_down',
                      web: 'keyboard_arrow_down',
                    }}
                    size={20}
                    tintColor={BrandColors.neutral.light}
                  />
                </View>
              </View>
            </Pressable>

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

            <SelectOptionsModal
              label={label ?? placeholder}
              onClose={close}
              onSelect={(optionValue) => {
                onChange(optionValue);
                close();
              }}
              open={open}
              options={options}
              searchPlaceholder={searchPlaceholder}
              searchQuery={searchQuery}
              searchable={searchable}
              selectedValue={typeof value === 'string' ? value : undefined}
              setSearchQuery={setSearchQuery}
            />
          </View>
        );
      }}
    />
  );
}

type SelectOptionsModalProps = {
  open: boolean;
  label: string;
  options: readonly SelectOption[];
  selectedValue?: string;
  searchable: boolean;
  searchQuery: string;
  searchPlaceholder: string;
  setSearchQuery: (value: string) => void;
  onSelect: (value: string) => void;
  onClose: () => void;
};

function SelectOptionsModal({
  open,
  label,
  options,
  selectedValue,
  searchable,
  searchQuery,
  searchPlaceholder,
  setSearchQuery,
  onSelect,
  onClose,
}: SelectOptionsModalProps) {
  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return [...options];
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={open}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Fechar opções"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.modalBackdrop}
        />

        <SafeAreaView edges={['bottom']} style={styles.modalSafe}>
          <View style={styles.optionsPanel}>
            <GlassBackground
              blurPx={25}
              gradient={BrandGradients.gradient}
            />

            <View style={styles.optionsContent}>
              <View style={styles.sheetHeader}>
                <Body1 bold color={BrandColors.neutral.white} style={styles.headerTitle}>
                  {label}
                </Body1>
                <Pressable
                  accessibilityLabel="Fechar"
                  accessibilityRole="button"
                  hitSlop={Spacing.xxs}
                  onPress={onClose}>
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
                        style={styles.searchInput}
                        value={searchQuery}
                      />
                    </View>
                  </View>
                  <Separator size="sm" />
                </>
              ) : null}

              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                keyboardShouldPersistTaps="handled"
                style={styles.list}
                ListEmptyComponent={
                  <InputCaption color={BrandColors.neutral.light}>
                    {searchQuery.trim()
                      ? 'Nenhuma opção encontrada.'
                      : 'Nenhuma opção disponível.'}
                  </InputCaption>
                }
                ItemSeparatorComponent={() => <View style={styles.optionDivider} />}
                renderItem={({ item }) => {
                  const isSelected = item.value === selectedValue;

                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => onSelect(item.value)}
                      style={({ pressed }) => [
                        styles.optionRow,
                        pressed && styles.optionRowPressed,
                      ]}>
                      {isSelected ? (
                        <CheckedCheckboxIcon
                          color={BrandColors.primary.light}
                          height={24}
                          width={24}
                        />
                      ) : (
                        <CheckboxEmptyIcon
                          color={BrandColors.neutral.xlight}
                          height={24}
                          width={24}
                        />
                      )}
                      <Body1
                        color={BrandColors.neutral.white}
                        style={styles.optionLabel}>
                        {item.label}
                      </Body1>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
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
    elevation: 4,
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalSafe: {
    maxHeight: '75%',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  optionsPanel: {
    overflow: 'hidden',
    maxHeight: '100%',
    borderRadius: OPTIONS_RADIUS,
    borderWidth: 1,
    borderColor: BrandColors.accessory.darkBlue,
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
  },
  list: {
    flexGrow: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  optionRowPressed: {
    opacity: 0.85,
  },
  optionLabel: {
    flex: 1,
  },
  optionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(230, 232, 227, 0.24)',
  },
});
