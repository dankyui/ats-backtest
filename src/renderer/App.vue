<template>
  <div id="app">
    <v-app>
      <div v-if="currentPath!='/'">
        <v-navigation-drawer fixed :clipped="clipped" v-model="drawer" app disable-resize-watcher temporary>
          <v-list>
            <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
              <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="$t(item.title)"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app :clipped-left="clipped">
          <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title v-text="$t(title)"></v-toolbar-title>
          <v-spacer></v-spacer>
          <b>{{$t('loginAs')}}{{this.$store.state.User.username}}</b>
        </v-toolbar>
        <v-content v-loading.fullscreen.lock="loading">
          <v-container fluid fill-height>
            <v-slide-y-transition mode="out-in">
              <router-view></router-view>
            </v-slide-y-transition>
          </v-container>
        </v-content>
        <v-footer style="background-color:transparent" app>
          <v-spacer></v-spacer>
          <span>&copy; Alpha ATS 2017</span>
        </v-footer>
      </div>
      <div v-if="currentPath=='/'">
        <router-view></router-view>
      </div>
    </v-app>
  </div>
</template>

<script>
  import {
    mapActions
  } from 'vuex'

  export default {
    name: 'AlphaSystem',
    data: () => ({
      clipped: false,
      drawer: false,
      fixed: false,
      items: [{
          icon: 'home',
          title: 'menuHome',
          to: '/main'
        },
        {
          icon: 'trending_up',
          title: 'menuStrategy',
          to: '/strategy'
        },
        {
          icon: 'equalizer',
          title: 'menuBacktest',
          to: '/backtest'
        },
        {
          icon: 'bubble_chart',
          title: 'menuStock',
          to: '/stock'
        },
        {
          icon: 'settings',
          title: 'menuSetting',
          to: '/setting'
        },
        {
          icon: 'account_circle',
          title: 'menuLogout',
          to: '/'
        }
      ],
      time: ''
    }),
    mounted() {
      console.log('APP mount')
      this.$root.backtestCharts=[]
      this.timer()
      this.onResize()
      window.addEventListener('resize', this.onResize, {
        passive: true
      })
    },
    beforeDestroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, {
          passive: true
        })
      }
    },
    methods: {
      onResize() {
        console.log(this)
        const diff = window.innerWidth - this.width
        _.map(this.$root.backtestCharts, x => {
          x.chart.setSize(x.chart.chartWidth + diff, x.chart.chartHeight)
        })
        this.width = window.innerWidth
      },
      timer() {
        setInterval(() => {
          this.time = new Date().toLocaleString()
        }, 1000)
      }
    },
    ...mapActions([
      'logout'
    ]),
    computed: {
      currentPath: {
        get() {
          return this.$route.path
        },
        set() {}
      },
      title: {
        get() {
          return this.$store.state.Page.title
        },
        set() {}
      },
      loading: {
        get() {
          return this.$store.state.Page.loading
        },
        set() {}
      }
    }
  }
</script>

<style>
  /* CSS */

  @import url('http://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
</style>
