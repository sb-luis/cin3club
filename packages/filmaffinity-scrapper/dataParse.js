import path from 'path';
import fs from 'fs';
import { USER_DIR, HTML_DIR } from './constants.js';
import { parseHtmlPage } from './utils/filmaffinity.js';
import { writeJsonFile } from './utils/index.js';

export async function main() {
  console.log(`Parsing data at ${HTML_DIR}...`);

  //Count how many pages we need to process
  let files = fs.readdirSync(HTML_DIR);

  //Parse all files recursively
  let results = [];

  for (let i = 1; i <= files.length; i++) {
    console.log(`Parsing data at page ${i}`);
    const p = path.join(HTML_DIR, `/page-${i}.html`);
    const htmlPage = fs.readFileSync(p);
    const data = parseHtmlPage(htmlPage);
    results = [...results, ...data];
  }

  //Export a single .csv file inside that directory.
  const p = path.join(USER_DIR, `/filmaffinity.json`);
  await writeJsonFile(results, p);
}

main();
