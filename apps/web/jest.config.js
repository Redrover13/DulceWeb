module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@dulce/ui(.*)$': '<rootDir>/../../packages/ui$1',
    '^@dulce/utils(.*)$': '<rootDir>/../../packages/utils$1',
    '^@dulce/types(.*)$': '<rootDir>/../../packages/types$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
