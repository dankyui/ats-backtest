<template>
  <v-app>
    <main>
      <v-container fluid fill-height>
        <vue-particles color="#C0C0C0" linesColor="#808080" style="position: absolute;width: 100%;height: 100%;"></vue-particles>
        <v-layout flex align-center justify-center>
          <v-flex xs12 sm4>
            <v-toolbar class="pb-3 pt-3 blue">
              <v-toolbar-title class="white--text">{{ $t('signin')}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-flex xs12 sm6>
                  <v-btn-toggle mandatory v-model="toggle_one">
                    <v-btn flat @click="setLanguage('en')">
                      EN
                    </v-btn>
                    <v-btn flat @click="setLanguage('zh')">
                      中文
                    </v-btn>
                  </v-btn-toggle>
                </v-flex>
              </v-toolbar-items>
            </v-toolbar>
            <v-card>
              <v-card-text class="pt-4">
                <div>
                  <v-form v-model="valid" ref="form">
                    <v-text-field :label="$t('usernamePH')" :rules="usernameRules" v-model="username" required></v-text-field>
                    <v-text-field :label="$t('passwordPH')" v-model="password" min="0" :append-icon="e1 ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (e1 = !e1)"
                      :type="e1 ? 'password' : 'text'" :rules="passwordRules" required></v-text-field>
                    <v-checkbox v-model="autoLogin" v-bind:label="$t('autoLogin')"></v-checkbox>

                    <v-layout justify-space-between>
                      <v-btn type="submit" @click="submit" :class=" { 'light-blue lighten-4' : valid, disabled: !valid } " v-loading.fullscreen.lock="loading">
                        {{ $t('submit')}}
                      </v-btn>
                      <!-- <a href="main">Forgot Password</a> -->
                    </v-layout>
                  </v-form>
                  <v-alert outline color="success" icon="check_circle" :value="this.$store.state.User.authSuccess">
                    {{$t('loginSuccess')}}
                  </v-alert>
                  <v-alert outline color="error" icon="warning" :value="errMsg!==''">
                    {{$t(errMsg)}}
                  </v-alert>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import {
    mapActions
  } from 'vuex'

  export default {
    data() {
      return {
        valid: false,
        e1: true,
        usernameRules: [
          (v) => !!v || this.$t('usernameWARN'),
        ],
        passwordRules: [
          (v) => !!v || this.$t('passwordWARN'),
        ],
        autoLogin: false
      }
    },
    methods: {
      submit(e) {
        e.preventDefault()
        if (this.$refs.form.validate()) {
          this.login({
            autoLogin: this.autoLogin
          })
        }
      },
      clear() {
        this.$refs.form.reset()
      },
      ...mapActions([
        'setLanguage',
        'loadDefaultLanguage',
        'login',
        'autoLoginFunc'
      ]),
      hasErrMsg() {
        return this.errMsg == ''
      }
    },
    mounted() {
      this.loadDefaultLanguage()
      this.autoLoginFunc()
    },
    computed: {
      toggle_one: {
        get() {
          return this.$store.state.Locale.languageId
        },
        set() {}
      },
      loading: {
        get() {
          return this.$store.state.User.loading
        },
        set() {}
      },
      username: {
        get() {
          return this.$store.state.User.username
        },
        set(v) {
          this.$store.commit('SET_USERNAME', v)
          this.$store.commit('SET_ERR_MSG', {
            errMsg: ''
          })
        }
      },
      password: {
        get() {
          return this.$store.state.User.password
        },
        set(v) {
          this.$store.commit('SET_PASSWORD', v)
          this.$store.commit('SET_ERR_MSG', {
            errMsg: ''
          })
        }
      },
      errMsg: {
        get() {
          return this.$store.state.User.errMsg
        },
        set() {}
      }
    }
  }
</script>
