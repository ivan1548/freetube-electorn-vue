import './styles/main.scss'

import electron from 'electron'
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')


/* Init Settings */
import {
  initSettings
} from './api/settings';
initSettings();
/* Init Settings end */

/* Init Subscriptions end */
import {
  loadDisplaySubscriptions
} from './api/subscriptions';
loadDisplaySubscriptions()
/* Init Subscriptions end */

import $ from "jquery";
import {
  shell
} from "electron";
// Open links externally by default
$(document).on('click', 'a[href^="http"]', (event) => {
  let el = event.currentTarget;
  if (!el.href.includes('freetube')) {
    event.preventDefault();
    shell.openExternal(el.href);
  } else {
    window.open(el.href, "_self");
  }
});

// Open links externally on middle click.
$(document).on('auxclick', 'a[href^="http"]', (event) => {
  let el = event.currentTarget;
  if (!el.href.includes('freetube')) {
    event.preventDefault();
  } else {
    event.preventDefault();
    let url = el.href.replace('freetube://', '');
    shell.openExternal(el.href);
  }
});



import parseSearchText from './api/search';
electron.ipcRenderer.on('ping', function (event, message) {
  console.log(message);
  let url = message[1].replace('freetubeelectornvue://', '');
  parseSearchText(url);
});