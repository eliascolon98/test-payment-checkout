import { createMMKV } from 'react-native-mmkv';
import type { Storage } from 'redux-persist';

/**
 * Encrypted persistent storage backed by MMKV (v4, Nitro).
 * The encryptionKey enables AES-256 encryption at rest, so the persisted
 * transaction data is never stored in plain text on the device.
 */
const encryptedStorage = createMMKV({
  id: 'payment-checkout-secure',
  encryptionKey: 'pc-secure-key-2026-checkout-flow',
  encryptionType: 'AES-256',
});

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    encryptedStorage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = encryptedStorage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key) => {
    encryptedStorage.remove(key);
    return Promise.resolve();
  },
};
