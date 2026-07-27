export const PRACTICE_AREA_NONE_ID = 'none';

export function shouldShowSpecialtiesStep(
  practiceAreas: readonly string[] | undefined,
): boolean {
  return (practiceAreas ?? []).includes(PRACTICE_AREA_NONE_ID);
}

export function getNextLawyerSignupStep(
  currentStep: number,
  practiceAreas: readonly string[] | undefined,
  totalSteps: number,
): number | 'done' {
  if (currentStep >= totalSteps) {
    return 'done';
  }

  const next = currentStep + 1;
  if (next === 7 && !shouldShowSpecialtiesStep(practiceAreas)) {
    return 8;
  }

  return next;
}

export function getPreviousLawyerSignupStep(
  currentStep: number,
  practiceAreas: readonly string[] | undefined,
): number {
  if (currentStep <= 1) {
    return 1;
  }

  const previous = currentStep - 1;
  if (previous === 7 && !shouldShowSpecialtiesStep(practiceAreas)) {
    return 6;
  }

  return previous;
}
