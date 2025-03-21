const { Transform } = require("supertest/lib/test");

module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/config/',
      '/tests/'
    ],
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    testTimeout: 10000
    //setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
  };