import convict = require('convict')
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// For local developer experience load in variables from .env file if present
dotenv.config({ path: resolve(__dirname, '../../.env') })

convict.addFormat({
  name: 'not-empty-string',
  validate: function(val) {
    if (val == '') {
      throw new Error(`Config cannot be empty`)
    }
  },
})

// Add config vars here
export const config = convict({
  tmdb: {
    token: {
      doc: 'Access token for TMDB',
      format: 'not-empty-string',
      default: '',
      env: 'TMDB_API_KEY',
      sensitive: true,
    },
  },
  secrets: {
    authKey: {
      doc: 'Access token for this API',
      format: 'not-empty-string',
      default: '',
      env: 'AUTH_KEY',
      sensitive: true,
    },
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: 'not-empty-string',
      default: 'localhost',
      env: 'MONGO_DB_HOST',
      sensitive: true,
    },
  },
  slack: {
    webhookURL: {
      doc: 'URL for slack channel to post to',
      format: 'not-empty-string',
      default: '',
      env: 'SLACK_WEBHOOK_URL',
      sensitive: true,
    },
  },
  node: {
    nodeEnv: {
      doc: 'Node.js environment',
      format: 'not-empty-string',
      default: 'development',
      env: 'NODE_ENV',
      sensitive: false,
    },
  },
})

try {
  config.validate({ allowed: 'strict' })
} catch (error) {
  console.log(error.message)
  process.exit(1)
}
