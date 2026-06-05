import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingPage.vue'),
      meta: { public: true, fullBleed: true }
    },
    {
      path: '/signin',
      name: 'sign-in',
      component: () => import('@/views/SignIn.vue'),
      meta: { public: true }
    },
    {
      path: '/signup',
      name: 'sign-up',
      component: () => import('@/views/SignUp.vue'),
      meta: { public: true }
    },
    {
      path: '/join/:token',
      name: 'join-trip',
      component: () => import('@/views/JoinTrip.vue'),
      meta: { public: true }
    },
    {
      path: '/recommended/:season',
      name: 'recommended-journey',
      component: () => import('@/views/RecommendedJourney.vue'),
      meta: { public: true }
    },
    {
      path: '/trips',
      name: 'trips',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/trips/:id',
      name: 'trip-detail',
      component: () => import('@/views/TripDetail.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { public: true }
    }
  ]
})

router.beforeEach(to => {
  const authStore = useAuthStore()

  if (!to.meta.public && !authStore.isAuthenticated) {
    return { name: 'sign-in' }
  }

  if (to.meta.public && authStore.isAuthenticated && ['sign-in', 'sign-up'].includes(String(to.name)) && !to.query.redirect) {
    return { name: 'trips' }
  }

  return true
})

export default router
