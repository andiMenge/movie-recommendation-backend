import { Request, Response, NextFunction } from 'express'
import { MovieController } from './moviesHandlers'
import cors from 'cors'

const authKey = process.env.AUTH_KEY

export class Routes {
  public MovieController: MovieController = new MovieController()

  public routes(app): void {
    // Middlewares
    const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`)
      next()
    }

    const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
      if (req.query.key !== authKey) {
        res.status(401).send('Authentication Failed')
      } else {
        next()
      }
    }

    // Routes
    app
      .route('/health')
      .all(loggerMiddleware, cors())
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: '200 OK',
        })
      })

    app
      .route('/movies')
      .all(loggerMiddleware, cors())
      .get(this.MovieController.getMovies)
      .post(authMiddleware, (req, res) => this.MovieController.createMovie(req, res))

    app
      .route('/movies/:id?')
      .all(loggerMiddleware, cors())
      .put(authMiddleware, (req, res) => this.MovieController.updateMovie(req, res))

    app
      .route('/feed')
      .all(loggerMiddleware, cors())
      .get(this.MovieController.feed)
  }
}
