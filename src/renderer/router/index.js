import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/main',
      name: 'welcome-view',
      component: require('@/components/WelcomeView').default
    },
    {
      path: '/stock',
      name: 'stock',
      component: require('@/components/StockView').default
    },
    {
      path: '/',
      name: 'login',
      component: require('@/components/LoginView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  // setTimeout(() => {
  let title = 'ATS Backtest'
  switch (to.path) {
    case '/stock':
      title = 'Stock'
      break
  }
  store.commit('SET_TITLE', title)

  if (from.path != '/' && to.path == '/') {
    store.commit('LOGOUT', next)
  } else {
    next()
  }
  // }, 500)
})

export default router
