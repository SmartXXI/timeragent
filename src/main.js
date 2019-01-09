// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'es6-promise/auto';
import Vuelidate from 'vuelidate';
import ElementUI, { Notification } from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import VueApollo from 'vue-apollo';
import App from './App';
import router from './router';
import store from './store';
import apolloClient from './graphql';

Vue.use(VueApollo);
Vue.use(apolloClient);
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(ElementUI, { locale });

Vue.prototype.$notify = Notification;

Vue.config.productionTip = false;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
