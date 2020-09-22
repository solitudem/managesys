import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

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
Vue.component('tree-table', ZkTable)

//时间过滤器
Vue.filter('dateFormat',function(time){
  const t = new Date(time)

  const y = t.getFullYear()
  const m = (t.getMonth() + 1 + '').padStart(2, '0')
  const d = (t.getDay() + '').padStart(2,'0')
  const hh = (t.getHours() + '').padStart(2, '0')
  const mm = (t.getMinutes() + '').padStart(2, '0')
  const ss = (t.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
