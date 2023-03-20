import Vue from 'vue'
import App from './App.vue'
import './plugins/element'
import router from './router/index'
import store from './store/index'
import less from 'less'
Vue.use(less)


// 全局样式表
import "./assets/css/base.css"
import 'element-ui/lib/theme-chalk/index.css';

// import 'http//at.alicdn.com/t/c/font_3916744_uslpzv0zrub.css'

import { request } from './network/request'

Vue.config.productionTip = false

Vue.prototype.$request = request

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

document.body.classList.add('light','theme-mode')
