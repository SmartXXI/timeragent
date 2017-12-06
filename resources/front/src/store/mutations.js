import moment from 'moment';
import * as types from './mutation-types';

export default {
    [types.GET_TASKS](state, data) {
        let activeTask;

        if (data.data.length > 0 && data.data[data.data.length - 1].active === 1) {
            activeTask = data.data.length - 1;
        } else {
            activeTask = null;
        }

        Object.assign(state, {
            tasks: data.data,
            date : data.date,
            activeTask,
        });
    },

    [types.START_TIMER](state) {

        let activeTask = {};

        if (state.activeTask) {
            activeTask = state.tasks[state.activeTask];
        }

        Object.assign(state, { spendTime: moment() });

        const timerID = window.setInterval(() => {
            activeTask = state.tasks[state.activeTask];
            const spendTime = moment.duration(moment().diff(moment(activeTask.startTime, 'HH:mm:ss')));

            Object.assign(state, { spendTime: moment() });
            activeTask.spendTime = moment.utc(spendTime.asMilliseconds()).format('HH:mm:ss');
        }, 1000);
        Object.assign(state, {
            timerID,
            timerStarted: true,
        });
    },

    [types.STOP_TIMER](state) {
        clearInterval(state.timerID);
        Object.assign(state, {
            spendTime   : null,
            timerStarted: false,
        });
    },

    [types.CREATE_TASK](state, task) {
        Object.assign(task, { startTime: moment().format('HH:mm:ss') });
        state.tasks.push(task);

        Object.assign(state, {
            tasksExists: true,
            activeTask : state.tasks.length - 1,
        });
    },

    [types.UPDATE_TASK](state, task) {
        Object.assign(state.tasks[task.index], task.task);
    },

    [types.CONTINUE_TASK](state) {
        const activeTask = {};
        Object.assign(activeTask, state.tasks[state.activeTask]);
        activeTask.active = true;
        activeTask.endTime = null;
        Object.assign(state.tasks[state.activeTask], activeTask);
    },

    [types.STOP_TASK](state, task) {
        Object.assign(state.tasks[task.index], task.task);
    },
    [types.DELETE_TASK](state, task) {
        state.tasks.splice(task.index, 1);
        Object.assign(state, { activeTask: null });
    },

    [types.ADD_TIME_ENTRY](state, task) {
        Object.assign(state, {
            tasks      : state.tasks.concat(task),
            tasksExists: true,
        });
    },
    [types.GET_USER](state, user) {
        Object.assign(state, { user });
    },
    [types.UPDATE_USER](state, user) {
        Object.assign(state, { user });
    },
    [types.SET_TEAMS](state, teams) {
        Object.assign(state, { teams });
    },
    [types.SET_PROJECTS](state, projects) {
        Object.assign(state, { projects });
    },
    [types.SET_ONE_TEAM](state, team) {
        Object.assign(state, { team });
    },
    [types.CLEAR_TEAM](state, team = {}) {
        Object.assign(state, { team });
    },
    [types.SET_ONE_PROJECT](state, project) {
        Object.assign(state, { project });
    },
    [types.CLEAR_PROJECT](state, project = {}) {
        Object.assign(state, { project });
    },
    [types.SET_OWN_TEAMS](state, ownTeams) {
        Object.assign(state, { ownTeams });
    },
    [types.SET_OWN_USERS](state, ownUsers) {
        Object.assign(state, { ownUsers });
    },
    [types.SET_EXISTS_MEMBERS](state, existsMembers) {
        Object.assign(state, { existsMembers });
    },
};
