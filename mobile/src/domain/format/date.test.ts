import { formatDateTime } from './date';

describe('formatDateTime', () => {
  it('formats an ISO date', () => {
    const result = formatDateTime('2026-07-13T09:05:00');
    expect(result).toContain('13 Jul 2026');
    expect(result).toMatch(/\d{2}:\d{2}$/);
  });

  it('returns empty string for invalid input', () => {
    expect(formatDateTime('not-a-date')).toBe('');
  });
});
