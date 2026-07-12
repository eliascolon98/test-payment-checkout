import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Android emulators cannot reach the host machine through "localhost"
 * (that points to the emulator itself). 10.0.2.2 is the special alias
 * that maps to the host's localhost. iOS simulators can use localhost.
 */
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const api = axios.create({
  baseURL: `http://${HOST}:3001`,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});
