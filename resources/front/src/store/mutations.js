import * as types from './mutation-types';
import moment from 'moment'; //eslint-disable-line
import {HTTP} from '../main.js';

export default {
    [types.GET_TASKS](state, data) {
        state.tasks = data.data;
        state.date = data.date;

        if (state.tasks.length > 0 && state.tasks[state.tasks.length - 1].active == true) {
            state.activeTask = state.tasks.length - 1;
        }
    },

    [types.START_TIMER](state) {
    	state.timerID = window.setInterval(function() {                                 //eslint-disable-line
        state.spendTime = moment();                                                     //eslint-disable-line
        const activeTask = state.tasks[state.activeTask];
        // activeTask.spendTime = moment().diff(activeTask.startTime, 'minutes');
        const spendTime = moment.duration(moment().diff(moment(activeTask.startTime, 'HH:mm:ss')));
        activeTask.spendTime = moment.utc(spendTime.asMilliseconds()).format('HH:mm:ss');
        }, 1000);                                                                       //eslint-disable-line
        state.timerStarted = true;                                                      //eslint-disable-line
    },

    [types.STOP_TIMER](state) {
        clearInterval(state.timerID);
        state.spendTime = null;                                                         //eslint-disable-line
        state.timerStarted = false;                                                     //eslint-disable-line
    },

    [types.CREATE_TASK](state, task) {
        state.tasksExists = true;                                                       //eslint-disable-line
        task.startTime = moment().format('HH:mm:ss');                                    //eslint-disable-line
        state.tasks.push(task);//eslint-disable-line
        state.activeTask = state.tasks.length - 1;//eslint-disable-line
    },

    [types.UPDATE_TASK](state, task) {
        Object.assign(state.tasks[task.index], task.task);                              //eslint-disable-line
    },

    [types.CONTINUE_TASK](state) {
        let activeTask = state.tasks[state.activeTask];                                 //eslint-disable-line
        activeTask.active = true;                                                       //eslint-disable-line
        activeTask.endTime = null;
    },

    [types.STOP_TASK](state, task) {
        //reload task
        Object.assign(state.tasks[task.index], task.task);

        // if (moment.duration(activeTask.spendTime).minutes() < 1) {
        //     state.tasks.splice(state.activeTask, 1);
        //     state.activeTask = null;                                                    //eslint-disable-line
        // }
        // if (state.tasks.length === 0) {
        //     state.tasksExists = false;                                                  //eslint-disable-line
        // }
    },
    [types.DELETE_TASK](state, task) {
        state.tasks.splice(task.index, 1);
        state.activeTask = null;
    },

    [types.ADD_TIME_ENTRY](state, task) {
        state.tasks = state.tasks.concat(task);//eslint-disable-line
        state.tasksExists = true;//eslint-disable-line
    },
};
