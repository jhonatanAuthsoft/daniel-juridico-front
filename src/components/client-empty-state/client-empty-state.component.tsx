import { Pressable, StyleSheet, View } from 'react-native';

import { InboxEmptyIcon } from '@/assets/icon/inbox-empty';
import { SearchListIcon } from '@/assets/icon/search-list';
import { Body2, Heading1, Link } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

type ClientEmptyStateVariant = 'no-data' | 'no-results';

type ClientEmptyStateProps = {
  variant: ClientEmptyStateVariant;
  /** Overrides the default description for the active variant. */
  description?: string;
  /** Shown on `no-data` — opens the new solicitation flow. */
  onCreatePress?: () => void;
};

const COPY: Record<
  ClientEmptyStateVariant,
  { title: string; description: string }
> = {
  'no-data': {
    title: 'Nenhuma solicitação encontrada',
    description:
      'Quando houver novas solicitações, elas aparecerão aqui para você acompanhar.',
  },
  'no-results': {
    title: 'Sem resultados compatíveis',
    description:
      'Não encontramos solicitações que correspondam aos filtros selecionados.',
  },
};

const CTA_HEIGHT = 48;

/**
 * Empty state for the client solicitations home.
 * `no-data` — no solicitations created yet (with CTA).
 * `no-results` — search/filter returned nothing.
 */
export function ClientEmptyState({
  variant,
  description,
  onCreatePress,
}: ClientEmptyStateProps) {
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
        {description ?? copy.description}
      </Body2>

      {hasNoData && onCreatePress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova solicitação"
          onPress={onCreatePress}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
          <Link color={BrandColors.neutral.xdark}>+ Nova solicitação</Link>
        </Pressable>
      ) : null}
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
  cta: {
    alignSelf: 'stretch',
    minHeight: CTA_HEIGHT,
    marginTop: Spacing.sm,
    borderRadius: 100,
    backgroundColor: BrandColors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  ctaPressed: {
    opacity: 0.88,
  },
});
