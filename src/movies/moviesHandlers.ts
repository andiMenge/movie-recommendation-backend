import { Router } from 'express'
import { MovieResponse, InputData, MovieModel } from './moviesModels'
import { saveMovie, readMovies, updateMovie } from './movies'
import { getImdbIDfromImdbURL } from './moviesHelpers'
import { validateAPIKey } from './moviesHelpers'

const router = Router()

router.get('/', async (req, res) => {
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
})

router.post('/', validateAPIKey, async (req, res) => {
  try {
    const inputData: InputData = req.body
    const imdbURL = inputData.url
    const imdbID = await getImdbIDfromImdbURL(imdbURL)
    const movie = await saveMovie(imdbID)
    res.send(movie)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})

router.put('/:id?', validateAPIKey, async (req, res) => {
  try {
    const newMovie: MovieModel = req.body
    const updatedMovie = await updateMovie(req.params.id, newMovie)
    res.json(updatedMovie)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})

export default router
