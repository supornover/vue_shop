import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios

// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(
  (config) => {
    console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
