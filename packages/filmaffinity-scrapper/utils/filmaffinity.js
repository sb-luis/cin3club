import fs from 'fs';
import path from 'path';
import https from 'https';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const URL = `${process.env.FILMAFFINITY_ENDPOINT}/userratings.php?user_id=${process.env.USER_ID}`;
const DEBOUNCING_TIME = 250; // ms

export function parseHtmlPage(data) {
  const parsedData = [];
  const dom = new JSDOM(data);
  let wrapperEl = dom.window.document.querySelectorAll('.user-ratings-wrapper');

  wrapperEl.forEach((el) => {
    //Each wrapper corresponds to a single date, that can have more than 1 movie.
    //user-ratings-movie
    let dateSeen = el.querySelector('.user-ratings-header').innerHTML;
    dateSeen = dateSeen.match(/[\w]+\s[\d]*,\s[\d]+/g)[0];

    const movies = el.querySelectorAll('.user-ratings-movie');

    movies.forEach((mov) => {
      // Parse data using REGEX
      const titleEl = mov.querySelector('.mc-title').innerHTML;
      const title = mov.querySelector('.mc-title a').innerHTML;
      const country = mov.querySelector('.mc-title img').getAttribute('alt');
      let year = titleEl.match(/\([\d]{4}/g)[0]; //Extract an array with all rows
      year = parseInt(year.match(/[\d]+/g)[0]);
      const director = mov.querySelector('.mc-director a').innerHTML;
      const score = mov.querySelector('.ur-mr-rat').innerHTML;

      parsedData.push({ title, year, director, country, score, dateSeen });
    });
  });

  return parsedData;
}

async function fetchHtmlPage(url) {
  return new Promise((resolve) => {
    https
      .get(url, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data);
          //console.log(JSON.parse(data).explanation);
        });
      })
      .on('error', (err) => {
        console.log('Error: ' + err.message);
      });
  });
}

export async function countRatingPages() {
  //Fetch main page html
  const data = await fetchHtmlPage(URL);

  //Extract pages numbers from it
  const dom = new JSDOM(data);
  let pages = dom.window.document.querySelector('.user-ratings-list .pager .pager').children;
  return parseInt(pages[pages.length - 2].innerHTML);
}

// Recursive function to download all user ratings HTML pages from a given ID
// Wait X amount of ms between each get request
export async function downloadRatingsPages(i, dirPath) {
  //Fetch HTML page - add '&p=i' at the end of the url
  let pageUrl = URL + `&p=${i}`;
  const data = await fetchHtmlPage(URL + `&p=${i}`);
  console.log(`Page ${i}`);
  console.log(`Data fetched from ${pageUrl}...`);

  //Save HTML page to a file
  let filePath = path.join(dirPath, `/page-${i}.html`);
  await fs.writeFile(filePath, data, { flag: 'w+' }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  console.log(`data saved to ${filePath}...`);

  if (i > 1) {
    setTimeout(() => downloadRatingsPages(i - 1, dirPath), DEBOUNCING_TIME);
  }
}
