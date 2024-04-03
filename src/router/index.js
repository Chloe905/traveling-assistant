import { createRouter, createWebHashHistory } from 'vue-router'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    // path: '*', used in vue router 3 
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
