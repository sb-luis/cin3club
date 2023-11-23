// SEED DATA
import Bcrypt from 'bcrypt';
import fs from 'fs';
import { SEED_PATH } from './constants.js';

export const seed = async (server) => {
  server.log('info', 'A seed file was found. Initialising data...');

  const { User, Rating } = server.app.models;
  const alias = 'test';

  const createRating = async ({ userId, score, dateSeen, movie }) => {
    server.log('debug', `Creating rating for '${movie.englishTitle}'...`);
    const { Rating, Movie } = server.app.models;

    // Look for movie in DB
    let existingMovie = await Movie.findOne({
      where: {
        id: movie.tmdbId,
      },
    });

    if (!existingMovie) {
      // If movie doesn't exists, create a record for it
      existingMovie = await Movie.create({
        // lister
        id: movie.tmdbId,
        englishTitle: movie.englishTitle,
        originalTitle: movie.originalTitle,
        releaseDate: movie.releaseDate,
        posterPath: movie.posterPath,
        // extra
        directors: movie.directors,
        imdbId: movie.imdbId,
        genres: movie.genres,
        productionCountries: movie.productionCountries,
        runningTime: movie.runningTime,
      });
    }

    // Create rating
    const date = new Date(dateSeen);
    await Rating.create({
      userId,
      movieId: existingMovie.id,
      score,
      dateSeen: date,
    });
  };

  const readJsonFile = async (path) => {
    try {
      server.log('debug', `Reading JSON file at: ${path}`);
      const data = await fs.promises.readFile(path, 'utf8');
      const parsedData = JSON.parse(data);
      server.log('debug', 'JSON file parsed correctly!');
      return parsedData;
    } catch (err) {
      throw new Error(err);
    }
  };

  try {
    let user = await User.findOne({
      where: {
        alias,
      },
    });

    if (user) {
      // If 'test' user already exists skip its creation
      server.log('info', `A user named '${alias}' already exists. Skipping user creation.`);

      server.log('info', `Deleting all user ratings.`);
      Rating.destroy({ where: { userId: user.id } });
    } else {
      const badPassword = '12345';
      const hash = await Bcrypt.hash(badPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS));

      // Otherwise create user
      user = await User.create({
        alias,
        password: hash,
      });
    }

    // Read seed data from JSON
    const data = await readJsonFile(SEED_PATH);

    if (!data || data.length < 1) {
      throw Error('No data found in seed file');
    }

    // Create user ratings from data
    for (let i = 0; i < data.length; i++) {
      await createRating({
        userId: user.id,
        score: data[i].score,
        dateSeen: data[i].dateSeen,
        movie: data[i].movie,
      });
    }

    server.log('info', 'Seed data initialised successfully!');
  } catch (err) {
    server.log('info', err);
  }
};
