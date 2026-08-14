import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchIcon } from '@/assets/icon/search';
import { XIcon } from '@/assets/icon/x';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Body2, Display, Heading1 } from '@/atomic/typography';
import { LawyerEmptyState } from '@/components/lawyer-empty-state';
import {
  LawyerSolicitationCard,
  type LawyerSolicitationCardData,
} from '@/components/lawyer-solicitation-card';
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
  mapConnectionToLawyerCard,
  useConnections,
} from '@/domain/connection';

const TAB_BAR_CONTENT_HEIGHT = 62;
const LIST_GAP_ABOVE_TAB = 16;

export default function LawyerHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: connections = [],
    isLoading,
    isError,
    refetch,
  } = useConnections({ status: 'PENDENTE' });

  const solicitations = useMemo(
    () => connections.map(mapConnectionToLawyerCard),
    [connections],
  );

  const listPaddingBottom =
    TAB_BAR_CONTENT_HEIGHT + insets.bottom + LIST_GAP_ABOVE_TAB;

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return solicitations;
    }

    return solicitations.filter((item: LawyerSolicitationCardData) => {
      return (
        item.clientName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, solicitations]);

  const hasSolicitations = solicitations.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;

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
                  placeholder="Buscar pedido"
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
                Pedidos de conexão
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

          {searchOpen && hasSearchQuery ? (
            <>
              <Separator size="sm" />
              <Heading1 color={BrandColors.neutral.white}>Seus resultados</Heading1>
            </>
          ) : null}

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

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={BrandColors.primary.light} size="large" />
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: listPaddingBottom },
            ]}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <Separator size="sm" />}
            ListEmptyComponent={
              <LawyerEmptyState
                variant={hasSolicitations ? 'no-results' : 'no-data'}
              />
            }
            renderItem={({ item }) => (
              <LawyerSolicitationCard
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
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0)' : 'transparent',
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
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
