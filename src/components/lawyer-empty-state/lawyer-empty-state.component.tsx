import { StyleSheet, View } from 'react-native';

import { InboxEmptyIcon } from '@/assets/icon/inbox-empty';
import { SearchListIcon } from '@/assets/icon/search-list';
import { Body2, Heading1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type LawyerEmptyStateVariant = 'no-data' | 'no-results';

type LawyerEmptyStateProps = {
  variant: LawyerEmptyStateVariant;
};

const COPY: Record<
  LawyerEmptyStateVariant,
  { title: string; description: string }
> = {
  'no-data': {
    title: 'Nenhuma solicitação encontrada',
    description:
      'Quando houver novas solicitações, elas aparecerão aqui para você acompanhar.',
  },
  'no-results': {
    title: 'Sem resultados compatíveis',
    description: 'Não encontramos clientes que correspondam a sua busca.',
  },
};

export function LawyerEmptyState({ variant }: LawyerEmptyStateProps) {
  const copy = COPY[variant];
  const hasNoData = variant === 'no-data';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          hasNoData ? styles.noDataIcon : styles.noResultsIcon,
        ]}>
        {hasNoData ? (
          <InboxEmptyIcon
            testID="inbox-empty-icon"
            color={BrandColors.neutral.xdark}
            width={36}
            height={36}
          />
        ) : (
          <SearchListIcon
            testID="search-list-icon"
            color={BrandColors.neutral.xdark}
            width={36}
            height={36}
          />
        )}
      </View>

      <Heading1 color={BrandColors.neutral.white} style={styles.title}>
        {copy.title}
      </Heading1>
      <Body2 color={BrandColors.neutral.white} style={styles.description}>
        {copy.description}
      </Body2>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  iconContainer: {
    width: 82,
    height: 82,
    borderRadius: Radius.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  noDataIcon: {
    backgroundColor: BrandColors.neutral.xlight,
  },
  noResultsIcon: {
    backgroundColor: BrandColors.primary.light,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    maxWidth: 390,
    marginTop: Spacing.xxxs,
    textAlign: 'center',
  },
});
