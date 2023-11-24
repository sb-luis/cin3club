import path from 'path';
import fs from 'fs';

export const URL_QUERY_STR_MAX = 50;

export const ROOT_DIR = new URL('./', import.meta.url).pathname;
export const SEED_PATH = path.join(ROOT_DIR, `seed-data.json`);
export const SEED_EXISTS = fs.existsSync(SEED_PATH);
