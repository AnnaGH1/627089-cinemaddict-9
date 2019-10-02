import {
  getRandSelection,
  getRandomIntInclusive
} from "../utils";
import {FilmsCount} from '../helper';

const IMG_PATH = `./images/posters/`;
const MOCK_ITEMS_MAX = 3;
const Films = {
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
const Rating = {
  MIN: 0,
  MAX: 5,
};
const Year = {
  MIN: 0,
  MAX: Date.now(),
};
const Duration = {
  MIN: 20,
  MAX: 180,
};
const CommentsCount = {
  MIN: 0,
  MAX: 5,
};
export const commentsStart = [
  {
    author: `Tim Macoveev`,
    text: `Interesting setting and a good cast`,
    emoji: `smile`,
    time: 1569000535567,
  },
  {
    author: `John Doe`,
    text: `Booooooooooring`,
    emoji: `sleeping`,
    time: 1569200535567,
  },
  {
    author: `John Doe`,
    text: `Very very old. Meh`,
    emoji: `puke`,
    time: 1567200535567,
  },
  {
    author: `Tim Macoveev`,
    text: `Almost two hours? Seriously?`,
    emoji: `angry`,
    time: 1567800435567,
  },
  {
    author: `John Doe`,
    text: `Almost two hours? Seriously?`,
    emoji: `angry`,
    time: 1567800535567,
  },
];

/**
 * Gets random film
 * @return {Object}
 */
const getFilm = () => (
  {
    title: Films.TITLES[Math.floor(Math.random() * Films.TITLES.length)],
    category: Films.CATEGORIES[getRandomIntInclusive(0, Films.CATEGORIES.length - 1)],
    rating: getRandomIntInclusive(Rating.MIN, Rating.MAX),
    year: getRandomIntInclusive(Year.MIN, Year.MAX),
    duration: `${getRandomIntInclusive(Duration.MIN, Duration.MAX)} min`,
    country: Films.COUNTRIES[getRandomIntInclusive(0, Films.COUNTRIES.length - 1)],
    director: Films.DIRECTORS[getRandomIntInclusive(0, Films.DIRECTORS.length - 1)],
    writers: new Set(getRandSelection(Films.WRITERS, MOCK_ITEMS_MAX)),
    actors: new Set(getRandSelection(Films.ACTORS, MOCK_ITEMS_MAX)),
    genres: new Set(getRandSelection(Films.GENRES, MOCK_ITEMS_MAX)),
    url: `${IMG_PATH}${Films.IMAGES[Math.floor(Math.random() * Films.IMAGES.length)]}`,
    description: getRandSelection(Films.DESCRIPTION, MOCK_ITEMS_MAX).join(` `).toString(),
    comments: getRandSelection(commentsStart, getRandomIntInclusive(CommentsCount.MIN, CommentsCount.MAX)),
    isWatchlist: Boolean(Math.round(Math.random())),
    isHistory: Boolean(Math.round(Math.random())),
    isFavorites: Boolean(Math.round(Math.random())),
    userScore: null,
  }
);

export const films = new Array(FilmsCount.TOTAL).fill({}).map(getFilm);
