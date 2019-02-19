import { MovieResponse, InputData } from './moviesModels';
import { Request, Response } from 'express';
import { saveMovie, readMovies } from '../movies/movies'

export class MovieController {

  public async createMovie(req: Request, res: Response) {
    try {
      const inputData: InputData = req.body
      const imdbURL = inputData.url
      const imdbID = this.getImdbIDfromImdbURL(imdbURL)
      const movie = await saveMovie(imdbID)
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
        movies: movies
      }
      res.json(movieResponse)
    } catch (error) {
      res.sendStatus(500)
      console.log(error)
    }
  }

  private getImdbIDfromImdbURL(url: String) {
    const imdbID = url.substring(27, 36)
    return imdbID
  }

}