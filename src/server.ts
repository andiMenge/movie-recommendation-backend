import { app } from './app'
import { dbInit } from './db/db'
import { createInitialFeed } from './feed/feed'

const PORT = 3000

app.listen(PORT, async () => {
  console.log('Initializing DB..')
  try {
    await dbInit()
    createInitialFeed()
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
  console.log('Express server listening on port ' + PORT)
})
