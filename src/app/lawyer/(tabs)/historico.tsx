import { useRouter } from 'expo-router';
import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { SearchIcon } from '@/assets/icon/search';
import { XIcon } from '@/assets/icon/x';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Body2, Display, Heading1, Link } from '@/atomic/typography';
import { getTabBarTotalHeight } from '@/components/app-tab-bar';
import { LawyerEmptyState } from '@/components/lawyer-empty-state';
import { LawyerHistoryCard, type LawyerHistoryDecision } from '@/components/lawyer-history';
import {
  BrandColors,
  BrandGradients,
  FontSize,
  InterFontFamily,
  MaxContentWidth,
  Radius,
  Spacing,
} from '@/constants/theme';
import {
  emptyConnectionStatusCounts,
  type StatusConexaoApi,
} from '@/data/connection';
import { useSpecialtiesCatalog } from '@/domain/catalog';
import {
  LAWYER_HISTORY_STATUSES,
  mapConnectionToLawyerHistoryItem,
  useLawyerHistoryConnections,
} from '@/domain/connection';

const LIST_GAP_ABOVE_TAB = 16;

type HistoryFilterId = 'all' | LawyerHistoryDecision;

const HISTORY_FILTERS: { id: HistoryFilterId; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'accepted', label: 'Aceitas' },
  { id: 'rejected', label: 'Recusadas' },
];

function statusForFilter(
  filter: HistoryFilterId,
): StatusConexaoApi | StatusConexaoApi[] {
  if (filter === 'accepted') {
    return 'ACEITA';
  }
  if (filter === 'rejected') {
    return 'RECUSADA';
  }
  return LAWYER_HISTORY_STATUSES;
}

export default function LawyerHistoricoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<HistoryFilterId>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const deferredSearch = useDeferredValue(searchQuery.trim());

  const {
    data,
    isLoading,
    isError,
    isFetched,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLawyerHistoryConnections({
    status: statusForFilter(activeFilter),
    busca: deferredSearch || undefined,
  });
  const catalogQuery = useSpecialtiesCatalog();

  const handlePullRefresh = useCallback(async () => {
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [refetch]);

  const connections = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data],
  );

  const items = useMemo(
    () =>
      connections
        .map((connection) => {
          const specialty = catalogQuery.data?.items.find(
            (item) => item.code === connection.especialidadeCodigo,
          );
          return mapConnectionToLawyerHistoryItem(connection, {
            specialtyLabel: specialty?.name,
          });
        })
        .filter((item): item is NonNullable<typeof item> => item != null),
    [catalogQuery.data, connections],
  );

  const countsByStatus =
    data?.pages?.[0]?.countsByStatus ?? emptyConnectionStatusCounts();
  const acceptedCount = countsByStatus.ACEITA;
  const rejectedCount = countsByStatus.RECUSADA;
  const historyTotal = acceptedCount + rejectedCount;

  const filterChips = useMemo(
    () =>
      HISTORY_FILTERS.map((filter) => {
        if (filter.id === 'all') {
          return { ...filter, count: historyTotal };
        }
        return {
          ...filter,
          count: filter.id === 'accepted' ? acceptedCount : rejectedCount,
        };
      }),
    [acceptedCount, historyTotal, rejectedCount],
  );

  const hasSearchQuery = deferredSearch.length > 0;
  const hasListItems = items.length > 0;
  const hasNoHistoryAtAll =
    isFetched &&
    !isLoading &&
    !isError &&
    !hasListItems &&
    historyTotal === 0 &&
    activeFilter === 'all' &&
    !hasSearchQuery;

  const showListLoading =
    !hasListItems && !isError && (isLoading || !isFetched) && !isPullRefreshing;

  const listPaddingBottom =
    getTabBarTotalHeight(insets.bottom) + LIST_GAP_ABOVE_TAB;

  return (
    <View style={styles.root}>
      <View style={[styles.safeTop, { paddingTop: insets.top }]}>
        <View style={styles.headerBlock}>
          {searchOpen ? (
            <View style={styles.searchField}>
              <GlassBackground blurPx={25} gradient={BrandGradients.gradient} />
              <View style={styles.searchFieldContent}>
                <SearchIcon color={BrandColors.neutral.white} width={20} height={20} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar no histórico"
                  placeholderTextColor={BrandColors.neutral.medium}
                  autoFocus
                  underlineColorAndroid="transparent"
                  style={styles.searchInput}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpar e fechar pesquisa"
                  hitSlop={Spacing.xxs}
                  onPress={() => {
                    setSearchQuery('');
                    setSearchOpen(false);
                  }}
                  style={({ pressed }) => pressed && styles.pressed}>
                  <XIcon color={BrandColors.neutral.white} width={16} height={16} />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.titleRow}>
              <Display color={BrandColors.neutral.white} style={styles.title}>
                Histórico
              </Display>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pesquisar"
                hitSlop={Spacing.xxs}
                onPress={() => setSearchOpen(true)}
                style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}>
                <SearchIcon color={BrandColors.neutral.white} width={24} height={24} />
              </Pressable>
            </View>
          )}

          {searchOpen ? (
            hasSearchQuery ? (
              <>
                <Separator size="sm" />
                <Heading1 color={BrandColors.neutral.white}>Seus resultados</Heading1>
              </>
            ) : null
          ) : (
            <>
              <Separator size="sm" />
              <ScrollView
                horizontal
                removeClippedSubviews={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersRow}>
                {filterChips.map((chip) => {
                  const selected = activeFilter === chip.id;
                  return (
                    <Pressable
                      key={chip.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setActiveFilter(chip.id)}
                      style={({ pressed }) => [
                        styles.filterChip,
                        pressed && styles.pressed,
                      ]}>
                      {selected ? (
                        <GlassBackground
                          blurPx={25}
                          gradient={{
                            colors: [
                              'rgba(255, 255, 255, 0.20)',
                              'rgba(255, 255, 255, 0.20)',
                            ],
                            angleDeg: 182,
                            locationsPercent: [0, 100],
                          }}
                        />
                      ) : (
                        <GlassBackground blurPx={25} gradient={BrandGradients.gradient} />
                      )}
                      <View style={styles.filterChipContent}>
                        <Body2 color={BrandColors.neutral.white}>{chip.label}</Body2>
                        <Body2 color={BrandColors.primary.light}>
                          {String(chip.count)}
                        </Body2>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}

          {isError ? (
            <>
              <Separator size="sm" />
              <Pressable
                accessibilityLabel="Tentar novamente"
                accessibilityRole="button"
                onPress={() => {
                  void refetch();
                }}>
                <Body2 color={BrandColors.primary.light}>
                  Não foi possível carregar. Toque para tentar novamente.
                </Body2>
              </Pressable>
            </>
          ) : null}
        </View>

        {showListLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={BrandColors.primary.light} size="large" />
          </View>
        ) : (
          <FlatList
            testID="lawyer-history-list"
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: listPaddingBottom },
            ]}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            refreshControl={
              <RefreshControl
                refreshing={isPullRefreshing}
                tintColor={BrandColors.primary.light}
                colors={[BrandColors.primary.light]}
                onRefresh={() => {
                  void handlePullRefresh();
                }}
              />
            }
            ItemSeparatorComponent={() => <Separator size="sm" />}
            ListEmptyComponent={
              <LawyerEmptyState
                variant={hasNoHistoryAtAll ? 'no-data' : 'no-results'}
              />
            }
            ListFooterComponent={
              hasNextPage ? (
                <View style={styles.listFooter}>
                  {isFetchingNextPage ? (
                    <ActivityIndicator color={BrandColors.primary.light} />
                  ) : (
                    <Pressable
                      accessibilityLabel="Ver mais"
                      accessibilityRole="button"
                      onPress={() => {
                        void fetchNextPage();
                      }}
                      style={({ pressed }) => [
                        styles.loadMoreButton,
                        pressed && styles.pressed,
                      ]}>
                      <CaretLeftIcon
                        color={BrandColors.primary.light}
                        direction="down"
                        height={20}
                        width={20}
                      />
                      <Link color={BrandColors.primary.light}>Ver mais</Link>
                    </Pressable>
                  )}
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <LawyerHistoryCard
                {...item}
                onPress={() => router.push(`/lawyer/solicitacao/${item.id}`)}
              />
            )}
          />
        )}
      </View>
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
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  safeTop: {
    flex: 1,
  },
  headerBlock: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  searchButton: {
    padding: Spacing.xxxs,
  },
  searchField: {
    overflow: 'hidden',
    minHeight: 48,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  searchFieldContent: {
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingRight: Spacing.sm,
  },
  filterChip: {
    overflow: 'hidden',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    zIndex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
  },
  listFooter: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  loadMoreButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  pressed: {
    opacity: 0.75,
  },
});
