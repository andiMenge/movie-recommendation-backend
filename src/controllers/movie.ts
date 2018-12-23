import * as mongoose from 'mongoose';
import { MovieSchema, Movie } from '../models/movie';
import { Request, Response } from 'express';
import * as needle from 'needle';
import { tmdbFindMovieResponse, Movieresult } from '../models/tmdb';

const Movie = mongoose.model('Movie', MovieSchema);
const tmdbUrl = 'https://api.themoviedb.org/3/'
const tmdbEndpoint = 'find'
const tmdbApiKey = process.env.TMDB_API_KEY
const tmdbThumbnailURL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

interface InputData {
  url: string
}

export class MovieController {

  public async createMovie (req: Request, res: Response) {
    const inputData: InputData = req.body
    const imdbURL = inputData.url
    const tmdbResponse: tmdbFindMovieResponse  = await this.getMovieDetails(this.getImdbIDfromImdbURL(imdbURL))
    const tmdbMovieDetails: Movieresult = tmdbResponse.movie_results[0]
    const movie = this.constructMovie(tmdbMovieDetails, imdbURL)
    console.log(movie)
    res.sendStatus(200)

    // res.json(movieDetails)
    // newMovie.save((err, movie) => {
    //   if(err){
    //       res.send(err);
    //   }    
    //   res.json(movie);
    // });
  }

  public getMovies (req: Request, res: Response) {           
    Movie.find({}, (err, contact) => {
      if(err){
          res.send(err);
      }
      res.json(contact);
    });
  }

  private async getMovieDetails(id: String) {
    const url = `${tmdbUrl}${tmdbEndpoint}/${id}?api_key=${tmdbApiKey}&language=en-US&external_source=imdb_id`
    try {
      const resp = await needle('get', url)
      return resp.body
    } catch (error) {
      console.log(error.message);
    }
  }

  private getImdbIDfromImdbURL(url: String) {
    const imdbID = url.substring(27,36)
    return imdbID
  }

  private constructMovie(tmdbMovieDetails: Movieresult, imdbURL: string): Movie {
    const movie: Movie = new Movie();
    try {
      movie.original_title = tmdbMovieDetails.original_title
      movie.image_url = `${tmdbThumbnailURL}${tmdbMovieDetails.poster_path}`
      movie.is_highlight = false
      movie.imdb_id = imdbURL
      movie.release_date = tmdbMovieDetails.release_date
      return movie
    } catch (error) {
      console.log(error)
    }
  }
}