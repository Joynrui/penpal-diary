import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {checkToken} from './components/GlobalToken.js'
import axios from 'axios'
Vue.config.productionTip = false
Vue.use(ElementUI)

//设置axios基础url，所有请求都由此url添加后缀而成
axios.defaults.baseURL = 'http://localhost:8081';
// Set axios to a global  custom attribute, every componentscan access directly inside.
Vue.prototype.$http = axios;
// 检查token
checkToken();
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
