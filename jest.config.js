export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'babel-jest',
      {
        presets: [['@babel/preset-typescript', { onlyRemoveTypeImports: true }]],
      },
    ],
  },
  moduleNameMapper: {
    '\\.css(?:\\?inline)?$': '<rootDir>/test/unit/style-stub.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/autocomplete/**/*.ts',
    '!src/autocomplete/index.ts',
    '!src/autocomplete/types.ts',
  ],
  coverageDirectory: 'coverage',
  clearMocks: true,
};
