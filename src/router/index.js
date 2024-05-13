import { createRouter, createWebHashHistory } from 'vue-router'
import SignIn from '../views/SignIn.vue'
import NotFound from '../views/NotFound.vue'
import HomePage from '../views/HomePage.vue'
import TripDetail from '../views/TripDetail.vue'

const routes = [
  {
    path: '/signin',
    name: 'sign-in',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/trips',
    name: 'home-page',
    component: HomePage
  },
  {
    path: '/trips/:id',
    name: 'TripDetail',
    component: TripDetail
  },
  {
    // path: '*', used in vue router 3 
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
