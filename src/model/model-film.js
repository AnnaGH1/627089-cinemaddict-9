export default class ModelFilm {
  constructor(dataFilm) {
    this.id = dataFilm[`id`];
    this.title = dataFilm[`film_info`][`title`];
    this.category = dataFilm[`film_info`][`age_rating`] || ``;
    this.rating = dataFilm[`film_info`][`total_rating`] || ``;
    this.year = new Date(dataFilm[`film_info`][`release`][`date`]).getFullYear();
    this.duration = dataFilm[`film_info`][`runtime`] || ``;
    this.country = dataFilm[`film_info`][`release`][`release_country`] || ``;
    this.director = dataFilm[`film_info`][`director`] || ``;
    this.writers = dataFilm[`film_info`][`writers`] || [];
    this.actors = dataFilm[`film_info`][`actors`] || [];
    this.genres = dataFilm[`film_info`][`genre`] || [];
    this.url = dataFilm[`film_info`][`poster`] || ``;
    this.description = dataFilm[`film_info`][`description`] || ``;
    this.commentsIds = dataFilm[`comments`] || [];
    this.isWatchlist = Boolean(dataFilm[`user_details`][`watchlist`]);
    this.isHistory = Boolean(dataFilm[`user_details`][`already_watched`]);
    this.isFavorites = Boolean(dataFilm[`user_details`][`favorite`]);
    this.userScore = dataFilm[`user_details`][`personal_rating`];
    this.watchingDate = dataFilm[`user_details`][`watching_date`];
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}
