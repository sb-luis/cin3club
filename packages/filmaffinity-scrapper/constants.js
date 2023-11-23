import path from 'path';

export const DATA_DIR = new URL('./data', import.meta.url).pathname;
export const USER_DIR = path.join(DATA_DIR, `/${process.env.USER_ID}`);
export const HTML_DIR = path.join(USER_DIR, `/html`);
