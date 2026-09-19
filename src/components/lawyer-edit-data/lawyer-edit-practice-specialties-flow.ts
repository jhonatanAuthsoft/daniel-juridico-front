import { shouldShowSpecialtiesStep } from '@/components/signup-lawyer/signup-step-navigation';

export const PENDING_PRACTICE_AREAS_PARAM = 'pendingPracticeAreas';

export function needsSpecialtiesBeforeSavingPracticeAreas(
  practiceAreas: readonly string[],
  existingSpecialties: readonly string[],
): boolean {
  return (
    shouldShowSpecialtiesStep(practiceAreas) && existingSpecialties.length === 0
  );
}

export function encodePendingPracticeAreas(
  practiceAreas: readonly string[],
): string {
  return practiceAreas.filter((id) => id.trim().length > 0).join(',');
}

export function decodePendingPracticeAreas(
  raw: string | string[] | undefined,
): string[] {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value?.trim()) {
    return [];
  }
  return value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

export function specialtiesEditHref(practiceAreas: readonly string[]) {
  return {
    pathname: '/lawyer/perfil/especializacao' as const,
    params: {
      [PENDING_PRACTICE_AREAS_PARAM]: encodePendingPracticeAreas(practiceAreas),
    },
  };
}
