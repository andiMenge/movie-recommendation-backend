import { MovieResponse, InputData, MovieModel } from './moviesModels'
import { Request, Response } from 'express'
import { saveMovie, readMovies, updateMovie, notify } from './movies'
import { getImdbIDfromImdbURL } from './moviesHelpers'

export class MovieController {
  public async createMovie(req: Request, res: Response) {
    try {
      const inputData: InputData = req.body
      const imdbURL = inputData.url
      const imdbID = await getImdbIDfromImdbURL(imdbURL)
      const movie = await saveMovie(imdbID)
      await notify(movie)
      res.send(movie)
    } catch (error) {
      res.sendStatus(500)
      console.log(error)
    }
  }

  public async getMovies(req: Request, res: Response) {
    try {
      const movies = await readMovies()
      const movieResponse: MovieResponse = {
        movies: movies,
      }
      res.json(movieResponse)
    } catch (error) {
      res.sendStatus(500)
      console.log(error)
    }
  }

  public async updateMovie(req: Request, res: Response) {
    try {
      const newMovie: MovieModel = req.body
      const updatedMovie = await updateMovie(req.params.id, newMovie)
      res.json(updatedMovie)
    } catch (error) {
      res.sendStatus(500)
      console.log(error)
    }
  }
}
