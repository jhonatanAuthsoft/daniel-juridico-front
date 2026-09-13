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
    if (existing) {
      existing.cities = normalizeCities([...existing.cities, ...entry.cities]);
      continue;
    }

    byState.set(state, {
      state,
      cities: normalizeCities(entry.cities),
    });
  }

  return [...byState.values()].filter((entry) => entry.cities.length > 0);
}

export function addCityToServiceAreas(
  entries: ServiceAreaEntry[],
  state: string,
  city: string,
): ServiceAreaEntry[] {
  return mergeServiceAreasByState([...entries, { state, cities: [city] }]);
}

export function formatServiceAreaCities(cities: string[]): string {
  return normalizeCities(cities).join('; ');
}

export function formatServiceAreaHubSummary(entries: ServiceAreaEntry[]): string {
  return mergeServiceAreasByState(entries)
    .map((entry) => `${entry.state}: ${formatServiceAreaCities(entry.cities)}`)
    .join(' · ');
}
