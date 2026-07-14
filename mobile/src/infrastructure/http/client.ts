import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Cloud backend (Railway) used by release builds — the distributed APK works
 * out of the box without a local server.
 */
const PRODUCTION_API_URL =
  'https://test-payment-checkout-production.up.railway.app';

/**
 * Local backend used in development (Metro). Android emulators cannot reach the
 * host through "localhost" (that points to the emulator itself); 10.0.2.2 is the
 * special alias that maps to the host's localhost. iOS simulators use localhost.
 */
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const DEVELOPMENT_API_URL = `http://${LOCAL_HOST}:3001`;

export const api = axios.create({
  baseURL: __DEV__ ? DEVELOPMENT_API_URL : PRODUCTION_API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});
