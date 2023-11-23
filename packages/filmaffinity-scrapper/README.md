# Scripts

Collection of useful scripts for extracting publicly available user ratings from [Filmaffinity](https://www.filmaffinity.com/uk) and searching for corresponding matches in [TMDB](https://www.themoviedb.org). The extracted data can serve as a 'seed' for populating the app's database.

- **`npm run extract`** - Loops through all user ratings HTML pages and saves them in `./data/{userId}/html`

- **`npm run parse`** - Uses JSDOM to scrap the film and rating data of the downloaded pages and saves data to `./data/{userId}/filmaffinity.json`

- **`npm run migrate`** - Looks for matches between Filmaffinity and TMDB movies for each of the ratings in `filmaffinity.json`. Matches are stored to `success.json`, movies or shows that were not found are saved to `error.json`.
