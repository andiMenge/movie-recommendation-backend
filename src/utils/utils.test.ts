const { isDevEnvironment } = require('./utils')

test('dev environment should be true', () => {
  expect(isDevEnvironment('development')).toBeTruthy()
})
