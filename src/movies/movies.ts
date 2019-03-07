import * as mongoose from 'mongoose';
import { MovieSchema, MovieModel } from './moviesModels';
import { Movieresult } from '../tmdb/tmdbModels'
import Tmdb from '../tmdb/tmdb'
import { isDuplicate } from './moviesHelpers'

const movie = mongoose.model<MovieModel>('Movie', MovieSchema);
const tmdb = new Tmdb

export async function saveMovie(id:string): Promise<MovieModel> {
  try {
    const movieInfo: Movieresult = await tmdb.getMovieInfo(id)
    const genres = await tmdb.getGenreNamesfromGenreIds(movieInfo.genre_ids)
    const newMovie = new movie({
      original_title: movieInfo.title,
      imdb_id: id,
      release_date: movieInfo.release_date,
      is_highlight: false,
      image_url: `${tmdb.tmdbThumbnailURL}${movieInfo.poster_path}`,
      genres: genres
    })
  
    const duplicate = await isDuplicate(id)
    if (!duplicate) {
      newMovie.save()
      return newMovie
    } else {
      console.log('Movie is duplicate, not saving')
    }
  } catch (error) {
    console.log(error.message)
    throw new Error('saving movie failed')
  }
}

export async function readMovies() {
  try {
    const result = await movie.find({}).sort({ release_date: -1 })
    return result
  } catch (error) {
    console.log(error.message)
    throw new Error('reading from db failed')
  }
}

export async function updateMovie(id: string, newMovie: MovieModel): Promise<MovieModel> {
  try {
    const updatedMovie = await movie.findOneAndUpdate(id, newMovie, { new: true })
    return updatedMovie
  } catch (error) {
    console.log(error.message)
    throw new Error('findAndUpdate failed for movie')
  }
}
