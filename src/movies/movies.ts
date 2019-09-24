import * as mongoose from 'mongoose'
import { MovieSchema, MovieModel } from './moviesModels'
import { Movieresult } from '../tmdb/tmdbModels'
import { isDuplicate } from './moviesHelpers'
import { sendToSlack } from '../slack/slack'
import { addToFeed } from '../feed/feed'
import { getMovieInfo, getGenreNamesfromGenreIds, tmdbThumbnailURL } from '../tmdb/tmdb'

const movie = mongoose.model<MovieModel>('Movie', MovieSchema)

export async function saveMovie(id: string): Promise<MovieModel> {
  try {
    const movieInfo: Movieresult = await getMovieInfo(id)
    const genres = await getGenreNamesfromGenreIds(movieInfo.genre_ids)
    const newMovie = new movie({
      original_title: movieInfo.title,
      imdb_id: id,
      release_date: movieInfo.release_date,
      is_highlight: false,
      image_url: `${tmdbThumbnailURL}${movieInfo.poster_path}`,
      genres: genres,
    })

    const duplicate = await isDuplicate(id)
    if (!duplicate) {
      newMovie.save()
      await notify(newMovie)
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
    const updatedMovie = await movie.findByIdAndUpdate(id, newMovie, { new: true })
    return updatedMovie
  } catch (error) {
    console.log(error.message)
    throw new Error('findAndUpdate failed for movie')
  }
}

export async function notify(movie: MovieModel) {
  try {
    await sendToSlack(movie.original_title, movie.imdb_id, movie.image_url)
  } catch (error) {
    console.error(error.message)
    throw new Error('Send to slack failed')
  }

  try {
    addToFeed(movie.original_title, movie.imdb_id, movie.image_url)
  } catch (error) {
    console.error(error.message)
    throw new Error('Add movie to feed failed')
  }
}
