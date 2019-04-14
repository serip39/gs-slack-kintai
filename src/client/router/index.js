import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/pages/login'
import Timesheet from '@/pages/timesheet'
import Vacation from '@/pages/apply/vacation'

Vue.use(VueRouter)

const routes = [
  // { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/timesheet',
    component: Timesheet
  },
  {
    path: '/apply/vacation',
    component: Vacation
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
