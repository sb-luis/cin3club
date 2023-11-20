import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/AuthStore';
import { useMainStore } from './stores/MainStore';
import Layout from './layouts/Layout.vue';

// Pages
import Movies from './pages/Movies.vue';
import Auth from './pages/Auth.vue';
import NotFound from './pages/NotFound.vue';
import RatingLister from './components/RatingLister.vue';

// Movie Pages
import MovieLister from './components/MovieLister.vue';
import MovieDetails from './components/MovieDetails.vue';

export const routes = [
  {
    path: '/',
    component: Movies,
    children: [
      { path: '', component: MovieLister },
      { path: '/movies/:id', component: MovieDetails },
    ],
    meta: { public: true },
  },
  {
    path: '/ratings',
    component: RatingLister,
    meta: { public: false },
  },
  {
    path: '/login',
    component: Auth,
    props: { authPage: 'login' },
    meta: { public: true },
  },
  {
    path: '/register',
    component: Auth,
    props: { authPage: 'register' },
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

  // If user is not authenticated...
  if (!isPublic && !authStore.credentials) {
    // Try loading the credentials
    await authStore.loadCredentials();

    if (!authStore.credentials) {
      console.log('Redirecting to /login page');
      // Redirect to login if credentials are invalid
      return { path: '/login', query: { lang: mainStore.lang }, replace: true };
    }
  }
});

export default router;
