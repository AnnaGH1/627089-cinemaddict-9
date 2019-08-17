import {getShowMoreTemplate} from "./showMore";

/**
 * Gets film template
 * @param {Object} film
 * @return {string}
 */
const getFilmTemplate = (film) => `
  <article class="film-card">
    <h3 class="film-card__title">${film.name}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.year}</span>
      <span class="film-card__duration">${film.duration}</span>
      <span class="film-card__genre">${film.genre}</span>
    </p>
    <img src="./images/posters/${film.url}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.description}</p>
    <a class="film-card__comments">${film.comments} comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.isToWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${film.isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
        </form>
  </article>
`;

/**
 * Gets films template
 * @param {Array} films
 * @return {string}
 */
const getFilmsTemplate = (films) => `
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      ${films.map(getFilmTemplate).join(``)}
      </div>
      ${getShowMoreTemplate()}
    </section>
    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
        ${getFilmTemplate(films[0])}
        ${getFilmTemplate(films[2])}
      </div>
    </section>
    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
        ${getFilmTemplate(films[3])}
        ${getFilmTemplate(films[4])}
      </div>
    </section>
`;

const films = [
  {
    name: `The Dance of Life`,
    rating: 8.3,
    year: 1929,
    duration: `1h 55m`,
    genre: `Musical`,
    url: `the-dance-of-life.jpg`,
    description: `Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…`,
    comments: 5,
    isToWatchlist: false,
    isWatched: false,
    isFavorite: false
  },
  {
    name: `Sagebrush Trail`,
    rating: 3.2,
    year: 1933,
    duration: `54m`,
    genre: `Western`,
    url: `sagebrush-trail.jpg`,
    description: `Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant's narrow escap…`,
    comments: 89,
    isToWatchlist: false,
    isWatched: false,
    isFavorite: false
  },
  {
    name: `The Man with the Golden Arm`,
    rating: 9.0,
    year: 1955,
    duration: `1h 59m`,
    genre: `Drama`,
    url: `the-man-with-the-golden-arm.jpg`,
    description: `Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…`,
    comments: 18,
    isToWatchlist: false,
    isWatched: false,
    isFavorite: false
  },
  {
    name: `Santa Claus Conquers the Martians`,
    rating: 2.3,
    year: 1964,
    duration: `1h 21m`,
    genre: `Comedy`,
    url: `santa-claus-conquers-the-martians.jpg`,
    description: `The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…`,
    comments: 465,
    isToWatchlist: true,
    isWatched: false,
    isFavorite: false
  },
  {
    name: `Popeye the Sailor Meets Sindbad the Sailor`,
    rating: 6.3,
    year: 1936,
    duration: `16m`,
    genre: `Cartoon`,
    url: `popeye-meets-sinbad.png`,
    description: `In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and…`,
    comments: 0,
    isToWatchlist: true,
    isWatched: true,
    isFavorite: true
  }
];

export {getFilmsTemplate, films};
