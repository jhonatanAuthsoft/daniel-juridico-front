import { mapLawyerReviewsWireToResult } from './reviews.mapper';
import type { LawyerReviewsListWire } from './reviews.types';

const sampleWire: LawyerReviewsListWire = {
  items: [
    {
      id: 'rev-1',
      nota: 4.5,
      comentario: 'Atendimento claro.',
      nomeAvaliador: 'Ana Souza',
      criadoEm: '2026-08-01T12:00:00',
      propria: true,
    },
    {
      id: 'rev-2',
      nota: '5.0',
      comentario: 'Excelente.',
      nomeAvaliador: 'Bruno Lima',
      criadoEm: '2026-07-20T09:00:00',
      propria: false,
    },
  ],
  mediaAvaliacoes: 4.8,
  totalAvaliacoes: 2,
};

describe('mapLawyerReviewsWireToResult', () => {
  it('maps review items and aggregates', () => {
    const result = mapLawyerReviewsWireToResult(sampleWire);

    expect(result.total).toBe(2);
    expect(result.averageRating).toBe(4.8);
    expect(result.items).toEqual([
      {
        id: 'rev-1',
        rating: 4.5,
        comment: 'Atendimento claro.',
        reviewerName: 'Ana Souza',
        createdAt: '2026-08-01T12:00:00',
        isOwn: true,
      },
      {
        id: 'rev-2',
        rating: 5,
        comment: 'Excelente.',
        reviewerName: 'Bruno Lima',
        createdAt: '2026-07-20T09:00:00',
        isOwn: false,
      },
    ]);
  });

  it('returns empty list when there are no reviews', () => {
    const result = mapLawyerReviewsWireToResult({
      items: [],
      mediaAvaliacoes: 0,
      totalAvaliacoes: 0,
    });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.averageRating).toBe(0);
  });
});
