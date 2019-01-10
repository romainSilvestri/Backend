const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/movie-time', { useNewUrlParser: true });

const movieSchema = new mongoose.Schema({
  vote_count: Number,
  video: Boolean,
  vote_average: Number,
  title: String,
  popularity: Number,
  poster_path: String,
  original_language: String,
  original_title: String,
  backdrop_path: String,
  adult: Boolean,
  overview: String,
  release_date: String,
  tmdb_id: Number,
  genre: [String],
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  watchlist: { type: [String], default: [] },
});

const MovieModel = mongoose.model('movies', movieSchema);
const UserModel = mongoose.model('user', userSchema);

module.exports = { MovieModel, UserModel };
