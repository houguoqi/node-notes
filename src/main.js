// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'; // Vant组件库
import 'vant/lib/index.css';
import 'vant/lib/icon/local.css';
import ElementUI from 'element-ui'; // elementui
import 'element-ui/lib/theme-chalk/index.css';
import "lib-flexible/flexible.js" // rem适配
import less from 'less'
import store from "./store/index"; // 暴露全局store
import axios from "axios";

import './public/index.css' // 引入公共css
Vue.prototype.$store = store
Vue.prototype.$http = axios


Vue.use(less)
Vue.use(Vant);
Vue.use(ElementUI);
Vue.config.productionTip = false

console.log(process.env, "process.env.VUE_APP_BASE_URL")

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
