import { Feed } from 'feed'
import { Item } from 'feed/lib/typings'
import { readMovies } from '../movies/movies'
import { MovieModel } from 'movies/moviesModels'

export const feed = new Feed({
  title: 'Movie Favs',
  description: 'Personal Movie Favorites',
  id: 'https://movies.andimenge.de/',
  link: 'https://movies.andimenge.de/',
  image: 'https://movies.andimenge.de/favicon.ico',
  favicon: 'https://movies.andimenge.de/favicon.ico',
  copyright: 'All rights reserved 2019, Movie Favs',
  updated: new Date(2013, 6, 14), // optional, default = today
  generator: 'Feed for Node.js', // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: 'https://movies.andimenge.de/json',
    atom: 'https://movies.andimenge.de/atom',
  },
  author: {
    name: 'Movie Favs',
    link: 'https://movies.andimenge.de',
  },
})

export function addToFeed(title: string, imdbID: string, imageURL: string) {
  const item: Item = {
    title: title,
    id: `https://www.imdb.com/title/${imdbID}`,
    link: `https://www.imdb.com/title/${imdbID}`,
    description: title,
    content: title,
    date: new Date(2013, 6, 14),
    image: imageURL,
  }
  feed.addItem(item)
}

export async function createInitialFeed() {
  let movies: MovieModel[]
  try {
    movies = await readMovies()
  } catch (error) {
    console.error(error.message)
    throw new Error('read movies from DB failed')
  }
  movies.forEach(movie => {
    const item: Item = {
      title: movie.original_title,
      id: `https://www.imdb.com/title/${movie.imdb_id}`,
      link: `https://www.imdb.com/title/${movie.imdb_id}`,
      description: movie.original_title,
      content: movie.original_title,
      date: new Date(movie.created_date),
      image: movie.image_url,
    }
    feed.addItem(item)
  })
  console.log(`added ${movies.length} movies to feed!`)
}
