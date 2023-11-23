import path from 'path';
import { USER_DIR } from './constants.js';
import { getMovies, getMovieDetails } from './utils/tmdb.js';
import { readJsonFile, writeJsonFile, pause } from './utils/index.js';

const DEBOUNCING_TIME = 50; // ms

const checkMovieDetailsMatch = async (filmaffinityMovie, tmdbMovie) => {
  try {
    // Years match
    // const d = new Date(tmdbMovie.releaseDate);
    // const yearsMatch = filmaffinityMovie.year === d.getFullYear();

    // Directors match
    const directorsMatch = tmdbMovie.directors.includes(filmaffinityMovie.director);

    return directorsMatch;
  } catch (err) {
    return false;
  }
};

const main = async () => {
  // read filmaffinity data
  let p = path.join(USER_DIR, `/filmaffinity.json`);
  const filmaffinityData = await readJsonFile(p);

  const success = [];
  const error = [];

  // loop through user ratings
  for (let i = 0; i < filmaffinityData.length; i++) {
    const s = filmaffinityData[i].title;
    console.log(`Migrating '${s}'...`);

    // search for a movie with filmaffinity's title
    await pause(DEBOUNCING_TIME);
    const tmdbData = await getMovies({ s, lang: 'en-gb' });

    // check if filmaffinity and tmdb movie detail's match
    let match = false;
    let tmdbMovieDetails = null;

    if (tmdbData[0]?.id) {
      await pause(DEBOUNCING_TIME);
      tmdbMovieDetails = await getMovieDetails({ id: tmdbData[0].id });
      match = checkMovieDetailsMatch(filmaffinityData[i], tmdbMovieDetails);
    }

    // push them to respective array's accordingly
    if (match) {
      const rating = {
        score: filmaffinityData[i].score,
        dateSeen: filmaffinityData[i].dateSeen,
        movie: tmdbMovieDetails,
      };

      success.push(rating);
    } else {
      error.push(filmaffinityData[i]);
    }
  }

  p = path.join(USER_DIR, `/success.json`);
  await writeJsonFile(success, p);
  p = path.join(USER_DIR, `/error.json`);
  await writeJsonFile(error, p);
};

main();
