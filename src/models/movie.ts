import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MovieSchema = new Schema({
  original_title: {
    type: String,
  },
  imdb_id: {
    type: String,
    required: ''
  },
  release_date: {
    type: String            
  },
  is_highlight: {
    type: Boolean           
  },
  image_url: {
    type: String           
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

export interface Movie{
  original_title: string
  imdb_id: string
  release_date: string
  is_highlight: boolean
  image_url: string
  created_date: string
}