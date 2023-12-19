import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/AuthStore';
import { useMainStore } from './stores/MainStore';
import Layout from './layouts/Layout.vue';

// Pages
import MediaItemSearch from './pages/MediaItemSearch.vue';
import MediaItemDetails from './pages/MediaItemDetails.vue';
import Auth from './pages/Auth.vue';
import NotFound from './pages/NotFound.vue';
import Ratings from './pages/Ratings.vue';

export default () => {
  const routes = [
    {
      path: '/',
      name: 'Home',
      component: MediaItemSearch,
    },
    { path: '/tv/:id', name: 'TvDetails', component: MediaItemDetails, meta: { public: true, mediaType: 'tv' } },
    {
      path: '/movie/:id',
      name: 'MovieDetails',
      component: MediaItemDetails,
      meta: { public: true, mediaType: 'movie' },
    },
    {
      path: '/ratings',
      name: 'Ratings',
      component: Ratings,
      meta: { public: false },
    },
    {
      path: '/login',
      name: 'Login',
      component: Auth,
      props: { authPage: 'login' },
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: Auth,
      props: { authPage: 'register' },
      meta: { public: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { public: true },
    },
  ];

  console.log('Creating Vue Router');
  const router = createRouter({
    base: '/',
    history: import.meta.env.SSR
      ? createMemoryHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/:pathMatch(.*)*',
        component: Layout,
        children: routes,
        meta: { public: true },
      },
    ],
  });

  // https://router.vuejs.org/guide/advanced/navigation-guards.html
  router.beforeEach(async (to) => {
    console.log('Vue router navigation guard run');

    console.log(`Navigating to: ${to.name}`);
    console.log(to);

    const authStore = useAuthStore();
    const mainStore = useMainStore();
    const isPublic = to.meta.public === true;

    // Initialise app state
    mainStore.populateAppStateFromQuery(to.query);

    // If user is not authenticated...
    if (!isPublic && !authStore.credentials) {
      console.log("Unauthenticated user trying to access protected route.Redirecting to '/login' page");
      // Redirect to login if credentials are invalid
      return { path: '/login', replace: true };
    }
  });

  return router;
};
