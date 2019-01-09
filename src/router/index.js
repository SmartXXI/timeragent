import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import store from '../store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  // Set page title
  document.title = `${to.meta.name} | Timer Agent`;

  const token = localStorage.getItem('accessToken');

  if (!token && to.path !== '/login' && to.path !== '/register' && to.name !== 'verify') {
    router.push({ name: 'login' });
  }

  if (to.path === '/login' || to.path === '/register' || to.name === 'verify') {
    return next();
  }

  // Continue routing id user already fetched
  if (to.params.segment === 'personal' && store.state.user.uuid) {
    return next();
  }
  // Continue routing if organization already fetched
  if (
    to.params.segment === 'organization'
    && store.getters.organization.uuid
    && store.state.user.uuid
  ) {
    return next();
  }

  if (store.state.user.uuid === undefined && to.params.segment === 'personal') {
    store.dispatch('getMe')
      .then(() => next())
      .catch((error) => {
        if (error.networkError) {
          if (error.networkError.statusCode === 401) {
            localStorage.clear();
            router.push({ name: 'login' });
          }
        } else {
          router.push({ name: 'login' });
        }
      });
  }

  if (
    to.params.segment === 'organization'
    && store.getters.organization.uuid === undefined
  ) {
    if (store.state.user.uuid === undefined) {
      store.dispatch('getMe')
        .then(() => {
          store.dispatch('getOneOrganization', {
            uuid: to.params.organizationUuid,
          })
            .then(() => {
              next();
            });
        })
        .catch((error) => {
          if (error.networkError) {
            if (error.networkError.statusCode === 401) {
              localStorage.clear();
              router.push({ name: 'login' });
            }
          }
        });
    } else {
      store.dispatch('getOneOrganization', {
        uuid: to.params.organizationUuid,
      })
        .then(() => {
          next();
        });
    }
  }
});


export default router;
