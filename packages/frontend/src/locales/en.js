export const en = {
  translation: {
    app: {
      title: 'kino',
      footer: {
        license: 'Released under the MIT License',
        copyright: 'Copyright © {{year}} Luis Sanchez Barranquero',
      },
    },
    pages: {
      home: {
        title: 'home',
      },
      profile: {
        title: 'profile',
      },
      movies: {
        title: 'movies',
        searchLabel: 'Search for a movie',
        searchPlaceholder: 'search',
        welcomeMessage: 'The place where your favourite movies live!',
      },
      ratings: {
        title: 'ratings',
        totalCount_one: '{{count}} rating',
        totalCount_other: '{{count}} ratings',
      },
      movieDetails: {
        title: 'movie details',
        directorListHeading: 'Directed by',
        actorListHeading: 'with',
        actorListRole: "as '{{ role }}'",
      },
      login: {
        title: 'login',
        aliasLabel: 'Alias',
        aliasPlaceholder: 'alias',
        passwordLabel: 'Password',
        passwordPlaceholder: 'password',
        submitButton: 'Login',
      },
      register: {
        title: 'register',
        aliasLabel: 'Alias',
        aliasPlaceholder: 'alias',
        passwordLabel: 'Password',
        passwordPlaceholder: 'password',
        submitButton: 'Register',
      },
    },
    components: {
      ratingForm: {
        create: { title: 'Rate this movie', submitButton: 'Rate' },
        update: { title: 'Edit your rating', submitButton: 'Update', deleteButton: 'Delete Rating' },
        scoreLabel: 'Score (0-100)',
        dateSeenLabel: 'Date Seen',
      },
    },
  },
};
