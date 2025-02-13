module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/config/',
      '/tests/'
    ],
    testTimeout: 10000,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
  };