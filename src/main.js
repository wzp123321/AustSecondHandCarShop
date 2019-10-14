// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import BootstrapVue from 'bootstrap-vue'
import Antd from 'ant-design-vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.css'
import $ from 'jquery'
// 引入阿里图标库
import '../static/css/icon.css'
// 被迫引入 
import 'url-search-params-polyfill'
// 引入echarts
import echarts from 'echarts'
// 引入animate
import animate from 'animate.css'



Vue.use(BootstrapVue)
Vue.use(ElementUI)
Vue.use(Antd)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts // 将echarts存到Vue原型中

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (window.sessionStorage.getItem('adminLogin')) { // 通过vuex state获取当前的token是否存在
      next()
    }else {
      next({
        path: '/signin',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.matched.length === 0) {
    from.name ? next({
      name: from.name
    }) : next('/errorinfo')
  }

  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App},
  template: '<App/>'
})
