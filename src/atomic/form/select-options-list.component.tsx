import {
  memo,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';

import { CheckboxEmptyIcon } from '@/assets/icon/checkbox-empty';
import { CheckedCheckboxIcon } from '@/assets/icon/checked-checkbox';
import { InputCaption } from '@/atomic/typography';
import type { SelectOption } from '@/constants/select-options';
import {
  BrandColors,
  FontLineHeight,
  FontSize,
  InterFontFamily,
  resolveLineHeight,
  Spacing,
} from '@/constants/theme';
import { normalizeSearchText } from '@/utils/br-input';

/** Matches Body1 row + vertical padding so getItemLayout can stay exact. */
export const SELECT_OPTION_ROW_HEIGHT = Spacing.sm * 2 + 24;

type SelectOptionsListProps = {
  options: readonly SelectOption[];
  searchQuery: string;
  optionsLoading: boolean;
  selectedValues: ReadonlySet<string>;
  accessibilityRole: 'button' | 'checkbox';
  onPressOption: (value: string) => void;
  /** Shared set mutated while the sheet is open; read it after close. */
  selectedDraftRef?: MutableRefObject<Set<string>>;
};

type OptionRowProps = {
  label: string;
  value: string;
  selected: boolean;
  accessibilityRole: 'button' | 'checkbox';
  onPress: (value: string) => void;
};

export function filterSelectOptions(
  options: readonly SelectOption[],
  searchQuery: string,
): readonly SelectOption[] {
  const query = normalizeSearchText(searchQuery);
  if (!query) {
    return options;
  }

  return options.filter((option) =>
    normalizeSearchText(option.label).includes(query),
  );
}

export function useDeferredFilteredOptions(
  options: readonly SelectOption[],
  searchQuery: string,
): readonly SelectOption[] {
  const deferredQuery = useDeferredValue(searchQuery);
  const searchIndex = useMemo(
    () => options.map((option) => normalizeSearchText(option.label)),
    [options],
  );

  return useMemo(() => {
    const query = normalizeSearchText(deferredQuery);
    if (!query) {
      return options;
    }

    return options.filter((_, index) => searchIndex[index]?.includes(query));
  }, [deferredQuery, options, searchIndex]);
}

const OptionRow = memo(function OptionRow({
  label,
  value,
  selected,
  accessibilityRole,
  onPress,
}: OptionRowProps) {
  const [checked, setChecked] = useState(selected);
  const isCheckbox = accessibilityRole === 'checkbox';

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={isCheckbox ? { checked } : { selected: checked }}
      onPress={() => {
        if (isCheckbox) {
          setChecked((current) => !current);
        }
        onPress(value);
      }}
      style={({ pressed }) => [styles.optionRow, pressed && styles.optionRowPressed]}>
      {checked ? (
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
      <Text numberOfLines={1} style={styles.optionLabel}>
        {label}
      </Text>
    </Pressable>
  );
});

export function SelectOptionsList({
  options,
  searchQuery,
  optionsLoading,
  selectedValues,
  accessibilityRole,
  onPressOption,
  selectedDraftRef,
}: SelectOptionsListProps) {
  const { height: windowHeight } = useWindowDimensions();
  const listMaxHeight = Math.round(windowHeight * 0.52);
  const internalSelectedRef = useRef(new Set(selectedValues));
  const selectedRef = selectedDraftRef ?? internalSelectedRef;
  const isCheckbox = accessibilityRole === 'checkbox';

  const handlePress = useCallback(
    (value: string) => {
      if (!isCheckbox) {
        onPressOption(value);
        return;
      }

      const selected = selectedRef.current;
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
    },
    [isCheckbox, onPressOption, selectedRef],
  );

  const renderItem = useCallback<ListRenderItem<SelectOption>>(
    ({ item }) => (
      <OptionRow
        accessibilityRole={accessibilityRole}
        label={item.label}
        onPress={handlePress}
        selected={selectedRef.current.has(item.value)}
        value={item.value}
      />
    ),
    [accessibilityRole, handlePress, selectedRef],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<SelectOption> | null | undefined, index: number) => ({
      length: SELECT_OPTION_ROW_HEIGHT,
      offset: SELECT_OPTION_ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <FlatList
      data={options as SelectOption[]}
      getItemLayout={getItemLayout}
      initialNumToRender={12}
      keyExtractor={keyExtractor}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <InputCaption color={BrandColors.neutral.light}>
          {optionsLoading
            ? 'Carregando opções...'
            : searchQuery.trim()
              ? 'Nenhuma opção encontrada.'
              : 'Nenhuma opção disponível.'}
        </InputCaption>
      }
      maxToRenderPerBatch={12}
      removeClippedSubviews={Platform.OS === 'android'}
      renderItem={renderItem}
      style={[styles.list, { maxHeight: listMaxHeight }]}
      updateCellsBatchingPeriod={16}
      windowSize={5}
    />
  );
}

function keyExtractor(item: SelectOption) {
  return item.value;
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
  },
  optionRow: {
    height: SELECT_OPTION_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(230, 232, 227, 0.24)',
  },
  optionRowPressed: {
    opacity: 0.85,
  },
  optionLabel: {
    flex: 1,
    color: BrandColors.neutral.white,
    fontFamily: InterFontFamily[500],
    fontSize: FontSize.small,
    lineHeight: resolveLineHeight(FontSize.small, FontLineHeight.large),
  },
});
