import type { ServiceAreaEntry } from '@/components/signup-lawyer/types';
import { resolveUfFromStateValue } from '@/constants/select-options';

export function normalizeCities(cities: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const city of cities) {
    const trimmed = city.trim();
    const key = trimmed.toLocaleLowerCase('pt-BR');
    if (!trimmed || seen.has(key)) {
      continue;
    }
    seen.add(key);
    normalized.push(trimmed);
  }

  return normalized.sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function mergeServiceAreasByState(entries: ServiceAreaEntry[]): ServiceAreaEntry[] {
  const byState = new Map<string, ServiceAreaEntry>();

  for (const entry of entries) {
    const state = resolveUfFromStateValue(entry.state);
    if (state.length !== 2) {
      continue;
    }

    const existing = byState.get(state);
    if (entry.entireState || existing?.entireState) {
      byState.set(state, { state, cities: [], entireState: true });
      continue;
    }

    if (existing) {
      existing.cities = normalizeCities([...existing.cities, ...entry.cities]);
      continue;
    }

    byState.set(state, {
      state,
      cities: normalizeCities(entry.cities),
    });
  }

  return [...byState.values()].filter(
    (entry) => entry.entireState || entry.cities.length > 0,
  );
}

export function addCitiesToServiceAreas(
  entries: ServiceAreaEntry[],
  state: string,
  cities: string[],
): ServiceAreaEntry[] {
  const uf = resolveUfFromStateValue(state);
  const withoutEntireState = entries.map((entry) =>
    resolveUfFromStateValue(entry.state) === uf
      ? { ...entry, entireState: false }
      : entry,
  );
  return mergeServiceAreasByState([...withoutEntireState, { state, cities }]);
}

export function addCityToServiceAreas(
  entries: ServiceAreaEntry[],
  state: string,
  city: string,
): ServiceAreaEntry[] {
  return addCitiesToServiceAreas(entries, state, [city]);
}

export function replaceServiceAreaCities(
  entries: ServiceAreaEntry[],
  state: string,
  cities: string[],
): ServiceAreaEntry[] {
  const uf = resolveUfFromStateValue(state);
  return mergeServiceAreasByState([
    ...entries.filter((entry) => resolveUfFromStateValue(entry.state) !== uf),
    { state, cities },
  ]);
}

export function setEntireStateServiceArea(
  entries: ServiceAreaEntry[],
  state: string,
): ServiceAreaEntry[] {
  const uf = resolveUfFromStateValue(state);
  return mergeServiceAreasByState([
    ...entries.filter((entry) => resolveUfFromStateValue(entry.state) !== uf),
    { state, cities: [], entireState: true },
  ]);
}

export function formatServiceAreaCities(cities: string[]): string {
  return normalizeCities(cities).join('; ');
}

export function formatServiceAreaSummary(entry: ServiceAreaEntry): string {
  if (entry.entireState) {
    return 'Todo o estado';
  }
  return formatServiceAreaCities(entry.cities);
}

export function formatServiceAreaHubSummary(entries: ServiceAreaEntry[]): string {
  return mergeServiceAreasByState(entries)
    .map((entry) =>
      entry.entireState
        ? `${entry.state}: todo o estado`
        : `${entry.state}: ${formatServiceAreaCities(entry.cities)}`,
    )
    .join(' · ');
}
