import { MovieSchema, MovieModel } from './moviesModels'
import * as mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { config } from '../config/config'
import url from 'url'

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

export async function getImdbIDfromImdbURL(url: string) {
  try {
    const urlPath = new URL(url).pathname
    const splittedUrlPath = urlPath.split('/', 3)
    const imdbID = splittedUrlPath[splittedUrlPath.length - 1]

    if (imdbID === undefined || imdbID === '') {
      throw new Error(`Could not parse imdb ID from this url: ${url}`)
    }

    return imdbID
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function validateAPIKey(req: Request, res: Response, next: NextFunction): void {
  if (req.query.key === apisecret) {
    next()
  } else {
    res.sendStatus(401)
  }
}
