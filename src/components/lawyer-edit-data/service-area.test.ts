import type { ServiceAreaEntry } from '@/components/signup-lawyer/types';

import {
  addCityToServiceAreas,
  formatServiceAreaCities,
  formatServiceAreaHubSummary,
  mergeServiceAreasByState,
  normalizeCities,
} from './service-area';

const sp: ServiceAreaEntry = {
  state: 'SP',
  cities: ['Adamantina', 'Avaré'],
};

describe('normalizeCities', () => {
  it('trims, deduplicates and sorts city names', () => {
    expect(normalizeCities([' Avaré ', 'Adamantina', 'avaré', 'Adamantina'])).toEqual([
      'Adamantina',
      'Avaré',
    ]);
  });
});

describe('mergeServiceAreasByState', () => {
  it('keeps one entry per state and merges cities', () => {
    expect(
      mergeServiceAreasByState([
        { state: 'SP', cities: ['Avaré'] },
        { state: 'BA', cities: ['Salvador'] },
        { state: 'SP', cities: ['Adamantina'] },
      ]),
    ).toEqual([
      { state: 'SP', cities: ['Adamantina', 'Avaré'] },
      { state: 'BA', cities: ['Salvador'] },
    ]);
  });
});

describe('addCityToServiceAreas', () => {
  it('creates a new state group when needed', () => {
    expect(addCityToServiceAreas([], 'SP', 'Adamantina')).toEqual([
      { state: 'SP', cities: ['Adamantina'] },
    ]);
  });

  it('appends a city to an existing state', () => {
    expect(addCityToServiceAreas([{ state: 'SP', cities: ['Adamantina'] }], 'SP', 'Avaré')).toEqual([
      { state: 'SP', cities: ['Adamantina', 'Avaré'] },
    ]);
  });
});

describe('formatServiceAreaHubSummary', () => {
  it('formats the hub subtitle as UF: cities', () => {
    expect(formatServiceAreaHubSummary([sp])).toBe('SP: Adamantina; Avaré');
  });

  it('joins multiple states', () => {
    expect(
      formatServiceAreaHubSummary([sp, { state: 'BA', cities: ['Salvador'] }]),
    ).toBe('SP: Adamantina; Avaré · BA: Salvador');
  });

  it('returns an empty string when there are no cities', () => {
    expect(formatServiceAreaHubSummary([])).toBe('');
  });
});

describe('formatServiceAreaCities', () => {
  it('joins every city with a semicolon', () => {
    expect(formatServiceAreaCities(['Adamantina', 'Avaré', 'Campinas'])).toBe(
      'Adamantina; Avaré; Campinas',
    );
  });
});
