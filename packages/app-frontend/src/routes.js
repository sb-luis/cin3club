import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import { useMainStore } from './stores/MainStore';
import Layout from './layouts/Layout.vue';

// Pages
import MediaItemSearch from './pages/MediaItemSearch.vue';
import MediaItemDetails from './pages/MediaItemDetails.vue';
import NotFound from './pages/NotFound.vue';
import PollCreate from './pages/PollCreate.vue';
import PollJoin from './pages/PollJoin.vue';
import Debug from './pages/Debug.vue';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: PollCreate,
  },
  {
    path: '/search',
    name: 'Search',
    component: MediaItemSearch,
  },
  { path: '/poll/:id', name: 'LivePoll', component: PollJoin, meta: { public: true } },
  { path: '/tv/:id', name: 'TvDetails', component: MediaItemDetails, meta: { public: true, mediaType: 'tv' } },
  { path: '/movie/:id', name: 'MovieDetails', component: MediaItemDetails, meta: { public: true, mediaType: 'movie' } },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug,
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

  const mainStore = useMainStore();
  const isPublic = to.meta.public === true;

  // Initialise app state
  mainStore.populateAppStateFromQuery(to.query);
});

export default router;
