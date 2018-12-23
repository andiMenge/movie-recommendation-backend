import * as mongoose from 'mongoose';
import { MovieSchema } from '../models/movie';
import { Request, Response } from 'express';
import * as needle from 'needle';
import { json } from 'body-parser';

const Movie = mongoose.model('Movie', MovieSchema);

const tmdbUrl = 'https://api.themoviedb.org/3/'
const tmdbEndpoint = 'find'
const tmdbApiKey = process.env.TMDB_API_KEY

interface inputData {
  url: string
}

export class MovieController {

  public async createMovie (req: Request, res: Response) {
    const inputData: inputData = req.body
    const imdbURL = inputData.url
    const movieDetails = await this.getMovieDetails(this.getImdbIDfromImdbURL(imdbURL))
    res.json(movieDetails)
    // let newMovie = new Movie(req.body);

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
}