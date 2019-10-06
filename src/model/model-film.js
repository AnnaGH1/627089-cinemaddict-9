export default class ModelFilm {
  constructor(dataFilm) {
    this.id = dataFilm[`id`];
    this.title = dataFilm[`film_info`][`title`];
    this.titleAlt = dataFilm[`film_info`][`alternative_title`] || ``;
    this.category = dataFilm[`film_info`][`age_rating`] || 0;
    this.rating = dataFilm[`film_info`][`total_rating`] || 0;
    this.duration = dataFilm[`film_info`][`runtime`] || 0;
    this.year = new Date(dataFilm[`film_info`][`release`][`date`]);
    this.country = dataFilm[`film_info`][`release`][`release_country`] || ``;
    this.director = dataFilm[`film_info`][`director`] || ``;
    this.writers = dataFilm[`film_info`][`writers`] || [];
    this.actors = dataFilm[`film_info`][`actors`] || [];
    this.genres = dataFilm[`film_info`][`genre`] || [];
    this.url = dataFilm[`film_info`][`poster`] || ``;
    this.description = dataFilm[`film_info`][`description`] || ``;
    this.commentsIds = dataFilm[`comments`] || [];
    this.isWatchlist = dataFilm[`user_details`][`watchlist`] || false;
    this.isHistory = dataFilm[`user_details`][`already_watched`] || false;
    this.isFavorites = dataFilm[`user_details`][`favorite`] || false;
    this.userScore = dataFilm[`user_details`][`personal_rating`];
    this.watchingDate = dataFilm[`user_details`][`watching_date`] || 0;
  }

  static toRAW(data) {
    return {
      'id': data.id,
      'comments': data.commentsIds,
      'film_info': {
        'title': data.title,
        'alternative_title': data.titleAlt,
        'age_rating': data.category,
        'total_rating': data.rating,
        'runtime': data.duration,
        'release': {
          'date': new Date(data.year),
          'release_country': data.country,
        },
        'director': data.director,
        'writers': data.writers,
        'actors': data.actors,
        'genre': data.genres,
        'poster': data.url,
        'description': data.description,
      },
      'user_details': {
        'watchlist': data.isWatchlist,
        'already_watched': data.isHistory,
        'favorite': data.isFavorites,
        'personal_rating': Number(data.userScore) || 0,
        'watching_date': new Date(data.watchingDate),
      },
    };
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}
