import 'es6-promise/auto';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Vuelidate);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el        : '#app',
    router,
    store,
    template  : '<App/>',
    components: { App },
});

