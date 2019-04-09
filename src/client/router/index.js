import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'
import Timesheet from '@/components/timesheet'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/timesheet',
    component: Timesheet
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
