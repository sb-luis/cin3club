import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/AuthStore';
import Layout from './layouts/Layout.vue';

// Pages
import Home from './pages/Home.vue';
import Profile from './pages/Profile.vue';
import Movies from './pages/Movies.vue';
import Auth from './pages/Auth.vue';
import NotFound from './pages/NotFound.vue';

// Profile Pages
import UserProfile from './components/UserProfile.vue';
import UserRatings from './components/UserRatings.vue';

export const routes = [
  { path: '/', component: Home },
  { path: '/movies', component: Movies },
  {
    path: '/me',
    component: Profile,
    children: [
      { path: '', component: UserProfile },
      { path: 'ratings', component: UserRatings },
    ],
  },
  {
    path: '/login',
    component: Auth,
    props: { authPage: 'login' },
  },
  {
    path: '/register',
    component: Auth,
    props: { authPage: 'register' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: routes,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});

// https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach(async (to) => {
  const publicPaths = ['/', '/login', '/register'];
  const authStore = useAuthStore();

  // If user is not authenticated...
  if (!publicPaths.includes(to.path) && !authStore.credentials) {
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
