import express from 'express'
import { Request, Response, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { createInitialFeed } from './feed/feed'
import { router } from './router'

const mongoHost = process.env.MONGO_DB_HOST
const mongoUrl: string = `mongodb://${mongoHost}/movie-favs`
export const app = express()

function init() {
  try {
    mongoose.set('useFindAndModify', false)
    mongoose.connect(mongoUrl, { useNewUrlParser: true })
    createInitialFeed()
  } catch (error) {
    console.error(error.message)
    throw new Error('App initilization failed')
  }
}

init()

// Custom error handler
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
}

// Default route
function defaultRoute(req: Request, res: Response, next: NextFunction) {
  res.sendStatus(404)
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use('/', router)
app.use(defaultRoute) // default route has to be last route
app.use(errorHandler) // Error handler goes last
