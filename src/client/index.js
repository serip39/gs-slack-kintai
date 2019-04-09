import Vue from 'vue'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { sync } from './router/gas-router-sync'

Vue.config.productionTip = false

Vue.use(Buefy)

sync(router)

/* eslint-disable */
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
/* eslint-disable */
