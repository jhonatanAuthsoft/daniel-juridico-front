import type { PropsWithChildren } from 'react';

import { DetailAccordionShell } from '@/components/detail-accordion-shell';

type ClientDetailAccordionShellProps = PropsWithChildren<{
  title: string;
  initiallyOpen?: boolean;
}>;

export function ClientDetailAccordionShell({
  title,
  initiallyOpen = false,
  children,
}: ClientDetailAccordionShellProps) {
  return (
    <DetailAccordionShell
      initiallyOpen={initiallyOpen}
      showDivider
      title={title}>
      {children}
    </DetailAccordionShell>
  );
}
