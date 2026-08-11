import type { PropsWithChildren } from 'react';

import { DetailAccordionShell } from '@/components/detail-accordion-shell';

type LawyerDetailAccordionShellProps = PropsWithChildren<{
  title: string;
  initiallyOpen?: boolean;
}>;

export function LawyerDetailAccordionShell({
  title,
  initiallyOpen = false,
  children,
}: LawyerDetailAccordionShellProps) {
  return (
    <DetailAccordionShell initiallyOpen={initiallyOpen} title={title}>
      {children}
    </DetailAccordionShell>
  );
}
