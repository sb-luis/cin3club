import fs from 'fs';
import path from 'path';
import { HTML_DIR } from './constants.js';
import { downloadRatingsPages, countRatingPages } from './utils/filmaffinity.js';

export async function main() {
  console.log(`Fetching data for ${process.env.USER_ID}...`);

  //If a 'data/{userId}/html' directory doesn't exists for this user, create one
  if (!fs.existsSync(HTML_DIR)) {
    const err = await fs.promises.mkdir(HTML_DIR, { recursive: true });
    if (err) console.log(err);
  }

  //Get how many Get request we need to perform
  const pageCount = await countRatingPages();

  //Fetch all user ratings from the server recursively
  if (typeof pageCount !== 'number') return console.log('pageCount is not a number');
  console.log(`Fetching a total of ${pageCount} rating pages...`);
  downloadRatingsPages(pageCount, HTML_DIR);
}

main();
