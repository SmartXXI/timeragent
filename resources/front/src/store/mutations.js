import moment from 'moment';
import * as types from './mutation-types';

export default {
    [types.GET_TASKS](state, data) {
        let activeTask;
        const tasks = data.data;
        if (tasks.length > 0
            && tasks[tasks.length - 1]
                .time_entries
                .length > 0
            && tasks[tasks.length - 1]
                .time_entries[tasks[tasks.length - 1]
                    .time_entries.length - 1]
                .active === 1) {
            activeTask = tasks[tasks.length - 1]
                .time_entries[tasks[tasks.length - 1]
                    .time_entries.length - 1]
                .id;
            Object.assign(state, {
                activeTask,
            });
        }

        Object.assign(state, {
            tasks     : data.data,
            date      : data.date,
            activeTask: state.activeTask,
        });
    },

    [types.START_TIMER](state) {
        let activeTask = {};
        let spendTime = '';
        const date = moment().format('YYYY-MM-DD');
        Object.assign(state, { spendTime: moment() });

        if (state.activeTask) {
            state.tasks.map((task) => {
                activeTask = task.time_entries.find(timeEntry => (
                    timeEntry.id === state.activeTask
                ));
                return task;
            });

            spendTime = moment.duration(moment().diff(moment(activeTask.startTime, 'YYYY-MM-DD HH:mm:ss')));
            activeTask.spendTime = moment.utc(spendTime.asMilliseconds()).format('HH:mm:ss');
        }

        const timerID = window.setInterval(() => {
            Object.assign(state, { spendTime: moment() });
            //
            if (state.date === date) {
                state.tasks.map((task) => { // find active task in all tasks
                    activeTask = task.time_entries.find(timeEntry => (
                        timeEntry.id === state.activeTask
                    ));
                    return task;
                });
                spendTime = moment.duration(moment().diff(moment(activeTask.startTime, 'YYYY-MM-DD HH:mm:ss')));

                activeTask.spendTime = moment.utc(spendTime.asMilliseconds()).format('HH:mm:ss');
            }
        }, 1000);
        Object.assign(state, {
            timerID,
            timerStarted: true,
        });
    },

    [types.STOP_TIMER](state) {
        clearInterval(state.timerID);
        Object.assign(state, {
            timerID     : 0,
            spendTime   : null,
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
    [types.DELETE_TASK](state, task) {
        const tasks = state.tasks.filter(taskInArray => taskInArray.id !== task.id);
        Object.assign(state, {
            tasks,
            activeTask   : null,
            oldActiveTask: null,
        });
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
    [types.SET_ONE_ORGANIZATION](state, organization) {
        Object.assign(state, { organization });
    },
    [types.CLEAR_ORGANIZATION](state, organization = {}) {
        Object.assign(state, { organization });
    },
};
