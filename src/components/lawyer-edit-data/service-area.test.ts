import type { ServiceAreaEntry } from '@/components/signup-lawyer/types';

import {
  addCitiesToServiceAreas,
  addCityToServiceAreas,
  formatServiceAreaCities,
  formatServiceAreaHubSummary,
  formatServiceAreaSummary,
  mergeServiceAreasByState,
  normalizeCities,
  replaceServiceAreaCities,
  setEntireStateServiceArea,
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

  it('keeps entire-state coverage and drops cities of that UF', () => {
    expect(
      mergeServiceAreasByState([
        { state: 'SP', cities: ['Avaré'] },
        { state: 'SP', cities: [], entireState: true },
        { state: 'BA', cities: ['Salvador'] },
      ]),
    ).toEqual([
      { state: 'SP', cities: [], entireState: true },
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

  it('replaces entire-state coverage when a city is added', () => {
    expect(
      addCityToServiceAreas([{ state: 'SP', cities: [], entireState: true }], 'SP', 'Campinas'),
    ).toEqual([{ state: 'SP', cities: ['Campinas'] }]);
  });
});

describe('addCitiesToServiceAreas', () => {
  it('adds several cities to the same state', () => {
    expect(addCitiesToServiceAreas([], 'SP', ['Campinas', 'Avaré'])).toEqual([
      { state: 'SP', cities: ['Avaré', 'Campinas'] },
    ]);
  });
});

describe('replaceServiceAreaCities', () => {
  it('replaces the cities of that UF', () => {
    expect(
      replaceServiceAreaCities([{ state: 'SP', cities: ['Adamantina', 'Avaré'] }], 'SP', [
        'Campinas',
      ]),
    ).toEqual([{ state: 'SP', cities: ['Campinas'] }]);
  });
});

describe('setEntireStateServiceArea', () => {
  it('marks the UF as entire state and drops its cities', () => {
    expect(
      setEntireStateServiceArea(
        [
          { state: 'SP', cities: ['Adamantina', 'Avaré'] },
          { state: 'BA', cities: ['Salvador'] },
        ],
        'SP',
      ),
    ).toEqual([
      { state: 'BA', cities: ['Salvador'] },
      { state: 'SP', cities: [], entireState: true },
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

  it('formats entire-state coverage', () => {
    expect(
      formatServiceAreaHubSummary([{ state: 'SP', cities: [], entireState: true }]),
    ).toBe('SP: todo o estado');
  });
});

describe('formatServiceAreaSummary', () => {
  it('uses Todo o estado when the UF is fully covered', () => {
    expect(formatServiceAreaSummary({ state: 'SP', cities: [], entireState: true })).toBe(
      'Todo o estado',
    );
  });
});

describe('formatServiceAreaCities', () => {
  it('joins every city with a semicolon', () => {
    expect(formatServiceAreaCities(['Adamantina', 'Avaré', 'Campinas'])).toBe(
      'Adamantina; Avaré; Campinas',
    );
  });
});
