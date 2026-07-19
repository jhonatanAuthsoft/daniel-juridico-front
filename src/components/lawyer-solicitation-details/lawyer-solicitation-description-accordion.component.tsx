import { Body1 } from '@/atomic/typography';
import { BrandColors } from '@/constants/theme';

import { LawyerDetailAccordionShell } from './lawyer-detail-accordion-shell.component';

type LawyerSolicitationDescriptionAccordionProps = {
  description: string;
};

export function LawyerSolicitationDescriptionAccordion({
  description,
}: LawyerSolicitationDescriptionAccordionProps) {
  return (
    <LawyerDetailAccordionShell
      initiallyOpen
      title="Descrição da solicitação">
      <Body1 color={BrandColors.neutral.white}>{description}</Body1>
    </LawyerDetailAccordionShell>
  );
}
