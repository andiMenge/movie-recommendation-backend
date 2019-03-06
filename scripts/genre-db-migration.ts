import * as mongoose from "mongoose";
import { MovieSchema, MovieModel } from "../src/movies/moviesModels";
import Tmdb from "../src/tmdb/tmdb";
import { Movieresult, Genre } from "../src/tmdb/tmdbModels";

const mongoHost = process.env.MONGO_DB_HOST;
const mongoUrl = `mongodb://${mongoHost}/movie-favs`;

const movie = mongoose.model<MovieModel>("Movie", MovieSchema);
const tmdb = new Tmdb();

connectToDb();
getAllDocs()
.then(docs => updateDocs(docs)
.then(updatedDocs => replaceDocs(updatedDocs))
.catch())

function connectToDb(): void {
  // mongoose.Promise = global.Promise;
  try {
    mongoose.connect(mongoUrl, { useNewUrlParser: true })
  } catch (error) {
    console.log(error.message);
    throw new Error("db connection failed")
  }
}

async function getAllDocs(): Promise<MovieModel[]> {
  try {
    return await movie.find({}).exec()
  } catch (error) {
    throw new Error("read from DB failed.")
  }
}

async function updateDocs(docs: MovieModel[]): Promise<MovieModel[]> {
  const updatedDocs: MovieModel[] = [];
  for (let doc of docs) {
    if (!hasGenres(doc)) {
      const movieInfo: Movieresult = await tmdb.getMovieInfo(doc.imdb_id)
      const genres: string[] = await tmdb.getGenreNamesfromGenreIds(movieInfo.genre_ids)
      doc.genres = genres
      updatedDocs.push(doc);
      console.log("added genres for ", doc.original_title)
    } else {
      console.log("Nothing done b/c movie already has gernes: ", doc.original_title)
    }
  }
  return updatedDocs
}

function replaceDocs(docs: MovieModel[]): void {
  for (const doc of docs) {
    console.log('update in db: ', doc.original_title)
    doc.save()
  }
}

function hasGenres(doc: MovieModel): boolean {
  if (doc.genres.length === 0) {
    return false
  }
  return true
}
