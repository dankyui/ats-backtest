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
      name: 'stock-view',
      component: require('@/components/StockView').default
    },
    {
      path: '/strategy',
      name: 'strategy-view',
      component: require('@/components/StrategyView').default
    },
    {
      path: '/backtest',
      name: 'backtest-view',
      component: require('@/components/BacktestView').default
    },
    {
      path: '/setting',
      name: 'setting-view',
      component: require('@/components/SettingView').default
    },
    {
      path: '/',
      name: 'login-view',
      component: require('@/components/LoginView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  let title
  switch (to.path) {
    case '/main':
      title = 'menuHome'
      break
      case '/strategy':
      title = 'menuStrategy'
      break
      case '/backtest':
      title = 'menuBacktest'
      break
      case '/stock':
      title = 'menuStock'
      break
      case '/setting':
      title = 'menuSetting'
      break
  }
  store.commit('SET_TITLE', title)

  if (from.path != '/' && to.path == '/') {
    store.commit('LOGOUT', next)
  } else {
    next()
  }
})

export default router
