import { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckIcon } from '@/assets/icon/check';
import { XIcon } from '@/assets/icon/x';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption, InputLabel } from '@/atomic/typography';
import type { SelectOption } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export type InputSelectFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: readonly SelectOption[];
  disabled?: boolean;
};

export function InputSelectField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = 'Selecione',
  options,
  disabled = false,
}: InputSelectFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const hasError = Boolean(error?.message);
        const selected = options.find((option) => option.value === value);
        const displayValue = selected?.label ?? (typeof value === 'string' ? value : '');

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
              onPress={() => {
                if (disabled) {
                  return;
                }
                setOpen(true);
              }}
              onBlur={onBlur}
              style={[
                styles.fieldShell,
                hasError && styles.fieldShellError,
                disabled && styles.fieldShellDisabled,
              ]}>
              <GlassBackground blurPx={25} />
              <View style={styles.fieldContent}>
                <Body1
                  color={
                    displayValue ? BrandColors.neutral.white : BrandColors.neutral.light
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

            <Modal
              visible={open}
              animationType="slide"
              transparent
              onRequestClose={() => setOpen(false)}>
              <View style={styles.modalRoot}>
                <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)} />
                <SafeAreaView edges={['bottom']} style={styles.sheet}>
                  <View style={styles.sheetHeader}>
                    <Body1 bold color={BrandColors.neutral.white}>
                      {label ?? placeholder}
                    </Body1>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Fechar"
                      hitSlop={Spacing.xxs}
                      onPress={() => setOpen(false)}>
                      <XIcon color={BrandColors.neutral.white} />
                    </Pressable>
                  </View>

                  <FlatList
                    data={[...options]}
                    keyExtractor={(item) => item.value}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                      <InputCaption color={BrandColors.neutral.light}>
                        Nenhuma opção disponível.
                      </InputCaption>
                    }
                    renderItem={({ item }) => {
                      const isSelected = item.value === value;
                      return (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{ selected: isSelected }}
                          onPress={() => {
                            onChange(item.value);
                            setOpen(false);
                          }}
                          style={({ pressed }) => [
                            styles.optionRow,
                            isSelected && styles.optionRowSelected,
                            pressed && styles.optionRowPressed,
                          ]}>
                          <Body1
                            bold={isSelected}
                            color={BrandColors.neutral.white}
                            style={styles.optionLabel}>
                            {item.label}
                          </Body1>
                          {isSelected ? (
                            <CheckIcon color={BrandColors.primary.light} />
                          ) : null}
                        </Pressable>
                      );
                    }}
                  />
                </SafeAreaView>
              </View>
            </Modal>
          </View>
        );
      }}
    />
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
  sheet: {
    maxHeight: '70%',
    backgroundColor: BrandColors.neutral.xdark,
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: BrandColors.neutral.white,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.lg,
    gap: Spacing.xxs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xxs,
    borderRadius: Radius.medium,
  },
  optionRowSelected: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  optionRowPressed: {
    opacity: 0.85,
  },
  optionLabel: {
    flex: 1,
  },
});
