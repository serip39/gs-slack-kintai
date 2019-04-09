import Vue from 'vue'
import App from './App'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false

Vue.use(Buefy)

/* eslint-disable */
const app = new Vue({
  el: '#app',
  render: h => h(App)
})
/* eslint-disable */
