import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { CheckboxEmptyIcon } from '@/assets/icon/checkbox-empty';
import { CheckedCheckboxIcon } from '@/assets/icon/checked-checkbox';
import { GlassBackground } from '@/atomic/glass';
import { Body1, InputCaption } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export type OptionCheckboxProps = {
  checked: boolean;
  /** Partial selection (category with some children). Same checked chrome for now. */
  indeterminate?: boolean;
};

export function OptionCheckbox({ checked, indeterminate = false }: OptionCheckboxProps) {
  const isOn = checked || indeterminate;

  if (isOn) {
    return (
      <CheckedCheckboxIcon
        width={24}
        height={24}
        color={BrandColors.primary.light}
      />
    );
  }

  return (
    <CheckboxEmptyIcon width={24} height={24} color={BrandColors.neutral.xlight} />
  );
}

export type SelectableOptionProps = {
  checked: boolean;
  label: string;
  description?: string;
  onPress: () => void;
};

export function SelectableOption({
  checked,
  label,
  description,
  onPress,
}: SelectableOptionProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionShell,
        checked && styles.optionShellSelected,
        pressed && styles.optionPressed,
      ]}>
      <GlassBackground blurPx={25} />
      <View style={styles.optionContent}>
        <OptionCheckbox checked={checked} />
        <View style={styles.optionText}>
          <Body1 bold={checked} color={BrandColors.neutral.white}>
            {label}
          </Body1>
          {description ? (
            <InputCaption color={BrandColors.neutral.light}>{description}</InputCaption>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export type SelectableOptionListProps = {
  children: ReactNode;
};

export function SelectableOptionList({ children }: SelectableOptionListProps) {
  return <View style={styles.list}>{children}</View>;
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
  list: {
    gap: Spacing.sm,
    width: '100%',
  },
  optionShell: {
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  optionShellSelected: {
    borderColor: BrandColors.accessory.darkBlue,
  },
  optionPressed: {
    opacity: 0.88,
  },
  optionContent: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  optionText: {
    flex: 1,
    gap: Spacing.xxxs,
  },
});
