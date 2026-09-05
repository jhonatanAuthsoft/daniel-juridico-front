import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { SOLICITATION_STATUS_META } from '@/components/client-solicitation-card';

import { LawyerSolicitationCard } from './lawyer-solicitation-card.component';
import type { LawyerSolicitationCardData } from './mock-lawyer-solicitations';

function cardData(
  overrides: Partial<LawyerSolicitationCardData> = {},
): LawyerSolicitationCardData {
  return {
    id: 'cx-1',
    clientName: 'Luiza Sampaio',
    status: 'urgente',
    description: 'Preciso de orientação sobre rescisão de contrato de aluguel.',
    timeLabel: '25/06/2026',
    timeKind: 'absolute',
    location: 'Salvador - Bahia',
    specialty: 'Direito do Consumidor',
    isUnviewed: true,
    ...overrides,
  };
}

function accentColor(style: unknown): string | undefined {
  return StyleSheet.flatten(style as never)?.backgroundColor as string | undefined;
}

describe('LawyerSolicitationCard', () => {
  it('marks a never opened solicitation with a side accent in the urgency color', () => {
    const screen = render(<LawyerSolicitationCard {...cardData()} />);

    const accent = screen.getByTestId('solicitation-card-accent');
    expect(accentColor(accent.props.style)).toBe(
      SOLICITATION_STATUS_META.urgente.accentColor,
    );
  });

  it('follows the urgency color of an emergency solicitation', () => {
    const screen = render(
      <LawyerSolicitationCard {...cardData({ status: 'emergencia' })} />,
    );

    expect(accentColor(screen.getByTestId('solicitation-card-accent').props.style)).toBe(
      SOLICITATION_STATUS_META.emergencia.accentColor,
    );
  });

  it('drops the accent once the solicitation has been opened', () => {
    const screen = render(
      <LawyerSolicitationCard {...cardData({ isUnviewed: false })} />,
    );

    expect(screen.queryByTestId('solicitation-card-accent')).toBeNull();
  });
});
