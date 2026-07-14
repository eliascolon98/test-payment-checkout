module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-native-community|@react-navigation|react-native-.*|@reduxjs/toolkit|immer|redux|redux-persist|reselect|react-redux)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/**/*.type.ts',
    '!src/domain/models/**',
    '!src/domain/ports/**',
    '!src/presentation/theme/**',
    '!src/presentation/navigation/**',
    '!src/infrastructure/http/client.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
