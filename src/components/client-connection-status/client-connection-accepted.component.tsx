import { Body1, Heading1 } from '@/atomic/typography';
import { UnlockedContactActions } from '@/components/unlocked-contacts/unlocked-contact-actions.component';
import { BrandColors } from '@/constants/theme';

import { ClientConnectionStatusCard } from './client-connection-status-card.component';

type ClientConnectionAcceptedProps = {
  phone: string;
  email: string;
};

export function ClientConnectionAccepted({
  phone,
  email,
}: ClientConnectionAcceptedProps) {
  return (
    <ClientConnectionStatusCard>
      <Heading1 color={BrandColors.neutral.white}>Solicitação aceita</Heading1>
      <Body1 color={BrandColors.neutral.white}>
        Entre em contato com o(a) advogado(a)
      </Body1>
      <UnlockedContactActions email={email} phone={phone} />
    </ClientConnectionStatusCard>
  );
}
