import * as types from './mutation-types';

export default {
  [types.SET_TASKS](state, { tasks, date }) {
    const extensibleTasks = JSON.parse(JSON.stringify(tasks));
    Object.assign(state, {
      date,
      tasks: extensibleTasks,
    });
  },

  [types.SET_ONE_TASK](state, task) {
    const { tasks } = state;
    const existed = tasks.find(localTask => localTask.uuid === task.uuid);

    if (existed) {
      const index = tasks.findIndex(localTask => localTask.uuid === existed.uuid);
      tasks.splice(index, 1);
      tasks.splice(index, 0, task);
    } else {
      tasks.push(task);
    }

    Object.assign(state, {
      tasks,
    });
  },
  [types.SET_TIMER_ID](state, timerId) {
    Object.assign(state, {
      timerId,
      activeTimeEntry: null,
    });
  },

  [types.STOP_TIMER](state) {
    clearInterval(state.timerID);
    Object.assign(state, {
      timerID: 0,
      spendTime: null,
      timerStarted: false,
    });
  },
  [types.STOP_TASK](state, payload) {
    if (payload.withDelete) {
      Object.assign(state, { oldActiveTask: null });
    } else {
      Object.assign(state, { oldActiveTask: state.activeTask });
    }
    Object.assign(state, { activeTask: null });
  },
  [types.DELETE_TASK](state, { uuid, uuids }) {
    let tasks = [];

    if (uuids.length > 0) {
      tasks = [];
    } else {
      tasks = state.tasks.filter(taskInArray => taskInArray.uuid !== uuid);
    }
    Object.assign(state, {
      tasks,
      activeTask: null,
      oldActiveTask: null,
    });
  },

  [types.SET_TIME_ENTRY](state, timeEntry) {
    const tasks = Object.assign(state.tasks);

    const taskIndex = tasks.findIndex(task => task.uuid === timeEntry.taskUuid);

    if (taskIndex === -1) {
      return;
    }

    const timeEntryIndex = tasks[taskIndex].timeEntries
      .findIndex(timeEntryInArray => timeEntryInArray.uuid === timeEntry.uuid);

    if (timeEntryIndex > -1) {
      Object.assign(tasks[taskIndex].timeEntries[timeEntryIndex], timeEntry);
    } else {
      tasks[taskIndex].timeEntries.push(timeEntry);
    }

    Object.assign(state, {
      tasks,
    });
  },
  [types.SET_ACTIVE_TIME_ENTRY](state, uuid) {
    Object.assign(state, {
      activeTimeEntry: uuid,
    });
  },
  [types.DELETE_TIME_ENTRY](state, timeEntry) {
    const { tasks } = state;

    const taskIndex = state.tasks
      .findIndex(taskInArray => taskInArray.uuid === timeEntry.taskUuid);
    tasks[taskIndex].timeEntries = tasks[taskIndex].timeEntries
      .filter(timeEntryInArray => timeEntryInArray.uuid !== timeEntry.uuid);

    Object.assign(state, {
      tasks,
    });
  },
  [types.SET_ME](state, user) {
    Object.assign(state, { user });
  },
  [types.SET_EXISTS_EMAIL](state, user) {
    Object.assign(state, {
      existsEmail: user.email,
    });
  },
  [types.CLEAR_USER](state, user = {}) {
    Object.assign(state, { user });
  },
  [types.SET_PERSONAL_TEAMS](state, personalTeams) {
    Object.assign(state, { personalTeams });
  },
  [types.SET_ORGANIZATION_TEAMS](state, organizationTeams) {
    Object.assign(state, { organizationTeams });
  },
  [types.SET_TEAMS](state, teams) {
    Object.assign(state, { teams });
  },
  [types.SET_ONE_TEAM](state, team) {
    Object.assign(state, { team });
  },
  [types.CLEAR_TEAM](state, team = { users: [] }) {
    Object.assign(state, { team });
  },
  [types.CLEAR_TEAMS](state, personalTeams = [], organizationTeams = []) {
    Object.assign(state, {
      personalTeams,
      organizationTeams,
    });
  },
  [types.SET_ONE_PROJECT](state, project) {
    Object.assign(state, { project });
  },
  [types.SET_PROJECTS](state, projects) {
    Object.assign(state, { projects });
  },
  [types.CLEAR_PROJECT](state, project = { teams: [], users: [] }) {
    Object.assign(state, { project });
  },
  [types.CLEAR_PROJECTS](state, personalProjects = {}, organizationProjects = {}) {
    Object.assign(state, { personalProjects, organizationProjects });
  },
  [types.SET_OWN_TEAMS](state, ownTeams) {
    Object.assign(state, { ownTeams });
  },
  [types.SET_OWN_USERS](state, ownUsers) {
    Object.assign(state, { ownUsers });
  },
  [types.SET_ALL_USERS](state, allUsers) {
    Object.assign(state, { allUsers });
  },
  [types.SET_ONE_ORGANIZATION](state, organization) {
    Object.assign(state, { organization });
  },
  [types.CLEAR_ORGANIZATION](state, organization = {}) {
    Object.assign(state, { organization });
  },
  [types.SET_CLIENTS](state, clients) {
    Object.assign(state, { clients });
  },
  [types.SET_ONE_CLIENT](state, client) {
    Object.assign(state, { client });
  },
  [types.CLEAR_CLIENT](state) {
    Object.assign(state, {
      client: {
        contacts: {},
      },
    });
  },
  [types.SET_ORGANIZATION_MEMBERS](state, organizationMembers) {
    Object.assign(state, {
      organizationMembers,
    });
  },
  [types.CLEAR_ORGANIZATION_MEMBERS](state, organizationMembers = {}) {
    Object.assign(state, {
      organizationMembers,
    });
  },
  [types.START_LOADING](state) {
    Object.assign(state, {
      loading: true,
    });
  },
  [types.STOP_LOADING](state) {
    Object.assign(state, {
      loading: false,
    });
  },
};
