import moment from 'moment';
import * as types from './mutation-types';

import { gqMutation, gqQuery } from '../helpers';

export default {
  setTimerId({ commit }, { timerId }) {
    commit('SET_TIMER_ID', timerId);
  },

  getTasks({ commit }, payload) {
    let date = '';
    if (payload.date === undefined) {
      date = moment().format('YYYY-MM-DD');
    } else {
      ({ date } = payload);
    }
    return gqQuery('fetchTasks', {
      userUuid: payload.userUuid,
      organizationUuid: payload.orgUuid,
      date,
    })
      .then(({ fetchTasks }) => {
        commit('SET_TASKS', {
          tasks: fetchTasks,
          date,
        });
      });
  },

  createTask({ commit }, payload) {
    return gqMutation('CREATE_TASK', { task: payload.task })
      .then(({ createTask }) => {
        commit('SET_ONE_TASK', createTask);
      });
  },

  updateTask({ commit }, { task, date }) {
    return gqMutation('UPDATE_TASK', { task, date })
      .then(({ updateTask }) => commit('SET_ONE_TASK', updateTask));
  },

  deleteTask({ commit }, { uuid, uuids }) {
    return gqMutation('DELETE_TASK', { uuid, uuids })
      .then(() => commit('DELETE_TASK', { uuid, uuids }));
  },

  createTimeEntry({ dispatch, commit }, { timeEntry }) {
    return gqMutation('CREATE_TIME_ENTRY', {
      timeEntry,
    })
      .then(({ createTimeEntry }) => {
        commit('SET_TIME_ENTRY', createTimeEntry);
        if (createTimeEntry.active === true) {
          dispatch('setActiveTimeEntry', createTimeEntry.uuid);
        }
      });
  },

  setActiveTimeEntry({ commit }, uuid) {
    commit('SET_ACTIVE_TIME_ENTRY', uuid);
  },

  updateTimeEntry({ commit }, { timeEntry }) {
    return gqMutation('UPDATE_TIME_ENTRY', {
      timeEntry,
    })
      .then(({ updateTimeEntry }) => {
        commit('SET_TIME_ENTRY', updateTimeEntry);
      });
  },

  deleteTimeEntry({ commit }, { timeEntry }) {
    return gqMutation('DELETE_TIME_ENTRY', {
      uuid: timeEntry.uuid,
    })
      .then(() => commit('DELETE_TIME_ENTRY', timeEntry));
  },

  getMe({ commit }) {
    return gqQuery('fetchMe')
      .then(({ fetchMe }) => commit('SET_ME', fetchMe));
  },

  updateUser(context, { user }) {
    return gqMutation('UPDATE_USER', {
      user,
    })
      .then(({ data }) => data);
  },

  clearUser(context) {
    context.commit(types.CLEAR_USER);
  },
  validateEmail({ commit }, { email }) {
    return gqQuery('getUser', { email })
      .then(({
        users: [user],
      }) => commit('SET_EXISTS_EMAIL', user));
    // return Http.post('/api/user/validate-email', { email: payload.email });
  },

  getOneTeam({ commit }, { uuid }) {
    return gqQuery('fetchTeam', { uuid })
      .then(({
        fetchTeam,
      }) => {
        commit('SET_ONE_TEAM', fetchTeam);
      });
  },

  getTeams({ commit }, { ownerType, ownerUuid, userUuid }) {
    return gqQuery('fetchTeams', {
      ownerType,
      ownerUuid,
      userUuid,
    })
      .then(({ fetchTeams }) => {
        commit('SET_TEAMS', fetchTeams);
      });
  },

  searchPersonalTeams({ commit }, { queryString, userUuid }) {
    return gqQuery('searchPersonalTeams', {
      queryString,
      userUuid,
    })
      .then(({ searchPersonalTeams }) => commit('SET_PERSONAL_TEAMS', searchPersonalTeams));
  },

  searchOrganizationTeams({ commit }, { queryString, orgUuid }) {
    return gqQuery('searchOrganizationTeams', {
      queryString,
      organizationUuid: orgUuid,
    })
      .then(({ searchOrganizationTeams }) => commit(
        'SET_ORGANIZATION_TEAMS',
        searchOrganizationTeams,
      ));
  },

  createTeam(context, { team }) {
    return gqMutation('CREATE_TEAM', { team })
      .then(({ data }) => data);
  },

  updateTeam(context, { team }) {
    return gqMutation('UPDATE_TEAM', { team })
      .then(data => data);
  },

  deleteTeam(context, { uuid }) {
    return gqMutation('DELETE_TEAM', { uuid })
      .then(data => data);
  },

  clearTeam(context) {
    context.commit(types.CLEAR_TEAM);
  },

  clearTeams(context) {
    context.commit(types.CLEAR_TEAMS);
  },

  getOneProject({ commit }, { uuid }) {
    return gqQuery('fetchProject', { uuid })
      .then(({ fetchProject }) => commit('SET_ONE_PROJECT', fetchProject));
  },

  getProjects({ commit }, payload) {
    return gqQuery('fetchProjects', {
      ownerType: payload.ownerType,
      ownerUuid: payload.ownerUuid,
      userUuid: payload.userUuid,
    })
      .then(({ fetchProjects }) => commit('SET_PROJECTS', fetchProjects));
  },

  inviteToOrganization({ commit }, payload) {
    return gqMutation('UPDATE_ORGANIZATION_MEMBERS', {
      members: payload.members,
      organizationUuid: payload.orgUuid,
    })
      .then(({ updateOrganizationMembers }) => commit(
        'SET_ORGANIZATION_MEMBERS',
        updateOrganizationMembers,
      ));
  },

  createProject(context, { project }) {
    return gqMutation('CREATE_PROJECT', { project })
      .then(({ data }) => data);
  },

  updateProject(context, { project }) {
    return gqMutation('UPDATE_PROJECT', { project })
      .then(({ data }) => data);
  },

  deleteProject(context, { uuid }) {
    return gqMutation('DELETE_PROJECT', { uuid })
      .then(data => data);
  },

  clearProject(context) {
    context.commit(types.CLEAR_PROJECT);
  },

  clearProjects(context) {
    context.commit(types.CLEAR_PROJECTS);
  },

  searchAllUsers({ commit }, { queryString }) {
    return gqQuery('searchAllUsers', {
      queryString,
    })
      .then(({ searchAllUsers }) => {
        commit(types.SET_ALL_USERS, searchAllUsers);
      });
  },

  getOneOrganization({ commit }, { uuid }) {
    return gqQuery('fetchOrganization', { uuid })
      .then(({ fetchOrganization }) => commit('SET_ONE_ORGANIZATION', fetchOrganization));
  },

  createOrganization(context, { organization, userUuid }) {
    return gqMutation('CREATE_ORGANIZATION', {
      organization,
      userUuid,
    })
      .then(({ data }) => data);
  },

  updateOrganization({ commit }, { uuid, organization }) {
    return gqMutation('UPDATE_ORGANIZATION', {
      uuid,
      organization,
    })
      .then(({ updateOrganization }) => commit('SET_ONE_ORGANIZATION', updateOrganization));
  },

  searchOrganizationMembers({ commit }, payload) {
    return gqQuery('searchOrganizationMembers', {
      queryString: payload.queryString,
      organizationUuid: payload.orgUuid,
    })
      .then(({ searchOrganizationMembers }) => commit(
        'SET_ORGANIZATION_MEMBERS',
        searchOrganizationMembers,
      ));
  },

  getOrganizationMembers({ commit }, payload) {
    return gqQuery('fetchOrganizationMembers', {
      organizationUuid: payload.orgUuid,
    })
      .then(({ fetchOrganizationMembers }) => commit(
        'SET_ORGANIZATION_MEMBERS',
        fetchOrganizationMembers,
      ));
  },

  clearOrganization(context) {
    context.commit(types.CLEAR_ORGANIZATION);
  },

  clearOrganizationMembers(context) {
    context.commit(types.CLEAR_ORGANIZATION_MEMBERS);
  },

  getClients({ commit }, payload) {
    return gqQuery('fetchClients', {
      organizationUuid: payload.orgUuid,
    })
      .then(({ fetchClients }) => commit('SET_CLIENTS', fetchClients));
  },

  createClient(context, { client, contact }) {
    return gqMutation('CREATE_CLIENT', {
      client,
      contact,
    });
  },

  updateClient(context, { client, contact }) {
    return gqMutation('UPDATE_CLIENT', {
      client,
      contact,
    });
  },

  deleteClient(context, payload) {
    return gqMutation('DELETE_CLIENT', {
      clientUuid: payload.clientUuid,
      contactUuid: payload.contactUuid,
    });
  },

  getOneClient({ commit }, { uuid }) {
    return gqQuery('fetchClient', {
      uuid,
    })
      .then(({
        fetchClient,
      }) => commit('SET_ONE_CLIENT', fetchClient));
  },

  clearClient(context) {
    context.commit(types.CLEAR_CLIENT);
  },

  login(context, { user }) {
    return gqMutation('LOGIN_USER', { email: user.email, password: user.password })
      .then(({ loginUser }) => loginUser);
  },

  createUser(context, { user }) {
    gqMutation('CREATE_USER', { user })
      .then(({ data }) => data);
  },

  verifyEmail(context, { verificationCode }) {
    return gqMutation('VERIFY_EMAIL', {
      verificationCode,
    })
      .then(data => data)
      .catch(reject => reject);
  },

  logout() {
    localStorage.clear();
  },

  startLoading({ commit }) {
    commit('START_LOADING');
  },

  stopLoading({ commit }) {
    commit('STOP_LOADING');
  },
};
