import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { GlassBackground } from '@/atomic/glass';
import { Body1, InputCaption } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import {
  SPECIALTY_CATEGORIES,
  type SpecialtyCategory,
} from '../specialties.data';
import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

function Checkbox({ checked }: { checked: boolean }) {
  return <View style={[styles.checkbox, checked && styles.checkboxChecked]} />;
}

type CategoryPanelProps = {
  category: SpecialtyCategory;
  expanded: boolean;
  selected: string[];
  onToggleExpand: () => void;
  onToggleChild: (id: string) => void;
  onToggleAll: () => void;
};

function CategoryPanel({
  category,
  expanded,
  selected,
  onToggleExpand,
  onToggleChild,
  onToggleAll,
}: CategoryPanelProps) {
  const childIds = category.children.map((child) => child.id);
  const selectedCount = childIds.filter((id) => selected.includes(id)).length;
  const allSelected = selectedCount === childIds.length && childIds.length > 0;
  const someSelected = selectedCount > 0;

  return (
    <View style={styles.panelShell}>
      <GlassBackground blurPx={25} />
      <Pressable
        accessibilityRole="button"
        onPress={onToggleExpand}
        style={styles.panelHeader}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: allSelected }}
          hitSlop={Spacing.xxs}
          onPress={onToggleAll}>
          <Checkbox checked={allSelected || someSelected} />
        </Pressable>
        <Body1 color={BrandColors.neutral.white} style={styles.panelTitle}>
          {category.label}
        </Body1>
        <SymbolView
          name={{
            ios: expanded ? 'chevron.up' : 'chevron.down',
            android: expanded ? 'expand_less' : 'expand_more',
            web: expanded ? 'expand_less' : 'expand_more',
          }}
          size={20}
          tintColor={BrandColors.neutral.light}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.children}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: allSelected }}
            onPress={onToggleAll}
            style={styles.childRow}>
            <Checkbox checked={allSelected} />
            <Body1 color={BrandColors.neutral.white}>Marcar todos</Body1>
          </Pressable>
          {category.children.map((child) => {
            const checked = selected.includes(child.id);
            return (
              <Pressable
                key={child.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                onPress={() => onToggleChild(child.id)}
                style={styles.childRow}>
                <Checkbox checked={checked} />
                <Body1 color={BrandColors.neutral.white}>{child.label}</Body1>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export function StepSpecialties() {
  const { control } = useFormContext<LawyerSignupFormValues>();
  const [query, setQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>(['civil']);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return SPECIALTY_CATEGORIES;
    }

    return SPECIALTY_CATEGORIES.map((category) => {
      const categoryMatch = category.label.toLowerCase().includes(normalized);
      const children = category.children.filter((child) =>
        child.label.toLowerCase().includes(normalized),
      );

      if (categoryMatch) {
        return category;
      }

      if (children.length > 0) {
        return { ...category, children };
      }

      return null;
    }).filter(Boolean) as SpecialtyCategory[];
  }, [query]);

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <View style={styles.searchShell}>
        <GlassBackground blurPx={25} />
        <View style={styles.searchContent}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={18}
            tintColor={BrandColors.neutral.light}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar..."
            placeholderTextColor={BrandColors.neutral.light}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="specialties"
        render={({ field: { value, onChange } }) => {
          const selected = value ?? [];

          const toggleChild = (id: string) => {
            if (selected.includes(id)) {
              onChange(selected.filter((item) => item !== id));
              return;
            }
            onChange([...selected, id]);
          };

          const toggleAll = (category: SpecialtyCategory) => {
            const ids = category.children.map((child) => child.id);
            const allSelected = ids.every((id) => selected.includes(id));
            if (allSelected) {
              onChange(selected.filter((id) => !ids.includes(id)));
              return;
            }
            const merged = new Set([...selected, ...ids]);
            onChange([...merged]);
          };

          const toggleExpand = (id: string) => {
            setExpandedIds((current) =>
              current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
            );
          };

          if (filteredCategories.length === 0) {
            return (
              <InputCaption color={BrandColors.neutral.light}>
                Nenhuma especialidade encontrada.
              </InputCaption>
            );
          }

          return (
            <View style={styles.list}>
              {filteredCategories.map((category) => (
                <CategoryPanel
                  key={category.id}
                  category={category}
                  expanded={expandedIds.includes(category.id) || Boolean(query.trim())}
                  selected={selected}
                  onToggleExpand={() => toggleExpand(category.id)}
                  onToggleChild={toggleChild}
                  onToggleAll={() => toggleAll(category)}
                />
              ))}
            </View>
          );
        }}
      />
    </View>
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
  searchShell: {
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    ...glassShadow,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    margin: 0,
    color: BrandColors.neutral.white,
    fontSize: 16,
  },
  list: {
    gap: Spacing.sm,
    width: '100%',
  },
  panelShell: {
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    ...glassShadow,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  panelTitle: {
    flex: 1,
  },
  children: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.xxs,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xxs,
    paddingLeft: Spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: BrandColors.neutral.white,
  },
  checkboxChecked: {
    backgroundColor: BrandColors.primary.light,
    borderColor: BrandColors.primary.light,
  },
});
