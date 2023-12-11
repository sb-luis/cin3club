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

export const routes = [
  {
    path: '/',
    component: MediaItemSearch,
  },
  { path: '/tv/:id', name: 'tvDetails', component: MediaItemDetails, meta: { public: true, mediaType: 'tv' } },
  { path: '/movie/:id', name: 'movieDetails', component: MediaItemDetails, meta: { public: true, mediaType: 'movie' } },
  {
    path: '/ratings',
    name: 'ratings',
    component: Ratings,
    meta: { public: false },
  },
  {
    path: '/login',
    name: 'login',
    component: Auth,
    props: { authPage: 'login' },
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'register',
    component: Auth,
    props: { authPage: 'register' },
    meta: { public: true },
  },
];

const router = createRouter({
  history: import.meta.env.SSR
    ? createMemoryHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: routes,
      meta: { public: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { public: true },
    },
  ],
});

// https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const mainStore = useMainStore();
  const isPublic = to.meta.public === true;

  // Initilise app state
  mainStore.populateAppStateFromQuery(to.query);

  // If user is not authenticated...
  if (!isPublic && !authStore.credentials) {
    // Try loading the credentials
    await authStore.loadCredentials();

    if (!authStore.credentials) {
      console.log('Redirecting to /login page');
      // Redirect to login if credentials are invalid
      return { path: '/login', replace: true };
    }
  }
});

export default router;
