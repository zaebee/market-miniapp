const fs = require('fs');
const path = require('path');

// Load environment variables from .env.test if it exists
const testEnvPath = path.resolve(__dirname, '.env.test');
if (fs.existsSync(testEnvPath)) {
  require('dotenv').config({ path: testEnvPath });
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/.tmp/', 
    '/build/', 
    '/dist/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
};
