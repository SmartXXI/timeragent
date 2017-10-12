// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import moment from 'moment'; 				//eslint-disable-line
import store from './store';             	//eslint-disable-line
import axios from 'axios';  				//eslint-disable-line
import Vuelidate from 'vuelidate';

Vue.use(Vuelidate);                                                 

// require('../node_modules/bootstrap/less/bootstrap.less');

Vue.config.productionTip = false;

export const HTTP = axios.create({
  headers: {
    'X-CSRF-Token': window.Laravel.csrfToken,
  }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
});

