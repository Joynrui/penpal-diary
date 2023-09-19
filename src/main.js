import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Cookies from 'js-cookie';
Vue.config.productionTip = false
Vue.use(ElementUI)


// global befored导航守卫
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token')
  if (token && to.path === '/login') {
    next({ path: '/' })
  } else
    next()
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
