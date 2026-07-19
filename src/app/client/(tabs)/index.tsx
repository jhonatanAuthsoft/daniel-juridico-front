import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InboxEmptyIcon } from '@/assets/icon/inbox-empty';
import { SearchIcon } from '@/assets/icon/search';
import { SearchListIcon } from '@/assets/icon/search-list';
import { XIcon } from '@/assets/icon/x';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Body2, Display, Heading1, Link } from '@/atomic/typography';
import {
  ClientSolicitationCard,
  MOCK_CLIENT_SOLICITATIONS,
  type ClientSolicitationCardData,
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

/** Tab bar content height above the home indicator (icons + labels + padding). */
const TAB_BAR_CONTENT_HEIGHT = 62;
const FAB_HEIGHT = 48;
/** Distance between FAB and top of tab bar. */
const FAB_GAP_ABOVE_TAB = 16;
/** Distance between last list item and top of FAB when scrolled to end. */
const LIST_GAP_ABOVE_FAB = 8;

type FilterId = 'all' | 'pending' | 'accepted' | 'canceled';

type FilterChip = {
  id: FilterId;
  label: string;
  count?: number;
};

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendentes', count: 8 },
  { id: 'accepted', label: 'Aceitas', count: 8 },
  { id: 'canceled', label: 'Canceladas', count: 2 },
];

function matchesFilter(item: ClientSolicitationCardData, filter: FilterId): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'accepted') {
    return item.footerVariant === 'accepted';
  }
  if (filter === 'pending') {
    return item.footerVariant === 'compatible';
  }
  return false;
}

type ClientHomeScreenProps = {
  solicitations?: ClientSolicitationCardData[];
};

export default function ClientHomeScreen({
  solicitations = MOCK_CLIENT_SOLICITATIONS,
}: ClientHomeScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tabBarTotalHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;
  const fabBottom = tabBarTotalHeight + FAB_GAP_ABOVE_TAB;

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return solicitations.filter((item) => {
      if (!matchesFilter(item, activeFilter)) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });
  }, [activeFilter, searchQuery, solicitations]);
  const hasSolicitations = solicitations.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const listPaddingBottom = hasSolicitations
    ? fabBottom + FAB_HEIGHT + LIST_GAP_ABOVE_FAB
    : tabBarTotalHeight + Spacing.sm;

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
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersRow}>
                {FILTER_CHIPS.map((chip) => {
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

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: listPaddingBottom }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Separator size="sm" />}
          ListEmptyComponent={
            hasSolicitations ? (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIcon, styles.noResultsIcon]}>
                  <SearchListIcon
                    testID="search-list-icon"
                    color={BrandColors.neutral.xdark}
                    width={36}
                    height={36}
                  />
                </View>
                <Heading1 color={BrandColors.neutral.white} style={styles.emptyTitle}>
                  Sem resultados compatíveis
                </Heading1>
                <Body2 color={BrandColors.neutral.white} style={styles.emptyDescription}>
                  {hasSearchQuery
                    ? 'Não encontramos solicitações que correspondam à sua busca.'
                    : 'Não encontramos solicitações que correspondam aos filtros selecionados.'}
                </Body2>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <InboxEmptyIcon
                    testID="inbox-empty-icon"
                    color={BrandColors.neutral.xdark}
                    width={36}
                    height={36}
                  />
                </View>
                <Heading1 color={BrandColors.neutral.white} style={styles.emptyTitle}>
                  Nenhuma solicitação encontrada
                </Heading1>
                <Body2 color={BrandColors.neutral.white} style={styles.emptyDescription}>
                  Quando houver novas solicitações, elas aparecerão aqui para você acompanhar.
                </Body2>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Nova solicitação"
                  onPress={() => router.push('/client/nova-solicitacao')}
                  style={({ pressed }) => [
                    styles.emptyCta,
                    pressed && styles.fabPressed,
                  ]}>
                  <Link color={BrandColors.neutral.xdark}>+ Nova solicitação</Link>
                </Pressable>
              </View>
            )
          }
          renderItem={({ item }) => <ClientSolicitationCard {...item} />}
        />
      </View>

      {hasSolicitations ? (
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xl,
  },
  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: Radius.large,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.neutral.xlight,
    marginBottom: Spacing.sm,
  },
  noResultsIcon: {
    backgroundColor: BrandColors.primary.light,
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
