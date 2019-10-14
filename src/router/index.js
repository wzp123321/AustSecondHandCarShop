import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/signin',
    name: 'signin',
    component: resolve => require(['@/components/signin/index.vue'], resolve),
    meta: {
      title: '管理后台-登录界面'
    }
  },
    {
      path: '/errorinfo',
      name: 'errorinfo',
      component: resolve => require(['@/components/404/index.vue'], resolve),
      meta: {
        title: '管理后台-错误页面'
      }
    },
    {
      path: '/background',
      name: 'background',
      component: resolve => require(['@/components/background'], resolve),
      children: [{
        path: '/background/dashboard',
        name: 'dashboard',
        component: resolve => require(['@/components/background/dashboard/index.vue'], resolve),
        meta: {
          title: '管理后台-首页',
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        }
      },
        {
          path: '/background/container/users',
          name: 'users',
          component: resolve => require(['@/components/background/appContainer/users'], resolve),
          children: [{
            path: '/background/container/users/userslist',
            component: resolve => require(['@/components/background/appContainer/users/userlist.vue'], resolve),
            meta: {
              title: '管理后台-用户列表页面',
              requireAuth: true
            }
          },
            {
              path: '/background/container/users',
              redirect: '/background/container/users/userslist'
            }
          ]
        },
        {
          path: '/background/container/cars',
          name: 'cars',
          component: resolve => require(['@/components/background/appContainer/cars'], resolve),
          children: [{
            path: '/background/container/cars/carslist',
            component: resolve => require(['@/components/background/appContainer/cars/carlists.vue'], resolve),
            meta: {
              title: '管理后台-汽车列表页面',
              requireAuth: true
            }
          },
            {
              path: '/background/container/cars',
              redirect: '/background/container/cars/carslist'
            }
          ]
        },
        {
          path: '/background/container/dics',
          name: 'dics',
          component: resolve => require(['@/components/background/appContainer/dictionaries'], resolve),
          children: [{
            path: '/background/container/dics/dicslist',
            component: resolve => require(['@/components/background/appContainer/dictionaries/dicLists.vue'], resolve),
            meta: {
              title: '管理后台-字典列表页面',
              requireAuth: true
            }
          },
            {
              path: '/background/container/dics',
              redirect: '/background/container/dics/dicslist'
            }
          ]
        },
        {
          path: '/background/container/orders',
          name: 'order',
          component: resolve => require(['@/components/background/appContainer/orders'], resolve),
          children: [{
            path: '/background/container/orders/finish',
            component: resolve => require(['@/components/background/appContainer/orders/orderlist/finishOrder.vue'], resolve),
            meta: {
              title: '管理后台-完成订单列表页面',
              requireAuth: true
            }
          },
            {
              path: '/background/container/orders',
              redirect: '/background/container/orders/finish'
            }
          ]
        },
        {
          path: '/background',
          redirect: '/background/dashboard'
        }
      ]
    },
    {
      path: '/',
      redirect: '/background'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  },
  history: true
})
