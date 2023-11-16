import Bcrypt from 'bcrypt';
import Boom from '@hapi/boom';
import { users } from '../users.js';
import crypto from 'crypto';

export default [
  {
    method: 'POST',
    path: '/register',
    handler: async (request, h) => {
      console.log('posting to register');
      const { username, password } = request.payload;
      let account = users.find((user) => user.username === username);

      if (!account) {
        console.log('hashing password...');
        const hash = await Bcrypt.hash(password, 11);

        const sessionId = crypto.randomUUID();

        console.log('creating account...');
        account = { username, password: hash, sessionId };

        users.push(account);
        console.log('account created...');

        console.log(users);
        console.log('setting auth cookie...');

        // Add session to cookies
        request.cookieAuth.set({ id: account.sessionId });
      }

      return account;
    },
  },
  {
    method: 'POST',
    path: '/login',
    handler: async (request, h) => {
      console.log('POSTING TO LOGIN');
      const { username, password } = request.payload;

      console.log('searching user');

      const account = users.find((user) => user.username === username);

      if (!account || !(await Bcrypt.compare(password, account.password))) {
        return Boom.unauthorized();
      }

      // Add session to cookies
      request.cookieAuth.set({ id: account.sessionId });
      return account;
    },
  },
  {
    method: 'GET',
    path: '/logout',
    handler: async (request, h) => {
      let session = null;
      const sessionId = request.auth.credentials.id;

      //Logout user
      try {
        // Logout user from database
      } catch (err) {
        err.response
          ? console.log(`${err.response.status}: ${err.response.data.message}`)
          : console.log(err);
      }

      return session;
    },
  },
  {
    method: 'GET',
    path: '/auth/me',
    handler: async (request, h) => {
      console.log('printing credentials');
      return request.auth.credentials;
    },
    options: {
      auth: 'session',
    },
  },
];
