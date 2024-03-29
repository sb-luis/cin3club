import Bcrypt from 'bcrypt';
import Boom from '@hapi/boom';

// --- PROTECTED AUTH ENDPOINTS ---

// Set expiry date to be tomorrow
const SESSION_EXPIRY_TIME = 1;

export default [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: async (request, h) => {
      const { User, Session } = request.server.app.models;
      const { alias, password } = request.payload;

      // Start an unmanaged transaction
      const { connection } = request.server.app;
      const transaction = await connection.transaction();

      try {
        // Make sure the given 'alias' is not in use
        let user = await User.findOne(
          {
            where: {
              alias,
            },
          },
          { transaction },
        );

        if (user) {
          transaction.rollback();
          return Boom.badRequest("User 'alias' already exists");
        }

        // Hash user's password
        const hash = await Bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

        // Create user
        user = await User.create(
          {
            alias,
            password: hash,
          },
          { transaction },
        );

        // Create session
        let date = new Date();
        date.setDate(date.getDate() + SESSION_EXPIRY_TIME);

        // user.createSession({ expires: date }, { transaction });
        const session = await Session.create(
          {
            userId: user.id,
            expires: date,
          },
          { transaction },
        );

        // If all db interactions went well...
        await transaction.commit();

        // Add session to cookies and return
        request.cookieAuth.set(session);
        return h.response('OK').code(200);
      } catch (err) {
        // If anything went wrong...
        request.log('err', err);
        transaction.rollback();
        return Boom.badImplementation();
      }
    },
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: async (request, h) => {
      const { User, Session } = request.server.app.models;
      const { alias, password } = request.payload;
      const { connection } = request.server.app;
      const transaction = await connection.transaction();

      let date = new Date();

      try {
        // Validate user alias
        let user = await User.findOne(
          {
            where: {
              alias,
            },
          },
          { transaction },
        );

        // Validate user password
        if (!user || !(await Bcrypt.compare(password, user.password))) {
          transaction.rollback();
          return Boom.unauthorized();
        }

        // Check if there is an existing session for this user
        let session = await Session.findOne(
          {
            where: {
              userId: user.id,
            },
          },
          { transaction },
        );

        // If session found but expired...
        if (session && session.expires <= date) {
          // Delete session
          await Session.destroy(
            {
              where: { id: session.id },
            },
            { transaction },
          );
          session = null;
        }

        // If a session is not found or has expired
        if (!session) {
          // Create session
          date.setDate(date.getDate() + SESSION_EXPIRY_TIME);
          session = await Session.create(
            {
              userId: user.id,
              expires: date,
            },
            { transaction },
          );
        }

        // Add session to cookies and return
        request.cookieAuth.set(session);

        // If all db interactions went well...
        transaction.commit();
        return h.response('OK').code(200);
      } catch (err) {
        // If anything went wrong...
        request.log('err', err);
        transaction.rollback();
        return Boom.badImplementation();
      }
    },
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/api/auth/logout',
    handler: async (request, h) => {
      request.log('debug', 'Logging out!');
      const { Session } = request.server.app.models;
      const sessionId = request.auth.credentials.id;

      // Delete session
      await Session.destroy({
        where: { id: sessionId },
      });

      return h.response('OK').code(200);
    },
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    handler: async (request, h) => {
      const { User } = request.server.app.models;
      const userId = request.auth.credentials.userId;

      let user = await User.findOne({
        where: {
          id: userId,
        },
        attributes: ['alias', 'email'],
      });

      return user.toJSON();
    },
  },
  {
    method: 'PUT',
    path: '/api/auth/me',
    handler: async (request, h) => {
      const { User } = request.server.app.models;
      const { password, newEmail, newAlias, newPassword } = request.payload;
      const userId = request.auth.credentials.userId;

      // Get existing user
      let user = await User.findOne({
        where: {
          id: userId,
        },
      });

      // Validate user password
      if (!(await Bcrypt.compare(password, user.password))) {
        return Boom.unauthorized();
      }

      if (newAlias) {
        // Make sure the given 'alias' is not in use
        const collision = await User.findOne({
          where: {
            alias: newAlias,
          },
        });
        if (collision) return Boom.badRequest("User 'alias' already exists");
        user.alias = newAlias;
      }

      // Update any new data about the user
      if (newEmail) {
        user.email = newEmail;
      }

      if (newPassword) {
        // Hash user's password
        const hash = await Bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        user.password = hash;
      }

      // Save user with new data
      await user.save();

      return h.response('OK').status(200);
    },
  },
  {
    method: 'POST',
    path: '/api/auth/delete-me',
    handler: async (request, h) => {
      const { User, Session } = request.server.app.models;
      const { password } = request.payload;
      const { connection } = request.server.app;
      const transaction = await connection.transaction();
      const userId = request.auth.credentials.userId;

      try {
        // Validate user password
        let user = await User.findOne(
          {
            where: {
              userId,
            },
          },
          { transaction },
        );
        if (!(await Bcrypt.compare(password, user.password))) {
          transaction.rollback();
          return Boom.unauthorized();
        }

        // Delete all sessions by given user
        await Session.destroy(
          {
            where: {
              userId,
            },
          },
          { transaction },
        );

        // Delete user
        await User.destroy(
          {
            where: {
              id: userId,
            },
          },
          { transaction },
        );

        // If all db interactions went well...
        transaction.commit();
        return h.response('OK').code(200);
      } catch (err) {
        // If anything went wrong...
        request.log('err', err);
        transaction.rollback();
        return Boom.badImplementation();
      }
    },
  },
];
