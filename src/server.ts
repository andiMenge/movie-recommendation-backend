import { s3Init } from './s3/s3'
import { app } from './app'
import { dbInit } from './db/db'
import { createInitialFeed } from './feed/feed'

const PORT = 3000

app.listen(PORT, async () => {
  try {
    console.log('Initializing DB..')
    await dbInit()
    await s3Init()
    createInitialFeed()
    console.log('Express server listening on port ' + PORT)
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
})
