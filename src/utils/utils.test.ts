import { isDevEnvironment } from './utils'

test('dev environment should be true', () => {
  expect(isDevEnvironment('development')).toBeTruthy()
})
