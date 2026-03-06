module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/services/**/*.test.js'],
  collectCoverageFrom: [
    'src/services/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/models/',
    '/src/controllers/',
    '/src/routes/',
    '/src/middlewares/',
    '/src/config/'
  ],
  verbose: true
};
