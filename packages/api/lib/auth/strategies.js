import { users } from '../users.js';

export default function () {
  const name = 'session';
  const scheme = 'cookie';

  const validate = async (request, session) => {
    console.log('VALIDATING REQUEST...');
    console.log(`${session.id}`);

    console.log(users);

    const account = await users.find((user) => user.sessionId === session.id);

    if (!account) {
      console.log('no matching account found');
      return { valid: false };
    }

    // If session not found, request is unauthorized
    console.log('found credentials!');

    // Set request.auth.credentials
    return { isValid: true, credentials: account };
  };

  const options = {
    cookie: {
      path: '/',
      name: 'x-session-cookie',
      password: process.env.COOKIE_KEY,
      isSecure: false,
    },
    //redirectTo: '/api/login',
    validate,
  };

  return { name, scheme, options };
}
