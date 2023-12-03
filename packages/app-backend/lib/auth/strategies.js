export default function () {
  const name = 'session';
  const scheme = 'cookie';

  const validate = async (request, cookieSession) => {
    const { Session } = request.server.app.models;
    let currentDate = new Date();

    // Validate session exists
    let dbSession = await Session.findOne({
      where: {
        id: cookieSession.id,
      },
    });

    // Request unauthenticated...
    if (!dbSession) {
      // ...if session not found
      return { isValid: false };
    } else if (dbSession && dbSession.expires <= currentDate) {
      // ...if session found but expired
      await Session.destroy({
        where: { id: session.id },
      });
      return { isValid: false };
    }

    // Otherwise set request.auth.credentials
    return { isValid: true, credentials: cookieSession };
  };

  const options = {
    cookie: {
      path: '/',
      name: 'x-session-cookie',
      password: process.env.COOKIE_KEY,
      isSecure: process.env.NODE_ENV === 'production',
      // isSameSite: false, // defaults to Strict
    },
    //redirectTo: '/api/login',
    validate,
  };

  return { name, scheme, options };
}
