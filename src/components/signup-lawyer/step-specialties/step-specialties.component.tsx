import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useSpecialtiesCatalog } from '@/domain/catalog';

import type { SpecialtyCategory } from '../specialties.data';
import { OptionCheckbox } from '../selectable-option';
import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

const ANIMATION_DURATION_MS = 260;
const ANIMATION_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
const TIMING = {
  duration: ANIMATION_DURATION_MS,
  easing: ANIMATION_EASING,
} as const;

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
  const panelSelected = allSelected || someSelected;
  const progress = useSharedValue(expanded ? 1 : 0);
  const height = useSharedValue(0);
  const measuredHeight = useSharedValue(0);
  const wasExpanded = useRef(expanded);

  useEffect(() => {
    if (wasExpanded.current === expanded) {
      return;
    }
    wasExpanded.current = expanded;
    progress.value = withTiming(expanded ? 1 : 0, TIMING);
    height.value = withTiming(expanded ? measuredHeight.value : 0, TIMING);
  }, [expanded, height, measuredHeight, progress]);

  const bodyStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.7, 1]),
    overflow: 'hidden' as const,
  }));

  const caretStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const childrenList = (
    <View style={styles.children}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: allSelected }}
        onPress={onToggleAll}
        style={styles.childRow}>
        <OptionCheckbox checked={allSelected} />
        <Body1 bold={allSelected} color={BrandColors.neutral.white}>
          Marcar todos
        </Body1>
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
            <OptionCheckbox checked={checked} />
            <Body1 bold={checked} color={BrandColors.neutral.white}>
              {child.label}
            </Body1>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.panelShell, panelSelected && styles.panelShellSelected]}>
      <GlassBackground blurPx={25} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggleExpand}
        style={styles.panelHeader}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: allSelected }}
          hitSlop={Spacing.xxs}
          onPress={onToggleAll}>
          <OptionCheckbox checked={allSelected} indeterminate={someSelected && !allSelected} />
        </Pressable>
        <Body1
          bold={panelSelected}
          color={BrandColors.neutral.white}
          style={styles.panelTitle}>
          {category.label}
        </Body1>
        <Animated.View style={caretStyle}>
          <CaretLeftIcon
            color={BrandColors.neutral.light}
            direction="down"
            height={20}
            width={20}
          />
        </Animated.View>
      </Pressable>

      <View style={styles.bodySlot}>
        <View
          pointerEvents="none"
          style={styles.measure}
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight <= 0) {
              return;
            }
            const previous = measuredHeight.value;
            measuredHeight.value = nextHeight;
            if (expanded && (previous <= 0 || Math.abs(previous - nextHeight) > 1)) {
              height.value = nextHeight;
            }
          }}>
          {childrenList}
        </View>
        <Animated.View
          accessibilityElementsHidden={!expanded}
          importantForAccessibility={expanded ? 'yes' : 'no-hide-descendants'}
          pointerEvents={expanded ? 'auto' : 'none'}
          style={bodyStyle}>
          {childrenList}
        </Animated.View>
      </View>
    </View>
  );
}

export function StepSpecialties() {
  const { control } = useFormContext<LawyerSignupFormValues>();
  const catalog = useSpecialtiesCatalog();
  const categories = useMemo(
    () => catalog.data?.categories ?? [],
    [catalog.data?.categories],
  );
  const [query, setQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const didInitExpandRef = useRef(false);

  useEffect(() => {
    const firstId = categories[0]?.id;
    if (!firstId || didInitExpandRef.current) {
      return;
    }
    didInitExpandRef.current = true;
    setExpandedIds([firstId]);
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return categories;
    }

    return categories
      .map((category) => {
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
      })
      .filter(Boolean) as SpecialtyCategory[];
  }, [categories, query]);

  if (catalog.isLoading) {
    return (
      <View style={signupLawyerSharedStyles.fields}>
        <ActivityIndicator color={BrandColors.primary.light} />
        <InputCaption color={BrandColors.neutral.light}>
          Carregando especialidades...
        </InputCaption>
      </View>
    );
  }

  if (catalog.isError) {
    return (
      <View style={signupLawyerSharedStyles.fields}>
        <InputCaption color={BrandColors.neutral.light}>
          {getErrorMessage(catalog.error, 'Não foi possível carregar as especialidades.')}
        </InputCaption>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void catalog.refetch();
          }}>
          <Body1 color={BrandColors.primary.light}>Tentar novamente</Body1>
        </Pressable>
      </View>
    );
  }

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
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <Controller
        control={control}
        name="specialties"
        rules={{
          validate: (value) =>
            (value?.length ?? 0) > 0 ? true : 'Selecione ao menos uma especialidade',
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
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
            <View>
              <View style={styles.list}>
                {filteredCategories.map((category) => (
                  <CategoryPanel
                    key={category.id}
                    category={category}
                    expanded={Boolean(query.trim()) || expandedIds.includes(category.id)}
                    selected={selected}
                    onToggleExpand={() => toggleExpand(category.id)}
                    onToggleChild={toggleChild}
                    onToggleAll={() => toggleAll(category)}
                  />
                ))}
              </View>
              {error?.message ? (
                <>
                  <Separator size="xxxs" />
                  <InputCaption color={BrandColors.feedback.error.light}>
                    {error.message}
                  </InputCaption>
                </>
              ) : null}
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
  searchShell: {
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  searchContent: {
    zIndex: 1,
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
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0)' : 'transparent',
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
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  panelShellSelected: {
    borderColor: BrandColors.accessory.darkBlue,
  },
  panelHeader: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  panelTitle: {
    flex: 1,
  },
  bodySlot: {
    zIndex: 1,
    position: 'relative',
  },
  measure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
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
});
