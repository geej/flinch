module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  coverageDirectory: './coverage',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/dist/'
  ]
};
