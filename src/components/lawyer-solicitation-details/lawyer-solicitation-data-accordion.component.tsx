import { StyleSheet, View } from 'react-native';

import { Body1, Body2, Heading2 } from '@/atomic/typography';
import { SOLICITATION_STATUS_META } from '@/components/client-solicitation-card';
import { getSolicitationStatusLabel } from '@/components/client-solicitation-details/mock-client-solicitation-details';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { LawyerDetailAccordionShell } from './lawyer-detail-accordion-shell.component';
import type { LawyerSolicitationDetails } from './mock-lawyer-solicitation-details';

type LawyerSolicitationDataAccordionProps = {
  solicitation: LawyerSolicitationDetails;
};

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Heading2 color={BrandColors.neutral.white}>{label}</Heading2>
      <Body1 color={BrandColors.primary.light}>{value}</Body1>
    </View>
  );
}

export function LawyerSolicitationDataAccordion({
  solicitation,
}: LawyerSolicitationDataAccordionProps) {
  const statusMeta = SOLICITATION_STATUS_META[solicitation.status];

  return (
    <LawyerDetailAccordionShell title="Dados da solicitação" initiallyOpen>
      <View style={styles.items}>
        <DetailItem label="Título" value={solicitation.title} />

        <View style={styles.detailItem}>
          <Heading2 color={BrandColors.neutral.white}>Grau de Urgência</Heading2>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusMeta.accentColor },
              ]}
            />
            <Body1 color={BrandColors.neutral.white}>
              {getSolicitationStatusLabel(solicitation.status)}
            </Body1>
          </View>
        </View>

        <DetailItem label="Atuação" value={solicitation.practice} />
        <DetailItem
          label="Especialidade"
          value={
            solicitation.specialties.length > 0
              ? solicitation.specialties.join(', ')
              : 'Não informado'
          }
        />

        <View style={styles.detailItem}>
          <Heading2 color={BrandColors.neutral.white}>Subespecialidade</Heading2>
          {solicitation.subspecialties.length > 0 ? (
            <View style={styles.tags}>
              {solicitation.subspecialties.map((subspecialty) => (
                <View key={subspecialty} style={styles.tag}>
                  <Body2 color={BrandColors.neutral.white}>{subspecialty}</Body2>
                </View>
              ))}
            </View>
          ) : (
            <Body1 color={BrandColors.primary.light}>Não informado</Body1>
          )}
        </View>

        <DetailItem
          label="Tempo de experiência"
          value={
            solicitation.minimumExperienceMonths > 0
              ? `${solicitation.minimumExperienceMonths} meses`
              : 'Não informado'
          }
        />
        <DetailItem label="Localização" value={solicitation.location} />
        <DetailItem
          label="Formas de Cobrança"
          value={solicitation.billingMethod || 'Não informado'}
        />
      </View>
    </LawyerDetailAccordionShell>
  );
}

const styles = StyleSheet.create({
  items: {
    gap: Spacing.sm,
  },
  detailItem: {
    gap: Spacing.xxxs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  tag: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.xdark,
  },
});
