<template>
  <div id="app">
    <v-app>
      <div v-if="currentPath!='/'">
        <v-navigation-drawer fixed :clipped="clipped" v-model="drawer" app>
          <v-list>
            <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
              <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app :clipped-left="clipped">
          <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title v-text="title"></v-toolbar-title>
          <v-spacer></v-spacer>
          <div>{{time}}</div>
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
    name: 'ats-backtest',
    data: () => ({
      clipped: false,
      drawer: false,
      fixed: false,
      items: [{
          icon: 'apps',
          title: 'Home',
          to: '/main'
        },
        {
          icon: 'bubble_chart',
          title: 'Stock',
          to: '/stock'
        },
        {
          icon: 'bubble_chart',
          title: 'Run a backtest',
          to: '/asdasd'
        },
        {
          icon: 'bubble_chart',
          title: 'Logout',
          to: '/'
        }
      ],
      time: ''
    }),
    mounted() {
      this.timer()
    },
    methods: {
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
