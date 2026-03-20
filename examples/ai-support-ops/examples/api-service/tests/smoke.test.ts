import { config } from '@/config';

describe('smoke', () => {
  it('loads configuration defaults', () => {
    expect(config.port).toBeGreaterThan(0);
    expect(config.env).toBeTruthy();
  });
});
