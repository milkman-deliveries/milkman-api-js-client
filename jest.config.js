module.exports = {
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/assetsTransformer.js',
    '\\.(css)$': '<rootDir>/tests/mocks/styleMocks.js',
  },
  testMatch: ['**/?(*.)+(test).js'],
  testEnvironment: 'jsdom',
  // setupFilesAfterEnv: ['<rootDir>/tests/testsAfterEnv.setup.js'],
  setupFiles: ['<rootDir>/tests/setupFiles.js'],
}
