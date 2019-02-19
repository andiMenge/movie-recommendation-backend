import * as mongoose from 'mongoose';
import { MovieSchema, MovieModel, MovieResponse, InputData } from './moviesModels';
import { Movieresult } from '../tmdb/tmdbModels'
import Tmdb from '../tmdb/tmdb'

const movie = mongoose.model<MovieModel>('Movie', MovieSchema);
const tmdb = new Tmdb

export async function saveMovie(id:string): Promise<MovieModel> {
  const movieInfo: Movieresult = await tmdb.getMovieInfo(id)
  const newMovie = new movie({
    original_title: movieInfo.original_title,
    imdb_id: id,
    release_date: movieInfo.release_date,
    is_highlight: false,
    image_url: `${tmdb.tmdbThumbnailURL}${movieInfo.poster_path}`
  })

  const duplicate = await isDuplicate(id)
  if (!duplicate) {
    newMovie.save()
    return newMovie
  } else {
    console.log('Movie is duplicate, not saving') 
  }
}

export async function readMovies() {
  const result = await movie.find({}).sort({ release_date: -1 })
  return result
}

async function isDuplicate(id: string): Promise<boolean> {
  try {
    const result = await movie.findOne({ imdb_id: id })
    if(result === null) {
      return false
    } else {
      return true
    }
  } catch (error) {
  console.log(error)
  }
}
