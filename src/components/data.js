import {getRandSelection, getRandomIntInclusive} from "./util";

const Control = {
  FILTERS: [
    `All movies`,
    `Watchlist`,
    `History`,
    `Favorites`,
    `Stats`,
  ],
  SORT_TYPES: [
    `default`,
    `date`,
    `rating`,
  ],
};
const FilmsData = {
  TITLES: [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
  ],
  IMAGES: [
    `the-dance-of-life.jpg`,
    `sagebrush-trail.jpg`,
    `the-man-with-the-golden-arm.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `popeye-meets-sinbad.png`,
    `made-for-each-other.png`,
    `the-great-flamarion.jpg`,
  ],
  GENRES: [
    `Musical`,
    `Western`,
    `Drama`,
    `Comedy`,
    `Cartoon`,
    `Film-Noir`,
    `Mystery`,
  ],
  DESCRIPTION: [
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
  ],
  CATEGORIES: [
    `G`,
    `PG`,
    `PG-13`,
    `R`,
    `18+`,
  ],
  COUNTRIES: [
    `USA`,
    `Russia`,
    `Belgium`,
    `India`,
    `Australia`,
  ],
  DIRECTORS: [
    `Anthony Mann`,
    `Heinz Herald`,
    `Richard Weil`,
    `Mary Beth Hughes`,
  ],
  WRITERS: [
    `Anthony Mann`,
    `Heinz Herald`,
    `Richard Weil`,
    `Mary Beth Hughes`,
  ],
  ACTORS: [
    `Anthony Mann`,
    `Heinz Herald`,
    `Richard Weil`,
    `Mary Beth Hughes`,
  ],
};
const FilmsCount = {
  TOTAL: 16,
  PER_PAGE: 5,
  BY_USER: 1,
  FEATURED: 2,
};
const Rating = {
  MIN: 1,
  MAX: 5,
};
const Year = {
  MIN: 1920,
  MAX: 2018,
};
const Duration = {
  MIN: 20,
  MAX: 180,
};
const CommentsCount = {
  MIN: 0,
  MAX: 10,
};
const PromoCategory = {
  RATING: `Top rated`,
  COMMENTS: `Most commented`,
};
const IMG_PATH = `./images/posters/`;
const MOCK_ITEMS_MAX = 3;
const userTitles = {
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

/**
 * Gets random film
 * @return {Object}
 */
const getFilm = () => (
  {
    title: FilmsData.TITLES[Math.floor(Math.random() * FilmsData.TITLES.length)],
    category: FilmsData.CATEGORIES[getRandomIntInclusive(0, FilmsData.CATEGORIES.length - 1)],
    rating: getRandomIntInclusive(Rating.MIN, Rating.MAX),
    year: getRandomIntInclusive(Year.MIN, Year.MAX),
    duration: `${getRandomIntInclusive(Duration.MIN, Duration.MAX)} min`,
    country: FilmsData.COUNTRIES[getRandomIntInclusive(0, FilmsData.COUNTRIES.length - 1)],
    director: FilmsData.DIRECTORS[getRandomIntInclusive(0, FilmsData.DIRECTORS.length - 1)],
    writers: new Set(getRandSelection(FilmsData.WRITERS, MOCK_ITEMS_MAX)),
    actors: new Set(getRandSelection(FilmsData.ACTORS, MOCK_ITEMS_MAX)),
    genres: new Set(getRandSelection(FilmsData.GENRES, MOCK_ITEMS_MAX)),
    url: `${IMG_PATH}${FilmsData.IMAGES[Math.floor(Math.random() * FilmsData.IMAGES.length)]}`,
    description: getRandSelection(FilmsData.DESCRIPTION, MOCK_ITEMS_MAX).join(` `).toString(),
    comments: getRandomIntInclusive(CommentsCount.MIN, CommentsCount.MAX),
    isWatchlist: Boolean(Math.round(Math.random())),
    isHistory: Boolean(Math.round(Math.random())),
    isFavorites: Boolean(Math.round(Math.random())),
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
 * @param {Array} filtersNames
 * @param {Array} filmsList
 * @return {[]}
 */
const getFilters = (filtersNames, filmsList) => {
  const filters = [];
  filtersNames.forEach((name) => {
    const filter = {};
    filter.name = name;
    filter.url = getUrl(name);
    filter.isActive = false;
    if (filter.name === `All movies`) {
      filter.count = filmsList.length;
      filter.isActive = true;
    } else if (filter.name === `Stats`) {
      filter.count = ``;
    } else {
      const flag = `is${filter.name}`;
      filter.count = filmsList.filter((el) => el[flag]).length;
    }
    filters.push(filter);
  });
  return filters;
};

/**
 * Gets sort types data
 * @param {Array} names
 * @return {Array}
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

const films = new Array(FilmsCount.TOTAL).fill({}).map(getFilm);
const filmsTopRated = films.slice(0, FilmsCount.FEATURED);
const filmsMostCommented = films.slice(0, FilmsCount.FEATURED);

const filters = getFilters(Control.FILTERS, films);
const sortList = getSortTypes(Control.SORT_TYPES);

export {films, filmsTopRated, filmsMostCommented, filters, sortList, comments, userTitles, FilmsCount, PromoCategory};
