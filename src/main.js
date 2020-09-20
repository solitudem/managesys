import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index'
import axios from 'axios'

Vue.config.productionTip = false


//配置请求路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//配置请求拦截器, 添加token
axios.interceptors.request.use(config => {
  //为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须返回config
  return config
})
Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
