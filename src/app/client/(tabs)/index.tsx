import { useRouter } from 'expo-router';
import { useDeferredValue, useMemo, useState } from 'react';
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
import { LoadingState } from '@/atomic/loading-state';
import { Separator } from '@/atomic/separator';
import { Body2, Display, Heading1, Link } from '@/atomic/typography';
import { getTabBarTotalHeight } from '@/components/app-tab-bar';
import { ClientEmptyState } from '@/components/client-empty-state';
import {
  ClientSolicitationCard,
  ClientSolicitationCardShimmer,
} from '@/components/client-solicitation-card';
import {
  BrandColors,
  BrandGradients,
  FontSize,
  InterFontFamily,
  MaxContentWidth,
  Radius,
  Spacing,
} from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import {
  emptySolicitationStatusCounts,
  type StatusSolicitacaoApi,
} from '@/data/solicitation';
import { useClientSolicitations } from '@/domain/solicitation';

const FAB_HEIGHT = 48;
/** Distance between FAB and top of tab bar. */
const FAB_GAP_ABOVE_TAB = 16;
/** Distance between last list item and top of FAB when scrolled to end. */
const LIST_GAP_ABOVE_FAB = 8;
const LIST_SHIMMER_KEYS = [
  'solicitation-shimmer-a',
  'solicitation-shimmer-b',
  'solicitation-shimmer-c',
  'solicitation-shimmer-d',
] as const;

type FilterId = 'all' | 'pending' | 'accepted' | 'canceled';

type FilterChip = {
  id: FilterId;
  label: string;
  count?: number;
};

const FILTER_TO_API_STATUS: Record<Exclude<FilterId, 'all'>, StatusSolicitacaoApi> = {
  pending: 'AGUARDANDO_MATCHING',
  accepted: 'MATCH_REALIZADO',
  canceled: 'CANCELADA',
};

function apiStatusForFilter(filter: FilterId): StatusSolicitacaoApi | undefined {
  if (filter === 'all') {
    return undefined;
  }
  return FILTER_TO_API_STATUS[filter];
}

function SolicitationsListShimmer({ paddingBottom }: { paddingBottom: number }) {
  return (
    <View style={[styles.listContent, { paddingBottom }]}>
      {LIST_SHIMMER_KEYS.map((key, index) => (
        <View key={key}>
          {index > 0 ? <Separator size="sm" /> : null}
          <ClientSolicitationCardShimmer />
        </View>
      ))}
    </View>
  );
}

export default function ClientHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const deferredSearch = useDeferredValue(searchQuery.trim());

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetched,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClientSolicitations({
    status: apiStatusForFilter(activeFilter),
    busca: deferredSearch || undefined,
  });

  const handlePullRefresh = async () => {
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const solicitations = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data],
  );
  const countsByStatus =
    data?.pages?.[0]?.countsByStatus ?? emptySolicitationStatusCounts();
  const totalByStatus = Object.values(countsByStatus).reduce(
    (sum, count) => sum + count,
    0,
  );
  const hasSearchQuery = deferredSearch.length > 0;
  /** True only after a successful fetch with zero solicitations overall. */
  const hasNoSolicitationsAtAll =
    isFetched &&
    !isLoading &&
    !isError &&
    solicitations.length === 0 &&
    totalByStatus === 0 &&
    activeFilter === 'all' &&
    !hasSearchQuery;

  const filterChips = useMemo((): FilterChip[] => {
    return [
      { id: 'all', label: 'Todas' },
      {
        id: 'pending',
        label: 'Pendentes',
        count: countsByStatus.AGUARDANDO_MATCHING,
      },
      {
        id: 'accepted',
        label: 'Aceitas',
        count: countsByStatus.MATCH_REALIZADO,
      },
      {
        id: 'canceled',
        label: 'Canceladas',
        count: countsByStatus.CANCELADA,
      },
    ];
  }, [countsByStatus]);

  const tabBarTotalHeight = getTabBarTotalHeight(insets.bottom);
  const fabBottom = tabBarTotalHeight + FAB_GAP_ABOVE_TAB;

  const hasListItems = solicitations.length > 0;
  const listPaddingBottom =
    hasListItems || !hasNoSolicitationsAtAll
      ? fabBottom + FAB_HEIGHT + LIST_GAP_ABOVE_FAB
      : tabBarTotalHeight + Spacing.sm;

  const showListLoading =
    !hasListItems &&
    !isError &&
    (isLoading || !isFetched) &&
    !isPullRefreshing;
  const showListError = isError && !hasListItems;

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
                  placeholder="Buscar solicitação"
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
                Solicitações
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
                        {chip.count != null ? (
                          <Body2 color={BrandColors.primary.light}>{String(chip.count)}</Body2>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>

        <View style={styles.listArea}>
          <LoadingState
            data={hasListItems}
            error={showListError}
            loading={showListLoading}>
            <LoadingState.Shimmer>
              <SolicitationsListShimmer paddingBottom={listPaddingBottom} />
            </LoadingState.Shimmer>

            <LoadingState.ErrorPlaceholder>
              <View style={styles.centeredState}>
                <Heading1 color={BrandColors.neutral.white} style={styles.emptyTitle}>
                  Não foi possível carregar
                </Heading1>
                <Body2 color={BrandColors.neutral.white} style={styles.emptyDescription}>
                  {getErrorMessage(error, 'Tente novamente em instantes.')}
                </Body2>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tentar novamente"
                  onPress={() => {
                    void refetch();
                  }}
                  style={({ pressed }) => [
                    styles.emptyCta,
                    pressed && styles.fabPressed,
                  ]}>
                  <Link color={BrandColors.neutral.xdark}>Tentar novamente</Link>
                </Pressable>
              </View>
            </LoadingState.ErrorPlaceholder>

            <LoadingState.EmptyState>
              <ScrollView
                contentContainerStyle={[
                  styles.listContent,
                  styles.emptyScrollContent,
                  { paddingBottom: listPaddingBottom },
                ]}
                refreshControl={
                  <RefreshControl
                    refreshing={isPullRefreshing}
                    tintColor={BrandColors.primary.light}
                    onRefresh={() => {
                      void handlePullRefresh();
                    }}
                  />
                }
                showsVerticalScrollIndicator={false}>
                {hasNoSolicitationsAtAll ? (
                  <ClientEmptyState
                    variant="no-data"
                    onCreatePress={() => router.push('/client/nova-solicitacao')}
                  />
                ) : (
                  <ClientEmptyState
                    variant="no-results"
                    description={
                      hasSearchQuery
                        ? 'Não encontramos solicitações que correspondam à sua busca.'
                        : 'Não encontramos solicitações que correspondam aos filtros selecionados.'
                    }
                  />
                )}
              </ScrollView>
            </LoadingState.EmptyState>

            <FlatList
              data={solicitations}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.listContent, { paddingBottom: listPaddingBottom }]}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
              refreshing={isPullRefreshing}
              onRefresh={() => {
                void handlePullRefresh();
              }}
              ItemSeparatorComponent={() => <Separator size="sm" />}
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
                <ClientSolicitationCard
                  {...item}
                  onPress={() => router.push(`/client/solicitacao/${item.id}`)}
                />
              )}
            />
          </LoadingState>
        </View>
      </View>

      {!hasNoSolicitationsAtAll ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova solicitação"
          onPress={() => router.push('/client/nova-solicitacao')}
          style={({ pressed }) => [
            styles.fab,
            { bottom: fabBottom },
            pressed && styles.fabPressed,
          ]}>
          <Link color={BrandColors.neutral.xdark}>+ Nova solicitação</Link>
        </Pressable>
      ) : null}
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
  listArea: {
    flex: 1,
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
  emptyScrollContent: {
    justifyContent: 'center',
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
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    maxWidth: 390,
    marginTop: Spacing.xxxs,
    textAlign: 'center',
  },
  emptyCta: {
    width: '100%',
    minHeight: FAB_HEIGHT,
    marginTop: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: Spacing.sm,
    minHeight: FAB_HEIGHT,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 100,
    backgroundColor: BrandColors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  fabPressed: {
    opacity: 0.88,
  },
  pressed: {
    opacity: 0.75,
  },
});
