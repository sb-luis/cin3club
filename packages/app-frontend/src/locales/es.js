export const es = {
  translation: {
    app: {
      title: 'cin3club',
      footer: {
        license: 'Publicado bajo la Licencia MIT',
        copyright: 'Derechos de autor © {{year}} Luis Sánchez Barranquero',
      },
      nav: {
        langSelectionLabel: 'Idioma',
        englishOptionLabel: 'Inglés',
        spanishOptionLabel: 'Español',
        mediaItemSearchLink: 'buscar',
        ratingsLink: 'valoraciones',
        loginLink: 'inicio de sesión',
        logoutLink: 'cerrar sesión',
        registerLink: 'registro',
      },
    },
    pages: {
      home: {
        title: 'inicio',
      },
      profile: {
        title: 'perfil',
      },
      mediaItemSearch: {
        title: 'buscar',
        movieNotFound: 'No podemos encontrar ninguna película o serie que coincida con ese nombre',
        searchLabel: 'Buscar una película o serie',
        searchPlaceholder: 'buscar',
        welcomeMessage: '¡El lugar donde viven tus películas y series favoritas!',
      },
      ratings: {
        title: 'valoraciones',
        totalCount_one: '{{count}} valoración',
        totalCount_other: '{{count}} valoraciones',
        sort: {
          sortTypeLabel: 'Ordernar por',
          sortByScoreLabel: 'Puntuación',
          sortByDateLabel: 'Fecha',
          sortOrderAscendingLabel: 'asc',
          sortOrderDescendingLabel: 'desc',
        },
        pagination: {
          pageLabel: 'Página',
          nextButton: 'Siguiente',
          backButton: 'Atrás',
          firstButton: 'Primera',
          lastButton: 'Última',
        },
        noRatingsText: 'Actualmente no tienes ninguna valoración',
      },
      movieDetails: {
        title: 'detalles de la película',
        directorListHeading: 'Dirigida por',
        actorListHeading: 'con',
        actorListRole: "como '{{ role }}'",
        ratingsTitle: 'Tus valoraciones',
        emptyRatingsLabel: '¿Has visto esta película?',
        newRatingButton_zero: '¡Califícala!',
        newRatingButton_one: 'Nueva',
        newRatingButton_other: 'Nueva',
      },
      tvDetails: {
        title: 'detalles de la serie',
        createdByHeading: 'Creada por',
        actorListHeading: 'con',
        actorListRole: "como '{{ role }}'",
        ratingsTitle: 'Tus valoraciones',
        emptyRatingsLabel: '¿Has visto esta serie?',
        newRatingButton_zero: '¡Califícala!',
        newRatingButton_one: 'Nueva',
        newRatingButton_other: 'Nueva',
        episodeCount_one: '{{count}} episodio',
        episodeCount_other: '{{count}} episodios',
        seasonCount_one: '{{count}} temporada',
        seasonCount_other: '{{count}} temporadas',
      },
      login: {
        title: 'inicio de sesión',
        aliasLabel: 'Alias',
        aliasPlaceholder: 'alias',
        passwordLabel: 'Contraseña',
        passwordPlaceholder: 'contraseña',
        submitButton: 'Iniciar sesión',
      },
      register: {
        title: 'registro',
        aliasLabel: 'Alias',
        aliasPlaceholder: 'alias',
        passwordLabel: 'Contraseña',
        passwordPlaceholder: 'contraseña',
        submitButton: 'Registrarse',
      },
    },
    components: {
      ratingForm: {
        create: { title: 'Califica esta película', submitButton: 'Calificar' },
        update: { title: 'Edita tu valoración', submitButton: 'Actualizar', deleteButton: 'Eliminar valoración' },
        scoreLabel: 'Puntuación (0-100)',
        dateSeenLabel: 'Fecha de visualización',
      },
    },
  },
};
