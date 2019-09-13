import express from 'express'
import movieRoutes from './movies/moviesHandlers'

export const router = express.Router()

// this is a global route
router.get('/health', function(req, res) {
  res.sendStatus(200)
})

router.use('/movies', movieRoutes)
