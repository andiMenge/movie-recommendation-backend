import mongoose from 'mongoose'
import { config } from '../config/config'

const mongoHost = config.get('db.host')
const mongoUrl: string = `mongodb://${mongoHost}/movie-favs`

export async function dbInit() {
  mongoose.set('useFindAndModify', false)
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true })
  } catch (error) {
    throw new Error(error.message)
  }
}
