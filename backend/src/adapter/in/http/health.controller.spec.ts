import { HealthController } from './health.controller';

describe('HealthController', () => {
  const controller = new HealthController();

  it('returns a healthy status', () => {
    const response = controller.check();

    expect(response.code).toBe('OK');
    expect(response.data).toEqual({ status: 'up' });
  });
});
