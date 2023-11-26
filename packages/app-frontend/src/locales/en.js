export const en = {
  translation: {
    app: {
      title: 'kino',
      footer: {
        license: 'Released under the MIT License',
        copyright: 'Copyright © {{year}} Luis Sanchez Barranquero',
      },
      nav: {
        langSelectionLabel: 'Language',
        englishOptionLabel: 'English',
        spanishOptionLabel: 'Spanish',
        moviesLink: 'movies',
        ratingsLink: 'ratings',
        loginLink: 'login',
        logoutLink: 'logout',
        registerLink: 'register',
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
        movieNotFound: "we can't find any movie matching that name",
        searchLabel: 'Search for a movie',
        searchPlaceholder: 'search',
        welcomeMessage: 'The place where your favourite movies live!',
      },
      ratings: {
        title: 'ratings',
        totalCount_one: '{{count}} rating',
        totalCount_other: '{{count}} ratings',
        pagination: {
          pageLabel: 'Page',
          nextButton: 'Next',
          backButton: 'Back',
          firstButton: 'First',
          lastButton: 'Last',
        },
        noRatingsText: "You currently don't have any ratings",
      },
      movieDetails: {
        title: 'movie details',
        directorListHeading: 'Directed by',
        actorListHeading: 'with',
        actorListRole: "as '{{ role }}'",
        ratingsTitle: 'Your ratings',
        emptyRatingsLabel: 'Have you seen this movie?',
        newRatingButton_zero: 'Rate it!',
        newRatingButton_one: 'New',
        newRatingButton_other: 'New',
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