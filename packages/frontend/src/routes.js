import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/AuthStore';
import Layout from './layouts/Layout.vue';

// Pages
import Home from './pages/Home.vue';
import Requests from './pages/Requests.vue';
import Movies from './pages/Movies.vue';
import Auth from './pages/Auth.vue';
import NotFound from './pages/NotFound.vue';

export const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'Movies', component: Movies },
  { path: '/requests', name: 'Requests', component: Requests },
  {
    path: '/login',
    name: 'Login',
    component: Auth,
    props: { authPage: 'login' },
  },
  {
    path: '/register',
    name: 'Register',
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
