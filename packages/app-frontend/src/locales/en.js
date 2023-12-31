export const en = {
  translation: {
    app: {
      title: 'cin3club',
      footer: {
        license: 'Released under the MIT License',
        copyright: 'Copyright © {{year}} Luis Sanchez Barranquero',
      },
      nav: {
        langSelectionLabel: 'Language',
        englishOptionLabel: 'English',
        spanishOptionLabel: 'Spanish',
        mediaItemSearchLink: 'search',
        ratingsLink: 'ratings',
        listsLink: 'lists',
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
      mediaItemRatings: {
        title: 'ratings',
        totalCount_one: '{{count}} rating',
        totalCount_other: '{{count}} ratings',
        searchCatalogButton: 'Search movies and TV shows in our catalog',
        sort: {
          sortTypeLabel: 'Sort by',
          sortByScoreLabel: 'Score',
          sortByDateLabel: 'Date',
          sortOrderAscendingLabel: 'asc',
          sortOrderDescendingLabel: 'desc',
        },
        pagination: {
          pageLabel: 'Page',
          nextButton: 'Next',
          backButton: 'Back',
          firstButton: 'First',
          lastButton: 'Last',
        },
        noRatingsText: "You currently don't have any ratings",
      },
      mediaItemLists: {
        title: 'lists',
        totalCount_one: '{{count}} list',
        totalCount_other: '{{count}} lists',
        noListsText: "You currently don't have any lists",
        createButton: 'New List',
      },
      mediaItemListDetails: {
        title: 'list details',
        noMediaItemsText: `You currently don't have any movie or TV show in your list`,
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
      tvDetails: {
        title: 'tv show details',
        createdByHeading: 'Created by',
        actorListHeading: 'with',
        actorListRole: "as '{{ role }}'",
        ratingsTitle: 'Your ratings',
        emptyRatingsLabel: 'Have you seen this TV show?',
        newRatingButton_zero: 'Rate it!',
        newRatingButton_one: 'New',
        newRatingButton_other: 'New',
        episodeCount_one: '{{count}} episode',
        episodeCount_other: '{{count}} episodes',
        seasonCount_one: '{{count}} season',
        seasonCount_other: '{{count}} seasons',
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
        create: { title: 'Rate this', submitButton: 'Rate' },
        update: { title: 'Edit your rating', submitButton: 'Update', deleteButton: 'Delete Rating' },
        scoreLabel: 'Score (0-100)',
        dateSeenLabel: 'Date Seen',
      },
      listForm: {
        create: { title: 'Create List', submitButton: 'Create List' },
        update: { title: 'Edit List', submitButton: 'Update List', deleteButton: 'Delete List' },
        titleLabel: 'Title',
        descriptionLabel: 'Description',
      },
      mediaItemSearch: {
        title: 'search',
        mediaItemNotFound: "we can't find any movie or TV show matching that name",
        searchLabel: 'Search for a movie or TV show',
        searchPlaceholder: 'search',
      },
    },
  },
};
