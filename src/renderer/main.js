import "./styles/main.scss";

import Vue from "vue";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./init/events";
import "./init/preload";

// eslint-disable-next-line global-require
if (!process.env.IS_WEB) Vue.use(require("vue-electron"));

// eslint-disable-next-line no-multi-assign
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: "<App/>"
}).$mount("#app");
