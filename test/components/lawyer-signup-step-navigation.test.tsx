import {
  getNextLawyerSignupStep,
  getPreviousLawyerSignupStep,
  shouldShowSpecialtiesStep,
} from '@/components/signup-lawyer/signup-step-navigation';

describe('lawyer signup step navigation', () => {
  it('shows specialties only when none-of-the-above is selected', () => {
    expect(shouldShowSpecialtiesStep(['none'])).toBe(true);
    expect(shouldShowSpecialtiesStep(['pautista'])).toBe(false);
    expect(shouldShowSpecialtiesStep([])).toBe(false);
  });

  it('skips step 7 when going forward without none-of-the-above', () => {
    expect(getNextLawyerSignupStep(6, ['pautista'], 10)).toBe(8);
    expect(getNextLawyerSignupStep(6, ['none'], 10)).toBe(7);
    expect(getNextLawyerSignupStep(7, ['none'], 10)).toBe(8);
    expect(getNextLawyerSignupStep(10, ['none'], 10)).toBe('done');
  });

  it('skips step 7 when going back without none-of-the-above', () => {
    expect(getPreviousLawyerSignupStep(8, ['pautista'])).toBe(6);
    expect(getPreviousLawyerSignupStep(8, ['none'])).toBe(7);
    expect(getPreviousLawyerSignupStep(7, ['none'])).toBe(6);
    expect(getPreviousLawyerSignupStep(1, [])).toBe(1);
  });

  it('goes to specialties when none-of-the-above is the only selection', () => {
    expect(getNextLawyerSignupStep(6, ['none'], 10)).toBe(7);
  });
});
