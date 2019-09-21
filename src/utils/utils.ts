export function isDevEnvironment(env: string): boolean {
  if (env === 'development') {
    return true
  }
  return false
}
