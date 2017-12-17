import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import Datastore from 'nedb'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import electron from 'electron'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueParticles from 'vue-particles'

import App from './App'
import router from './router'
import store from './store'
import messages from './i18n'

const app = electron.remote.app;
const userData = app.getPath('userData')
const dir = path.join(userData, '/db')

if (!fs.existsSync(dir)) {
  mkdirp.sync(dir)
}

global.db = new Datastore({
  filename: path.join(dir, '/data'),
  autoload: true
})

Vue.use(Vuetify)
Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.use(VueParticles)

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
global.router = router
global.store = store
global.rootUrl = 'https://0688tckhoj.execute-api.ap-southeast-1.amazonaws.com/dev'
/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>',
  i18n
}).$mount('#app')

Vue.prototype.$locale = {
  change(lang) {
    i18n.locale = lang
  },
  current() {
    return i18n.locale
  }
}

Vue.prototype.$rgb = {
  hsl_col_perc(percent, start, end) {
    let a = percent / 100,
      b = end * a
    const c = b + start
    //Return a CSS HSL string
    return 'hsl(' + c + ',100%,50%)' //green to red
  },
  hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
}

Vue.prototype.$math = {
  stdev(arr) {
    let n = arr.length;
    let sum = 0;

    arr.map(function (data) {
      sum += data;
    });

    let mean = sum / n;

    let letiance = 0.0;
    let v1 = 0.0;
    let v2 = 0.0;

    if (n != 1) {
      for (let i = 0; i < n; i++) {
        v1 = v1 + (arr[i] - mean) * (arr[i] - mean);
        v2 = v2 + (arr[i] - mean);
      }

      v2 = v2 * v2 / n;
      letiance = (v1 - v2) / (n - 1);
      if (letiance < 0) {
        letiance = 0;
      }
      stddev = Math.sqrt(letiance);
    }

    return {
      mean: Math.round(mean * 100) / 100,
      letiance: letiance,
      deviation: Math.round(stddev * 100) / 100
    };
  }
}

Vue.prototype.$array = {
  move(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length;
      while ((k--) + 1) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
}
