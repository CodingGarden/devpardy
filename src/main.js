import '@babel/polyfill';
import Vue from 'vue';
import './plugins/bootstrap-vue';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import db from './db';

console.log(db);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
