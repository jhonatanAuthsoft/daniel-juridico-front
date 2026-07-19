import { Body1 } from '@/atomic/typography';
import { BrandColors } from '@/constants/theme';

import { ClientDetailAccordionShell } from './client-detail-accordion-shell.component';

type ClientSolicitationDescriptionAccordionProps = {
  description: string;
};

export function ClientSolicitationDescriptionAccordion({
  description,
}: ClientSolicitationDescriptionAccordionProps) {
  return (
    <ClientDetailAccordionShell title="Descrição da solicitação">
      <Body1 color={BrandColors.neutral.white}>{description}</Body1>
    </ClientDetailAccordionShell>
  );
}
