import 'es6-promise/auto';
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import ElementUI from 'element-ui';
import { Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import store from './store';

Vue.use(Vuelidate);
Vue.use(ElementUI);

Vue.prototype.$notify = Notification;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el        : '#app',
    router,
    store,
    template  : '<App/>',
    components: { App },
});

