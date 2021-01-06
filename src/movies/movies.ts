import * as mongoose from 'mongoose'
import { MovieSchema, MovieModel } from './moviesModels'
import { Movieresult } from '../tmdb/tmdbModels'
import Tmdb from '../tmdb/tmdb'
import { isDuplicate } from './moviesHelpers'
import { sendToSlack } from '../slack/slack'
import { addToFeed } from '../feed/feed'
import { S3_BASE_URL, uploadToS3 } from '../s3/s3'
import { storeTmpImage } from './moviesHelpers'

const movie = mongoose.model<MovieModel>('Movie', MovieSchema)
const tmdb = new Tmdb()

export async function saveMovie(id: string): Promise<MovieModel> {
  try {
    const movieInfo: Movieresult = await tmdb.getMovieInfo(id)
    const genres = await tmdb.getGenreNamesfromGenreIds(movieInfo.genre_ids)
    const newMovie = new movie({
      original_title: movieInfo.title,
      imdb_id: id,
      release_date: movieInfo.release_date,
      is_highlight: false,
      genres: genres,
    })

    if (await isDuplicate(id)) {
      console.log(`Movie '${newMovie.original_title}' is duplicate, not saving`)
      return
    }

    const thumbnailName = await storeThumbnail(movieInfo, tmdb.tmdbThumbnailURL)
    newMovie.image_url = `${S3_BASE_URL}${thumbnailName}`
    newMovie.save()
    await notify(newMovie)
    return newMovie
  } catch (error) {
    console.log(error.message)
    throw error
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

async function storeThumbnail(movieInfo: Movieresult, thumbnailBaseUrl: string): Promise<string> {
  const filename = `${movieInfo.title.toLowerCase().replaceAll(/\s/g, '')}-${movieInfo.id}.jpg`
  const tmpImage = await storeTmpImage(`${thumbnailBaseUrl}${movieInfo.poster_path}`)
  await uploadToS3(tmpImage, filename)
  return filename
}
