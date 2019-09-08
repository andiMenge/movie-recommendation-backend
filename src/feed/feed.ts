import { Feed } from 'feed'
import { Item } from 'feed/lib/typings'

const feed = new Feed({
  title: 'Movie Favs',
  description: 'Personal Movie favorites',
  id: 'https://movies.andimenge.de/',
  link: 'https://movies.andimenge.de/',
  image: 'https://movies.andimenge.de/favicon.ico',
  favicon: 'https://movies.andimenge.de/favicon.ico',
  copyright: 'All rights reserved 2019, Movie Favs',
  updated: new Date(2013, 6, 14), // optional, default = today
  generator: 'awesome', // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: 'https://movies.andimenge.de/json',
    atom: 'https://movies.andimenge.de/atom',
  },
  author: {
    name: 'Movie Favs',
    link: 'https://movies.andimenge.de',
  },
})

export function addToFeed(title: string, imdbID: string, imageURL: string): string {
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
  return feed.atom1()
}
