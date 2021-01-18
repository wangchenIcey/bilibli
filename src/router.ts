import { createWebHistory, createRouter } from 'vue-router'
const history = createWebHistory()
import Layout from './layout/index.vue'
const router = createRouter({
  history,
  routes: [
    {
      path:'/login',
      component:() => import('./components/login/index.vue'),
    },
    {
      path:'/demo',
      component:() => import('./views/demo.vue'),
    },
    {
      path: '/',
      component: Layout,
      redirect: '',
      children: [{
        path: '',
        component: () => import('./views/index.vue')
      }
      ]
    }
  ]
})
export default router;