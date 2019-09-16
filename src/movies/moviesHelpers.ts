import { MovieSchema, MovieModel } from './moviesModels'
import * as mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { config } from '../config/config'

const movie = mongoose.model<MovieModel>('Movie', MovieSchema)
const apisecret: string = config.get('secrets.authKey')

export async function isDuplicate(id: string): Promise<boolean> {
  try {
    const result = await movie.findOne({ imdb_id: id })
    if (result === null) {
      return false
    } else {
      return true
    }
  } catch (error) {
    console.log(error.message)
    throw new Error('find movie in db failed')
  }
}

export async function getImdbIDfromImdbURL(url: String) {
  const imdbID = url.substring(27, 36)
  return imdbID
}

export function validateAPIKey(req: Request, res: Response, next: NextFunction): void {
  if (req.query.key === apisecret) {
    next()
  } else {
    res.sendStatus(401)
  }
}
