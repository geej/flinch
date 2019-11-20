module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/dist/'
  ]
};
