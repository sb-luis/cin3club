import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '../../.env-node');

// Load the environment variables
dotenv.config({ path: envPath });

const nodemon = spawn('nodemon', ['server'], { stdio: 'inherit' });

nodemon.on('exit', (code) => {
  console.log(`nodemon exited with code ${code}`);
});
