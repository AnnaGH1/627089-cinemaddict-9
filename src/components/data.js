import {getRandEls, getRandomIntInclusive} from "./util";

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
  `musical`,
  `western`,
  `drama`,
  `comedy`,
  `cartoon`,
];

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

const getFilm = () => (
  {
    title: TITLES[Math.floor(Math.random() * TITLES.length)],
    rating: getRandomIntInclusive(1, 5),
    year: getRandomIntInclusive(1920, 2018),
    duration: `${getRandomIntInclusive(60, 120)} min`,
    genre: GENRES[Math.floor(Math.random() * GENRES.length)],
    url: `${IMG_PATH}${IMAGES[Math.floor(Math.random() * IMAGES.length)]}`,
    description: getRandEls(DESCRIPTION, 3).join(` `).toString(),
    comments: getRandomIntInclusive(1, 5),
    isToWatchlist: Boolean(Math.round(Math.random())),
    isWatched: Boolean(Math.round(Math.random())),
    isFavorite: Boolean(Math.round(Math.random())),
  }
);

const films = new Array(FILMS_COUNT).fill({}).map(getFilm);

export {films};
