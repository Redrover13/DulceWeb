module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@dulce/ui(.*)$': '<rootDir>/../../packages/ui$1',
    '^@dulce/utils(.*)$': '<rootDir>/../../packages/utils$1',
    '^@dulce/types(.*)$': '<rootDir>/../../packages/types$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.(ts|tsx|js|jsx)', '**/*.(test|spec).(ts|tsx|js|jsx)'],
  collectCoverageFrom: [
    'pages/**/*.(ts|tsx)',
    'components/**/*.(ts|tsx)',
    '!**/*.d.ts',
  ],
};
