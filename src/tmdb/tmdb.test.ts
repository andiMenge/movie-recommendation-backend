import { getGenres, getMovieInfo, getGenreNamesfromGenreIds } from './tmdb'
jest.mock('./tmdb')

test('getGenres should return array with genres', async () => {
  expect(await getGenres()).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Action' })]))
})

test('getMovieInfo should return a movieobject with a title', async () => {
  expect(await getMovieInfo('tt2274648')).toEqual(expect.objectContaining({ original_title: 'Hellboy' }))
})

test('getGenreNamesfromGenreIds should return a string array with genres', async () => {
  const expected = ['Action', 'Adventure', 'Fantasy', 'Science Fiction']
  const movie = await getMovieInfo('tt2274648')
  expect(await getGenreNamesfromGenreIds(movie.genre_ids)).toEqual(expect.arrayContaining(expected))
})
