import { StyleSheet, View } from 'react-native';

import { Body1, Body2 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { LawyerDetailAccordionShell } from './lawyer-detail-accordion-shell.component';
import type { LawyerSolicitationDetails } from './mock-lawyer-solicitation-details';

type DataFieldProps = {
  label: string;
  value: string;
};

function DataField({ label, value }: DataFieldProps) {
  return (
    <View style={styles.field}>
      <Body2 color={BrandColors.neutral.light}>{label}</Body2>
      <Body1 color={BrandColors.neutral.white}>{value}</Body1>
    </View>
  );
}

type LawyerSolicitationDataAccordionProps = {
  solicitation: LawyerSolicitationDetails;
};

export function LawyerSolicitationDataAccordion({
  solicitation,
}: LawyerSolicitationDataAccordionProps) {
  return (
    <LawyerDetailAccordionShell title="Dados da solicitação">
      <View style={styles.content}>
        <DataField label="Título" value={solicitation.title} />
        <DataField label="Urgência" value={solicitation.urgency} />
        <DataField label="Atuação" value={solicitation.practice} />
        <View style={styles.field}>
          <Body2 color={BrandColors.neutral.light}>Especialidades</Body2>
          <View style={styles.tags}>
            {solicitation.specialties.map((specialty) => (
              <View key={specialty} style={styles.tag}>
                <Body2 color={BrandColors.neutral.white}>{specialty}</Body2>
              </View>
            ))}
          </View>
        </View>
        <DataField label="Localização" value={solicitation.location} />
        <DataField
          label="Método de cobrança"
          value={solicitation.billingMethod}
        />
      </View>
    </LawyerDetailAccordionShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.xs,
  },
  field: {
    gap: Spacing.xxxs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  tag: {
    paddingHorizontal: Spacing.xxs,
    paddingVertical: Spacing.xxxs,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.neutral.dark,
  },
});
