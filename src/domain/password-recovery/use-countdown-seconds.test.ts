import { formatCountdownLabel } from './use-countdown-seconds';

describe('formatCountdownLabel', () => {
  it('formats seconds under one minute', () => {
    expect(formatCountdownLabel(0)).toBe('0s');
    expect(formatCountdownLabel(5)).toBe('5s');
    expect(formatCountdownLabel(59)).toBe('59s');
  });

  it('formats whole minutes', () => {
    expect(formatCountdownLabel(60)).toBe('1 min');
    expect(formatCountdownLabel(120)).toBe('2 min');
  });

  it('formats minutes with remaining seconds', () => {
    expect(formatCountdownLabel(90)).toBe('1 min 30s');
    expect(formatCountdownLabel(125)).toBe('2 min 5s');
  });
});
