import { reduxStorage } from './secure-storage';

describe('reduxStorage (encrypted MMKV adapter)', () => {
  it('sets, gets and removes items', async () => {
    await reduxStorage.setItem('key', 'value');
    await expect(reduxStorage.getItem('key')).resolves.toBe('value');

    await reduxStorage.removeItem('key');
    await expect(reduxStorage.getItem('key')).resolves.toBeNull();
  });

  it('returns null for a missing key', async () => {
    await expect(reduxStorage.getItem('missing')).resolves.toBeNull();
  });
});
