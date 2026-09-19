import {
  decodePendingPracticeAreas,
  encodePendingPracticeAreas,
  needsSpecialtiesBeforeSavingPracticeAreas,
  specialtiesEditHref,
} from './lawyer-edit-practice-specialties-flow';

describe('needsSpecialtiesBeforeSavingPracticeAreas', () => {
  it('is true when none is selected and the profile has no specialties', () => {
    expect(needsSpecialtiesBeforeSavingPracticeAreas(['none'], [])).toBe(true);
  });

  it('is false when none is selected but specialties already exist', () => {
    expect(
      needsSpecialtiesBeforeSavingPracticeAreas(['none'], ['CIVIL:CONTRATOS']),
    ).toBe(false);
  });

  it('is false for broad practice areas even without specialties', () => {
    expect(needsSpecialtiesBeforeSavingPracticeAreas(['pautista'], [])).toBe(
      false,
    );
  });
});

describe('pending practice areas param', () => {
  it('round-trips a single practice area id', () => {
    expect(decodePendingPracticeAreas(encodePendingPracticeAreas(['none']))).toEqual([
      'none',
    ]);
  });

  it('treats a missing param as no pending change', () => {
    expect(decodePendingPracticeAreas(undefined)).toEqual([]);
    expect(decodePendingPracticeAreas('')).toEqual([]);
  });
});

describe('specialtiesEditHref', () => {
  it('sends the pending practice areas to the specialties screen', () => {
    expect(specialtiesEditHref(['none'])).toEqual({
      pathname: '/lawyer/perfil/especializacao',
      params: { pendingPracticeAreas: 'none' },
    });
  });
});
