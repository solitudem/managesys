import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
