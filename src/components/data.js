import {getRandSelection, getRandomIntInclusive} from "./util";
import {getCountByFlag} from "./menu";

const FILMS_COUNT = 15;
const IMG_PATH = `./images/posters/`;
const TITLES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
];
const IMAGES = [
  `the-dance-of-life.jpg`,
  `sagebrush-trail.jpg`,
  `the-man-with-the-golden-arm.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `popeye-meets-sinbad.png`,
  `made-for-each-other.png`,
  `the-great-flamarion.jpg`,
];
const GENRES = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Film-Noir`,
  `Mystery`,
];
const ITEMS_MAX = 3;
const DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];
const CATEGORY = [
  `G`,
  `PG`,
  `PG-13`,
  `R`,
  `18+`,
];
const COUNTRIES = [
  `USA`,
  `Russia`,
  `Belgium`,
  `India`,
  `Australia`,
];
const DIRECTORS = [
  `Anthony Mann`,
  `Heinz Herald`,
  `Richard Weil`,
  `Mary Beth Hughes`,
];
const WRITERS = [
  `Anthony Mann`,
  `Heinz Herald`,
  `Richard Weil`,
  `Mary Beth Hughes`,
];
const ACTORS = [
  `Anthony Mann`,
  `Heinz Herald`,
  `Richard Weil`,
  `Mary Beth Hughes`,
];
const comments = [
  {
    author: `Tim Macoveev`,
    text: `Interesting setting and a good cast`,
    emoji: `smile`,
    time: `3 days ago`,
  },
  {
    author: `John Doe`,
    text: `Booooooooooring`,
    emoji: `sleeping`,
    time: `2 days ago`,
  },
  {
    author: `John Doe`,
    text: `Very very old. Meh`,
    emoji: `puke`,
    time: `2 days ago`,
  },
  {
    author: `John Doe`,
    text: `Almost two hours? Seriously?`,
    emoji: `angry`,
    time: `today`,
  },
];
const FILTER_NAMES = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`,
  `Stats`,
];
const SORT_NAMES = [
  `default`,
  `date`,
  `rating`,
];
const USER_TITLES = {
  novice: {
    min: 1,
    max: 10,
  },
  fan: {
    min: 11,
    max: 20,
  },
  movieBuff: {
    min: 21,
  },
};
const FILMS_COUNT_BY_USER = 1;

/**
 * Gets random film
 * @return {Object}
 */
const getFilm = () => (
  {
    title: TITLES[Math.floor(Math.random() * TITLES.length)],
    category: CATEGORY[getRandomIntInclusive(0, CATEGORY.length - 1)],
    rating: getRandomIntInclusive(1, 5),
    year: getRandomIntInclusive(1920, 2018),
    duration: `${getRandomIntInclusive(60, 120)} min`,
    country: COUNTRIES[getRandomIntInclusive(0, COUNTRIES.length - 1)],
    director: DIRECTORS[getRandomIntInclusive(0, DIRECTORS.length - 1)],
    writers: new Set(getRandSelection(WRITERS, ITEMS_MAX)),
    actors: new Set(getRandSelection(ACTORS, ITEMS_MAX)),
    genres: new Set(getRandSelection(GENRES, ITEMS_MAX)),
    url: `${IMG_PATH}${IMAGES[Math.floor(Math.random() * IMAGES.length)]}`,
    description: getRandSelection(DESCRIPTION, 3).join(` `).toString(),
    comments: getRandomIntInclusive(1, 5),
    isToWatchlist: Boolean(Math.round(Math.random())),
    isWatched: Boolean(Math.round(Math.random())),
    isFavorite: Boolean(Math.round(Math.random())),
  }
);

/**
 * Gets url from name
 * @param {string} name
 * @return {string}
 */
const getUrl = (name) => (name === `All movies`) ? `#all` : `#${name.toLowerCase()}`;

/**
 * Gets filters data
 * @param {Array} names
 * @return {[]}
 */
const getFilters = (names) => {
  const filters = [];
  names.forEach((name) => {
    const filter = {};
    filter.name = name;
    filter.url = getUrl(name);
    switch (name) {
      case `All movies`:
        filter.count = getCountByFlag(films, `title`);
        filter.isActive = true;
        break;
      case `Watchlist`:
        filter.count = getCountByFlag(films, `isToWatchlist`);
        filter.isActive = false;
        break;
      case `History`:
        filter.count = getCountByFlag(films, `isWatched`);
        filter.isActive = false;
        break;
      case `Favorites`:
        filter.count = getCountByFlag(films, `isFavorite`);
        filter.isActive = false;
        break;
      default:
        filter.count = ``;
        filter.isActive = false;
    }
    filters.push(filter);
  });
  return filters;
};

/**
 * Gets sort types data
 * @param {Array} names
 * @return {[]}
 */
const getSortTypes = (names) => {
  const sortTypes = [];
  names.forEach((name) => {
    const type = {};
    type.name = name;
    type.url = `#${name}`;
    type.isActive = name === `default`;
    sortTypes.push(type);
  });
  return sortTypes;
};

const films = new Array(FILMS_COUNT).fill({}).map(getFilm);
const filters = getFilters(FILTER_NAMES);
const sortList = getSortTypes(SORT_NAMES);

export {films, filters, sortList, comments, USER_TITLES, FILMS_COUNT_BY_USER};
