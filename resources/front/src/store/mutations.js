import moment from 'moment';
import * as types from './mutation-types';

export default {
    [types.GET_TASKS](state, data) {
        let activeTask;

        if (state.tasks.length > 0 && state.tasks[state.tasks.length - 1].active === true) {
            activeTask = state.tasks.length - 1;
        }

        Object.assign(state, {
            tasks: data.data,
            date : data.date,
            activeTask,
        });
    },

    [types.START_TIMER](state) {
        const timerID = window.setInterval(() => {
            const activeTask = state.tasks[state.activeTask];
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
        const activeTask = state.tasks[state.activeTask];
        activeTask.active = true;
        activeTask.endTime = null;
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
};
