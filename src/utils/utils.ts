import { config } from '../config/config'

const environment: string = config.get('node.nodeEnv')

export function isDevEnvironment(): boolean {
  if (environment === 'development') {
    return true
  }
  return false
}
